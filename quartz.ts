import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { componentRegistry } from "./quartz/components/registry"

/**
 * Sort the explorer so KTH terms read chronologically.
 *
 * Term folders are named "2024 Vår" / "2025 Höst". Sorting them as plain text
 * puts "Höst" (autumn) before "Vår" (spring) because H < V, which is backwards:
 * the spring term comes first in a calendar year. This sorts by (year, season)
 * instead, newest year first so current studies sit at the top.
 *
 * Anything that is not a term folder keeps the default behaviour: folders before
 * files, then alphabetical with Swedish collation so å/ä/ö sort after z.
 *
 * NOTE: the docs show importing from "./.quartz/plugins", but that barrel is only
 * generated for git-installed plugins. These plugins come from npm, so we talk to
 * the component registry directly. This must run before loadQuartzConfig().
 */
const TERM = /^(\d{4})\s+(Vår|Höst)$/
const SEASON_ORDER: Record<string, number> = { Vår: 0, Höst: 1 }

function termKey(name: string): [number, number] | null {
  const m = name.match(TERM)
  if (!m) return null
  return [parseInt(m[1], 10), SEASON_ORDER[m[2]] ?? 0]
}

const sortFn = (a: any, b: any): number => {
  const nameA: string = a?.displayName ?? a?.name ?? ""
  const nameB: string = b?.displayName ?? b?.name ?? ""

  const ka = termKey(nameA)
  const kb = termKey(nameB)

  if (ka && kb) {
    if (ka[0] !== kb[0]) return kb[0] - ka[0] // newest year first
    return ka[1] - kb[1] // Vår before Höst
  }
  if (ka && !kb) return -1
  if (!ka && kb) return 1

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
