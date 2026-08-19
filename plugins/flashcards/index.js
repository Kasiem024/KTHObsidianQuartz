/**
 * KTH Flashcards - Quartz v5 transformer
 *
 * The vault uses the obsidian-spaced-repetition plugin. Its card syntax publishes as
 * unreadable run-together prose, e.g.
 *
 *   Vilken metrik anvander RIP for att valja vag?:: Antal hopp (hop count).
 *
 * This rewrites each card into a collapsed Obsidian callout, which Quartz already knows
 * how to render:
 *
 *   > [!question]- Vilken metrik anvander RIP for att valja vag?
 *   > Antal hopp (hop count).
 *
 * A callout is used rather than raw <details> HTML because callout bodies are still parsed
 * as markdown, so LaTeX, wikilinks, bold and list answers keep working. Raw HTML bodies
 * would not be, since enableInHtmlEmbed is false.
 *
 * Build-time only: the vault files are never modified, so the spaced-repetition scheduler
 * and its <!--SR:...--> data stay intact.
 *
 * SCOPE: the whole note body is processed, not just a "## Flashcards" section. An earlier
 * version only looked under that heading, which silently missed 34 notes - some with 150+
 * cards - that keep their cards under a differently named heading (`## Begrepp`,
 * `## Ursprungliga Flashcards`) or interleaved with prose under chapter headings. Those
 * pages published raw `::` syntax.
 *
 * Processing the whole body is safe here, verified against the vault rather than assumed:
 *   - there are ZERO bracketed Dataview inline fields ([key:: value]) in the vault, and
 *   - no namespace-style code (std::, System::) appears outside fenced blocks.
 * Fenced code blocks, table rows and existing blockquotes are skipped regardless.
 *
 * Card forms handled (all of these occur in this vault). Note that the four separators are
 * NOT interchangeable - per the plugin's own settings, `;;` and `??` are the *reversed*
 * variants, which also generate a back-to-front card:
 *
 *   Question:: Answer            single line, one-directional
 *   Question;; Answer            single line, reversed
 *   Question ||                  multi-line, one-directional  (separator ends the line)
 *   Question                     multi-line, reversed
 *   ??                             - separator alone on its own line, answer below,
 *   - answer list                    which may be a markdown list
 *
 * Rendering collapses that distinction to a single question -> answer callout, which is
 * correct for reading; the direction only matters when reviewing in Obsidian.
 */

const SR_COMMENT = /<!--\s*SR:.*?-->/g
const SR_ONLY = /^<!--\s*SR:.*?-->\s*$/
// A separator alone on its own line.
//
// As well as ?? and ||, this vault uses "DISABLED" and "==DISABLEDFLASHCARD==" where a
// separator would go, to mark cards switched off for review. They are structurally
// identical cards, and a reader does not care about review state, so they render like any
// other card and the marker itself is dropped.
const SEP_ONLY = /^(\?\?|\|\||=*DISABLED[A-Z]*=*)\s*$/
// "Question ??" with the separator trailing the question.
const SEP_TRAILING = /^(.*\S)\s*(\?\?|\|\|)\s*$/
// "Question:: Answer" on one line. Spacing after the separator varies in the vault
// (usually one space, sometimes none), so it is not required.
const SINGLE = /^(.+?)(::|;;)\s*(.+)$/
// Same, but with a highlighted disabled marker standing in for "::", e.g.
// "Term (Definition) ==DISABLEDFLASHCARD== The answer...". Only the ==...== form is
// matched inline, since a bare "DISABLED" could be ordinary prose.
const SINGLE_DISABLED = /^(.+?)\s*==+\s*DISABLED[A-Z]*\s*==+\s*(.+)$/
const HEADING = /^#{1,6}\s/
const FENCE = /^\s*(```|~~~)/
// A hint the SR plugin uses, e.g. "Term(Definition):: ..." -> drop for display.
const QUESTION_HINT = /\s*\((?:Definition|Definitionen)\)\s*$/i

function clean(s) {
  return s.replace(SR_COMMENT, "").trim()
}

/** Lines that must never be treated as card syntax. */
function isProtected(line) {
  return line.startsWith("|") || line.startsWith(">")
}

function makeCallout(question, answerLines, type, collapsed) {
  const q = clean(question).replace(QUESTION_HINT, "").trim()
  const body = answerLines.map(clean).filter((l) => l.length > 0)
  if (!q || body.length === 0) return null

  const marker = collapsed ? "-" : "+"
  const out = [`> [!${type}]${marker} ${q}`]
  for (const line of body) out.push(`> ${line}`)
  out.push("")
  return out
}

/** Collect an answer block starting at `start`. Ends at a blank line, a heading, a fence,
 *  another separator, or the start of a new single-line card. */
function collectAnswer(lines, start) {
  const answer = []
  let j = start
  while (j < lines.length) {
    const t = lines[j].trim()
    if (t.length === 0) break
    if (HEADING.test(t)) break
    if (FENCE.test(lines[j])) break
    if (SEP_ONLY.test(t)) break
    if (SR_ONLY.test(t)) {
      j++
      continue
    }
    if (SINGLE.test(t) && !isProtected(t)) break
    // This note style writes cards on consecutive lines with no blank between them, so a
    // line whose *successor* is a bare separator is the next card's question, not part of
    // this answer. Without this the question gets swallowed and its separator is left
    // orphaned, printing as a raw "??" on the page.
    let k = j + 1
    while (k < lines.length && SR_ONLY.test(lines[k].trim())) k++
    if (k < lines.length && SEP_ONLY.test(lines[k].trim())) break
    answer.push(t)
    j++
  }
  return { answer, next: j }
}

function transformBody(lines, type, collapsed) {
  const out = []
  let i = 0
  let inFence = false

  while (i < lines.length) {
    const raw = lines[i]
    const line = raw.trim()

    // Fenced code blocks pass through untouched.
    if (FENCE.test(raw)) {
      inFence = !inFence
      out.push(raw)
      i++
      continue
    }
    if (inFence) {
      out.push(raw)
      i++
      continue
    }

    // Headings and blank lines pass through and act as block boundaries.
    if (line.length === 0 || HEADING.test(line)) {
      out.push(raw)
      i++
      continue
    }

    // Scheduler-only lines carry no reader-facing content.
    if (SR_ONLY.test(line)) {
      i++
      continue
    }

    if (isProtected(line)) {
      out.push(raw)
      i++
      continue
    }

    // An orphaned bare separator. Nothing sensible to pair it with, so drop it rather than
    // letting "??" print on the page.
    if (SEP_ONLY.test(line)) {
      i++
      continue
    }

    // A card whose answer was never written: "Term (Definition)::" with nothing after it.
    // Five of these exist in the vault. Keep the question as plain text and drop the
    // dangling separator so the page does not show raw syntax.
    const emptyAnswer = line.match(/^(.+?)(::|;;)\s*$/)
    if (emptyAnswer) {
      const q = clean(emptyAnswer[1]).replace(QUESTION_HINT, "").trim()
      out.push(q.length > 0 ? q : raw)
      i++
      continue
    }

    // 1. Single-line card.
    const single = line.match(SINGLE)
    if (single) {
      // If the following line is a bare separator, this line is the question of a
      // multi-line card, so let rule 3 handle it instead of consuming it here.
      let n = i + 1
      while (n < lines.length && SR_ONLY.test(lines[n].trim())) n++
      const nextIsSeparator = n < lines.length && SEP_ONLY.test(lines[n].trim())
      if (!nextIsSeparator) {
        const block = makeCallout(single[1], [single[3]], type, collapsed)
        if (block) {
          out.push(...block)
          i++
          continue
        }
      }
    }

    // 1b. Single-line card using an inline disabled marker instead of "::".
    const singleDisabled = line.match(SINGLE_DISABLED)
    if (singleDisabled) {
      const block = makeCallout(singleDisabled[1], [singleDisabled[2]], type, collapsed)
      if (block) {
        out.push(...block)
        i++
        continue
      }
    }

    // 2. Separator trailing the question on the same line.
    const trailing = line.match(SEP_TRAILING)
    if (trailing) {
      const { answer, next } = collectAnswer(lines, i + 1)
      const block = makeCallout(trailing[1], answer, type, collapsed)
      if (block) {
        out.push(...block)
        i = next
        continue
      }
    }

    // 3. Question block followed by a separator on its own line.
    const qBlock = []
    let j = i
    while (j < lines.length) {
      const t = lines[j].trim()
      if (t.length === 0) break
      if (HEADING.test(t)) break
      if (FENCE.test(lines[j])) break
      if (SEP_ONLY.test(t)) break
      if (SR_ONLY.test(t)) break
      if (isProtected(t)) break
      if (j > i && SINGLE.test(t)) break
      qBlock.push(lines[j].trim())
      j++
    }

    if (qBlock.length > 0 && j < lines.length && SEP_ONLY.test(lines[j].trim())) {
      const { answer, next } = collectAnswer(lines, j + 1)
      const block = makeCallout(qBlock.join(" "), answer, type, collapsed)
      if (block) {
        out.push(...block)
        i = next
        continue
      }
    }

    // Not a card: emit the block unchanged.
    if (qBlock.length > 0) {
      for (let k = i; k < j; k++) out.push(lines[k])
      i = j
      continue
    }

    out.push(raw)
    i++
  }

  return out
}

export default function KthFlashcards(userOpts) {
  const opts = {
    calloutType: "question",
    collapsed: true,
    ...(userOpts ?? {}),
  }

  return {
    name: "KthFlashcards",
    textTransform(_ctx, src) {
      if (typeof src !== "string") return src
      // Cheap bail-out: nothing to do without at least one separator.
      if (!/::|;;|\?\?|\|\||DISABLED/.test(src)) return src

      const lines = src.split("\n")

      // Never touch the frontmatter block.
      let start = 0
      if (lines[0] !== undefined && lines[0].trim() === "---") {
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === "---") {
            start = i + 1
            break
          }
        }
      }

      const head = lines.slice(0, start)
      const tail = transformBody(lines.slice(start), opts.calloutType, opts.collapsed)
      return head.concat(tail).join("\n")
    },
  }
}
