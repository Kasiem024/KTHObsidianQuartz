/**
 * KTH Flashcards - Quartz v5 transformer
 *
 * The vault uses the obsidian-spaced-repetition plugin. Its card syntax publishes
 * as unreadable run-together prose, e.g.
 *
 *   Vilken metrik anvander RIP for att valja vag?:: Antal hopp (hop count).
 *
 * This rewrites each card into a collapsed Obsidian callout, which Quartz already
 * knows how to render:
 *
 *   > [!question]- Vilken metrik anvander RIP for att valja vag?
 *   > Antal hopp (hop count).
 *
 * A callout is used rather than raw <details> HTML because callout bodies are still
 * parsed as markdown, so LaTeX, wikilinks, bold and list answers keep working.
 * Raw HTML bodies would not be parsed, since enableInHtmlEmbed is false.
 *
 * Build-time only: the vault files are never modified, so the spaced-repetition
 * scheduler and its <!--SR:...--> data stay intact.
 *
 * Card forms handled (all four occur in this vault):
 *
 *   Question:: Answer            single line
 *   Question;; Answer            single line
 *   Question ??                  separator at end of the question line
 *   Question                     separator alone on its own line, with the
 *   ??                           answer on the following line(s). The answer may
 *   - a markdown list            be a list, and the question may span lines.
 */

const SR_COMMENT = /<!--\s*SR:.*?-->/g
const SR_ONLY = /^<!--\s*SR:.*?-->\s*$/
// A separator alone on its own line.
// As well as ?? and ||, this vault uses "DISABLED" and "==DISABLEDFLASHCARD=="
// where a separator would go, to mark cards switched off for review. They are
// structurally identical cards and a reader does not care about review state, so
// they render like any other card and the marker itself is dropped.
const SEP_ONLY = /^(\?\?|\|\||=*DISABLED[A-Z]*=*)\s*$/
// "Question ??" with the separator trailing the question.
const SEP_TRAILING = /^(.*\S)\s*(\?\?|\|\|)\s*$/
// "Question:: Answer" on one line.
const SINGLE = /^(.+?)(::|;;)\s*(.+)$/
// Same, but with a highlighted disabled marker standing in for "::", e.g.
// "Term (Definition) ==DISABLEDFLASHCARD== The answer...". Only the ==...==
// form is matched inline, since a bare "DISABLED" could be ordinary prose.
const SINGLE_DISABLED = /^(.+?)\s*==+\s*DISABLED[A-Z]*\s*==+\s*(.+)$/
// Only stop at a same-or-higher-level heading; "### sub" stays part of the section.
const STOP_HEADING = /^#{1,2}\s/
// A hint the SR plugin uses, e.g. "Term(Definition):: ..." -> drop for display.
const QUESTION_HINT = /\s*\((?:Definition|Definitionen)\)\s*$/i

function clean(s) {
  return s.replace(SR_COMMENT, "").trim()
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

/** Collect an answer block starting at `start`. Ends at a blank line, a heading,
 *  another separator, or the start of a new single-line card. */
function collectAnswer(lines, start) {
  const answer = []
  let j = start
  while (j < lines.length) {
    const t = lines[j].trim()
    if (t.length === 0) break
    if (STOP_HEADING.test(t)) break
    if (SEP_ONLY.test(t)) break
    if (SR_ONLY.test(t)) {
      j++
      continue
    }
    if (SINGLE.test(t)) break
    answer.push(t)
    j++
  }
  return { answer, next: j }
}

function transformSection(lines, type, collapsed) {
  const out = []
  let i = 0

  while (i < lines.length) {
    const raw = lines[i]
    const line = raw.trim()

    // Leave everything from the next same-level heading onwards untouched.
    if (STOP_HEADING.test(line)) {
      out.push(...lines.slice(i))
      return out
    }

    if (line.length === 0) {
      out.push(raw)
      i++
      continue
    }

    // Scheduler-only lines carry no reader-facing content.
    if (SR_ONLY.test(line)) {
      i++
      continue
    }

    // 1. Single-line card.
    const single = line.match(SINGLE)
    if (single) {
      const block = makeCallout(single[1], [single[3]], type, collapsed)
      if (block) {
        out.push(...block)
        i++
        continue
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
    //    Gather the contiguous non-blank lines that make up the question.
    const qBlock = []
    let j = i
    while (j < lines.length) {
      const t = lines[j].trim()
      if (t.length === 0) break
      if (STOP_HEADING.test(t)) break
      if (SEP_ONLY.test(t)) break
      if (SR_ONLY.test(t)) break
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
    heading: "Flashcards",
    calloutType: "question",
    collapsed: true,
    ...(userOpts ?? {}),
  }

  const headingRe = new RegExp(`^##\\s+${opts.heading}\\s*$`)

  return {
    name: "KthFlashcards",
    textTransform(_ctx, src) {
      if (typeof src !== "string" || src.indexOf(opts.heading) === -1) return src

      const lines = src.split("\n")
      let start = -1
      for (let i = 0; i < lines.length; i++) {
        if (headingRe.test(lines[i].trim())) {
          start = i
          break
        }
      }
      // Only touch content under the Flashcards heading. Dataview inline fields
      // elsewhere in the vault also use "::" and must not be rewritten.
      if (start === -1) return src

      const head = lines.slice(0, start + 1)
      const tail = transformSection(lines.slice(start + 1), opts.calloutType, opts.collapsed)
      return head.concat(tail).join("\n")
    },
  }
}
