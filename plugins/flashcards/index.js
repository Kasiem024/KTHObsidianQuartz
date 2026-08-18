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
 * Using a callout rather than raw <details> HTML matters: callout bodies are still
 * parsed as markdown, so LaTeX, wikilinks and bold inside answers keep working
 * (raw HTML blocks would not, since enableInHtmlEmbed is false).
 *
 * This is a build-time transform only. The vault files are never modified, so the
 * spaced-repetition scheduler and its <!--SR:...--> data stay intact.
 *
 * Supported forms (all four are present in this vault):
 *   Question:: Answer          single line
 *   Question;; Answer          single line
 *   Question ??                answer on the following line(s)
 *   Question ||                answer on the following line(s)
 */

const SR_COMMENT = /<!--\s*SR:.*?-->/g
// A trailing hint the SR plugin uses, e.g. "Term(Definition):: ..." -> drop it.
const QUESTION_HINT = /\s*\((?:Definition|Definitionen)\)\s*$/i
// "(3)::" style cloze/interval markers on their own.
const LEADING_INDEX = /^\s*\(\d+\)\s*$/

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

function transformSection(lines, type, collapsed) {
  const out = []
  let i = 0

  while (i < lines.length) {
    const raw = lines[i]
    const line = raw.trim()

    // Stop at the next same-or-higher-level heading; leave the rest untouched.
    if (/^#{1,2}\s/.test(line)) {
      out.push(...lines.slice(i))
      return out
    }

    // Form: "Question ??" / "Question ||" with the answer on following lines.
    const multi = line.match(/^(.*\S)\s*(\?\?|\|\|)\s*$/)
    if (multi) {
      const answer = []
      let j = i + 1
      while (j < lines.length) {
        const nxt = lines[j].trim()
        if (nxt.length === 0) break
        if (/^#{1,2}\s/.test(nxt)) break
        if (/^(.*\S)\s*(\?\?|\|\|)\s*$/.test(nxt)) break
        if (/^(.+?)(::|;;)\s*(.+)$/.test(nxt)) break
        answer.push(nxt)
        j++
      }
      const block = makeCallout(multi[1], answer, type, collapsed)
      if (block) {
        out.push(...block)
        i = j
        continue
      }
    }

    // Form: "Question:: Answer" / "Question;; Answer" on one line.
    const single = line.match(/^(.+?)(::|;;)\s*(.+)$/)
    if (single && !LEADING_INDEX.test(single[1])) {
      const block = makeCallout(single[1], [single[3]], type, collapsed)
      if (block) {
        out.push(...block)
        i++
        continue
      }
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
      // elsewhere in the vault also use "::", and must not be rewritten.
      if (start === -1) return src

      const head = lines.slice(0, start + 1)
      const tail = transformSection(lines.slice(start + 1), opts.calloutType, opts.collapsed)
      return head.concat(tail).join("\n")
    },
  }
}
