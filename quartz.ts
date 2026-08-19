import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { componentRegistry } from "./quartz/components/registry"

/**
 * Sort the explorer so KTH terms read chronologically.
 *
 * Term folders are named "2024 Vår" / "2025 Höst". Sorted as plain text, "Höst"
 * (autumn) lands before "Vår" (spring) because H < V, which is wrong within a year.
 * This sorts by (year, season) fully reverse-chronologically, newest term first, so
 * the term currently being studied is always at the top of the explorer.
 *
 * IMPORTANT: the explorer serialises this function with `sortFn.toString()` and
 * rebuilds it in the browser, so it MUST be entirely self-contained. Anything
 * referenced from an enclosing scope would be undefined at runtime. That is why
 * the regex and the season table are declared inside the function body rather
 * than hoisted out.
 *
 * Note also that the docs show importing from "./.quartz/plugins", but that barrel
 * is only generated for git-installed plugins. These come from npm, so options are
 * registered directly with the component registry, before loadQuartzConfig().
 */
const sortFn = (a: any, b: any): number => {
  const termRe = /^(\d{4})\s+(Vår|Höst)$/

  const nameA: string = String(a?.displayName ?? a?.name ?? "")
  const nameB: string = String(b?.displayName ?? b?.name ?? "")

  // Matched inline rather than via a helper: esbuild wraps named inner functions
  // in its __name() helper, which does not exist once this function has been
  // serialised and rebuilt in the browser.
  const mA = nameA.match(termRe)
  const mB = nameB.match(termRe)

  if (mA && mB) {
    const yearA = parseInt(mA[1], 10)
    const yearB = parseInt(mB[1], 10)
    if (yearA !== yearB) return yearB - yearA // newest year first
    const seasonA = mA[2] === "Höst" ? 1 : 0
    const seasonB = mB[2] === "Höst" ? 1 : 0
    return seasonB - seasonA // Höst before Vår, so the ordering is reverse-chronological throughout
  }
  if (mA && !mB) return -1
  if (!mA && mB) return 1

  const aFolder = Boolean(a?.isFolder)
  const bFolder = Boolean(b?.isFolder)
  if (aFolder && !bFolder) return -1
  if (!aFolder && bFolder) return 1

  return nameA.localeCompare(nameB, "sv")
}

// The registry is keyed by plugin name; set both the short and scoped forms so
// this keeps working regardless of how the loader derives the key.
for (const key of ["explorer", "@quartz-community/explorer"]) {
  componentRegistry.setOptionOverrides(key, { sortFn })
}

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()
