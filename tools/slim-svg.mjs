#!/usr/bin/env node
/**
 * Shrink the inline Excalidraw SVGs in the built site.
 *
 * Why: the Excalidraw pages are by far the heaviest thing published — 4 to 6.8 MB each,
 * around 51 MB of the ~105 MB site. The cause is freehand geometry, not metadata: one
 * page held a single 4,592 KB <svg> with 1,731 <path> elements, and 623,612 decimal
 * numbers accounting for 5.1 MB of the 6.8 MB file, averaging 3.36 decimal places and
 * running as high as 17.
 *
 * On a canvas 26,779 units wide rendered into roughly 1,000 px, one unit is about
 * 0.04 px, so a tenth of a unit is far below anything visible. Rounding coordinates to
 * one decimal place is therefore free in visual terms.
 *
 * Two deliberate safety limits:
 *   1. Only SVGs larger than MIN_SVG_BYTES are touched. The small UI icons use a 24x24
 *      viewBox where rounding *would* be visible, and they are left completely alone.
 *   2. Only values with |v| >= 1 are rounded. Opacities, stroke widths and scale factors
 *      are typically below 1, where a tenth is a large relative change.
 *
 * Idempotent: after one pass every number has at most one decimal, so the pattern that
 * selects "two or more decimals" no longer matches anything.
 *
 * Usage:  node tools/slim-svg.mjs [directory]     (default: public)
 */

import { readdirSync, statSync, readFileSync, writeFileSync } from "node:fs"
import { join, extname } from "node:path"

const ROOT = process.argv[2] ?? "public"
const PRECISION = process.argv[3] !== undefined ? Number.parseInt(process.argv[3], 10) : 0
const MIN_SVG_BYTES = 50_000

function walk(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    const st = statSync(p)
    if (st.isDirectory()) out.push(...walk(p))
    else if (extname(p).toLowerCase() === ".html") out.push(p)
  }
  return out
}

/** Round coordinates to PRECISION decimals, leaving sub-unit values untouched. */
function slimNumbers(svg) {
  const factor = 10 ** PRECISION
  return svg.replace(/-?\d+\.\d+/g, (m) => {
    const v = Number.parseFloat(m)
    if (!Number.isFinite(v)) return m
    if (Math.abs(v) < 1) return m
    const r = Math.round(v * factor) / factor
    return Number.isInteger(r) ? String(r) : r.toFixed(PRECISION)
  })
}

const SVG_RE = /<svg\b[^>]*>[\s\S]*?<\/svg>/g

/**
 * Smallest viewBox dimension for which integer rounding is safe.
 *
 * Rounding moves a point by at most half a unit. On a canvas 1,000 units across rendered
 * into roughly 1,000 px that is half a pixel, which is the point where it could start to
 * show. Every Excalidraw drawing in this vault is far above the line — the smallest canvas
 * measured is 4033x2066 — but the check is explicit so a future small-canvas drawing is
 * skipped rather than quietly distorted. Byte size alone is not a safe proxy: a detailed
 * drawing on a tiny canvas would be large *and* fragile.
 */
const MIN_CANVAS_UNITS = 1000

function canvasIsLargeEnough(svg) {
  const vb = /viewBox="([^"]*)"/.exec(svg)
  if (!vb) return false // no viewBox, cannot reason about scale, so leave it alone
  const parts = vb[1].trim().split(/[\s,]+/).map(Number)
  if (parts.length < 4 || parts.some((n) => !Number.isFinite(n))) return false
  return Math.min(parts[2], parts[3]) >= MIN_CANVAS_UNITS
}

function count(s, needle) {
  return s.split(needle).length - 1
}

let filesSeen = 0
let filesChanged = 0
let bytesBefore = 0
let bytesAfter = 0
let svgsSlimmed = 0
let smallCanvasSkips = 0
const failures = []

for (const file of walk(ROOT)) {
  filesSeen++
  const original = readFileSync(file, "utf8")
  bytesBefore += Buffer.byteLength(original)

  let touched = 0
  let skippedSmallCanvas = 0
  const updated = original.replace(SVG_RE, (svg) => {
    if (Buffer.byteLength(svg) < MIN_SVG_BYTES) return svg
    if (!canvasIsLargeEnough(svg)) {
      skippedSmallCanvas++
      return svg
    }
    const slim = slimNumbers(svg)
    // Structural integrity: the shape of the drawing must be untouched.
    const same =
      count(slim, "<path") === count(svg, "<path") &&
      count(slim, 'd="') === count(svg, 'd="') &&
      count(slim, "<g") === count(svg, "<g") &&
      !/NaN|undefined/.test(slim)
    if (!same) {
      failures.push(file)
      return svg
    }
    touched++
    return slim
  })

  if (touched > 0 && updated !== original) {
    writeFileSync(file, updated, "utf8")
    filesChanged++
    svgsSlimmed += touched
  }
  smallCanvasSkips += skippedSmallCanvas
  bytesAfter += Buffer.byteLength(touched > 0 ? updated : original)
}

const mb = (n) => (n / 1024 / 1024).toFixed(1)
const saved = bytesBefore - bytesAfter
console.log(`slim-svg: scanned ${filesSeen} html files in ${ROOT}`)
console.log(`slim-svg: slimmed ${svgsSlimmed} large svg(s) across ${filesChanged} file(s)`)
console.log(
  `slim-svg: ${mb(bytesBefore)} MB -> ${mb(bytesAfter)} MB ` +
    `(saved ${mb(saved)} MB, ${((saved / bytesBefore) * 100).toFixed(1)}%)`,
)
if (smallCanvasSkips > 0) {
  console.log(
    `slim-svg: left ${smallCanvasSkips} large svg(s) alone - canvas under ` +
      `${MIN_CANVAS_UNITS} units, where rounding could show`,
  )
}
if (failures.length > 0) {
  console.error(`slim-svg: SKIPPED ${failures.length} svg(s) that failed the integrity check:`)
  for (const f of failures.slice(0, 10)) console.error("  " + f)
  process.exitCode = 1
}
