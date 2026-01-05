import type { ProtocolData, Metadata, Filters } from '~/types'

export const allCategories = [
  { value: 'l1', label: 'Layer 1' },
  { value: 'l2', label: 'Layer 2' },
  { value: 'dex', label: 'DEX' },
  { value: 'lending', label: 'Lending' },
  { value: 'xchain', label: 'Cross-chain' },
  { value: 'other', label: 'Other' },
]

export const allChains = [
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'bsc', label: 'BSC' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'avalanche', label: 'Avalanche' },
  { value: 'arbitrum', label: 'Arbitrum' },
  { value: 'optimism', label: 'Optimism' },
  { value: 'solana', label: 'Solana' },
]

interface FilterResult {
  data: ProtocolData[]
  tag: string
}

export function useFilters() {
  /**
   * Filter protocols by category
   */
  function filterCategories(
    data: ProtocolData[],
    categories: string[],
    categoryOptions = allCategories
  ): FilterResult {
    if (!categories || categories.length === 0) {
      return { data, tag: '' }
    }

    const filtered = data.filter((protocol) =>
      categories.includes(protocol.category)
    )

    const categoryLabels = categories
      .map((cat) => categoryOptions.find((c) => c.value === cat)?.label || cat)
      .join(', ')

    return {
      data: filtered,
      tag: `Category: ${categoryLabels}`,
    }
  }

  /**
   * Filter protocols by blockchain
   */
  function filterChains(
    data: ProtocolData[],
    chains: string[],
    chainOptions = allChains
  ): FilterResult {
    if (!chains || chains.length === 0) {
      return { data, tag: '' }
    }

    const filtered = data.filter(
      (protocol) => protocol.blockchain && chains.includes(protocol.blockchain)
    )

    const chainLabels = chains
      .map((chain) => chainOptions.find((c) => c.value === chain)?.label || chain)
      .join(', ')

    return {
      data: filtered,
      tag: `Chain: ${chainLabels}`,
    }
  }

  /**
   * Apply all filters to data
   */
  function applyFilters(
    data: ProtocolData[],
    filters: Filters
  ): { data: ProtocolData[]; tags: string[] } {
    let result = [...data]
    const tags: string[] = []

    if (filters.categories && filters.categories.length > 0) {
      const { data: filtered, tag } = filterCategories(result, filters.categories)
      result = filtered
      if (tag) tags.push(tag)
    }

    if (filters.chains && filters.chains.length > 0) {
      const { data: filtered, tag } = filterChains(result, filters.chains)
      result = filtered
      if (tag) tags.push(tag)
    }

    return { data: result, tags }
  }

  /**
   * Bundle protocols by their bundle ID
   */
  function bundleItems(
    data: ProtocolData[],
    bundles: Record<string, Metadata>
  ): ProtocolData[] {
    const bundleMap = new Map<string, ProtocolData[]>()
    const unbundled: ProtocolData[] = []

    // Group by bundle
    data.forEach((protocol) => {
      if (protocol.bundle) {
        const existing = bundleMap.get(protocol.bundle) || []
        existing.push(protocol)
        bundleMap.set(protocol.bundle, existing)
      } else {
        unbundled.push(protocol)
      }
    })

    // Create bundle entries
    const bundledProtocols: ProtocolData[] = []

    bundleMap.forEach((protocols, bundleId) => {
      const bundleMetadata = bundles[bundleId]
      if (!bundleMetadata || protocols.length === 0) {
        bundledProtocols.push(...protocols)
        return
      }

      // Aggregate bundle data
      const oneDay = protocols.reduce((sum, p) => sum + p.oneDay, 0)
      const sevenDayMA = protocols.reduce((sum, p) => sum + p.sevenDayMA, 0)

      bundledProtocols.push({
        id: bundleId,
        name: bundleMetadata.name || bundleId,
        category: bundleMetadata.category,
        adapter: bundleMetadata.adapter,
        protocolLaunch: bundleMetadata.protocolLaunch,
        oneDay,
        sevenDayMA,
        bundleData: protocols,
        price: null,
        marketCap: null,
        fdv: null,
        psRatio: null,
        psRatioFDV: null,
      })
    })

    return [...bundledProtocols, ...unbundled]
  }

  return {
    allCategories,
    allChains,
    filterCategories,
    filterChains,
    applyFilters,
    bundleItems,
  }
}
