# Manual verification

**Purpose:** the checks the automated gate *cannot* catch. CI verifies counts, invariants and
broken links; it never opens a browser, never opens a phone, and never opens Obsidian. Every
item below needs a person.

**Sorted by importance, so you can stop early.** If you only have ten minutes, do
🔴 **Priority 1** and stop. Priority 2 is worth confirming after a bigger change. Priority 3 is
long-tail.

**Legend:** 📱 on your phone · 🖥️ on a desktop browser · 📓 inside Obsidian.

Site: <https://kasiem024.github.io/KTHObsidianQuartz/>

---

# 🔴 Priority 1 — the things that would actually hurt

## 1A · The flashcard deck is intact

The deck is live review data and the most valuable thing in the vault. Automation checks that
the *markers* still exist; only Obsidian can confirm the plugin still parses them into cards.

- [ ] 📓 Open the spaced-repetition panel. The **HE1033** and **HI1029** decks show a
      plausible number of due cards — not zero, and not roughly half what you expect.
      (The plugin only scans those two tags, so other courses showing nothing is correct.)
- [ ] 📓 Review two or three cards. Question shows first, answer reveals, grading advances the
      schedule.
- [ ] 📓 Open `HE1033 Begrepp Föreläsning 6-7` and check a reversed card (`;;` or `??`) still
      generates a back-to-front card. If reversed cards vanished, a separator was rewritten.

## 1B · Flashcards read well on the published site

- [ ] 📱 Open any `Begrepp` note. Each card is a **collapsed** callout showing only the
      question. Tapping expands it.
- [ ] 📱 Expand a card whose answer is a **list** and one containing a **formula** — both
      render properly inside the callout, not as raw text.
- [ ] 🖥️ On a page with many cards, confirm you can still read the surrounding prose — the
      callouts should not dominate the page.

## 1C · Search works in Swedish

Quartz's index is English-configured; there is no `sv-SE` locale. This is the check that
matters most for daily use.

- [ ] 🖥️ Search `räntabilitet` → the note appears. Then `rantabilitet` (no diacritic) → note
      whether it still matches. Either answer is useful; you just need to know which.
- [ ] 🖥️ Search `föreläsning` and `HE1033` → both return sensible results.
- [ ] 📱 Same two searches on the phone; the results panel is usable at that width.

## 1D · Maths and drawings are legible, not merely error-free

CI counts KaTeX *errors*. It cannot tell whether a formula is readable.

- [ ] 🖥️ Open a formula-heavy note (e.g. a `HF1012 Matematisk Statistik` note or
      `Hävstångsformeln`). Formulas render as maths, and are legible against the dark theme —
      not grey-on-grey.
- [ ] 📱 Open an Excalidraw page (`CM1005 Extern Redovisning` → `Filer`). The drawing is
      legible, pinch-zoom works, and the page loads in a few seconds rather than tens.

## 1E · Yesterday's heading change looks right

- [ ] 🖥️ Open **Nätverk MOC** and **Programmering MOC**. Each now has `Kurser` and
      `KTH-relaterat` as sections, with courses one level below. The table of contents lists
      both sections. Course headings are slightly smaller than before — confirm that reads
      well rather than looking broken.

## 1F · Images and links on a normal note

- [ ] 🖥️ Open a note with diagrams (e.g. `Resultatdiagram`). Images load — no broken-image
      icons.
- [ ] 🖥️ From the landing page, click three links. All resolve.

---

# 🟠 Priority 2 — worth confirming after a bigger change

- [ ] 🖥️ **Explorer sidebar**: terms are newest-first, `2026 Vår` at the top. This is the
      hand-written comparator, and it fails *silently* in the browser if it breaks.
- [ ] 🖥️ **Tags**: click `#begrepp` → a list of notes. Then `#studieguide`.
- [ ] 🖥️ **Backlinks**: at the bottom of a concept note, incoming links are listed.
- [ ] 🖥️ **Graph view** renders and clicking a node navigates.
- [ ] 🖥️ **Recent notes** in the left sidebar reflects what you actually edited last.
- [ ] 🖥️ **A dead PDF link**: open `Instuderingsfrågor KS2 CM1005` and click the
      `KS2 Exempel` link. It 404s — expected, because PDFs are deliberately unpublished.
      There are **43** of these. Decide whether that bothers you; if it does, the fix is to
      unlink them rather than publish copyrighted material.
- [ ] 📓 **Dashboard** and **Vault Health Report** still render inside Obsidian. Both are
      Dataview-only and deliberately excluded from the site. The Health Report's sections
      should be empty — a non-empty section is a real conformance failure the audit may not
      cover.

---

# 🟡 Priority 3 — long tail

- [ ] 🖥️ Visit a URL that does not exist → a styled 404, not a raw error.
- [ ] 🖥️ Paste a note link into a chat app → the social preview shows a sensible title and
      description, with no leftover `= this.created` text.
- [ ] 🖥️ Print or PDF-export a note → readable, not a wall of dark background.
- [ ] 🖥️ Press Tab repeatedly on a page → focus is visible as it moves.
- [ ] 📱 On mobile data rather than wifi, open an Excalidraw page → acceptable load time.

---

## If something is wrong

1. Note which item failed and what you saw.
2. If it is a *content* problem (wrong text, missing note), fix it in the vault — CI will
   check the conventions on push.
3. If it is a *rendering* problem, it belongs in the Quartz repo. Add it to
   `PROJECT-NOTES.md` or open it as a finding, and if a script could have caught it, add the
   check to `tools/check-site.mjs` so it cannot regress.
4. If an item here is no longer true — a page renamed, a feature removed — that is a finding
   **against this checklist**. Fix the item.
