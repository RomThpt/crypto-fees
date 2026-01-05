import type { ProtocolData, Metadata } from '~/types'

interface FeeResponse {
  success: boolean
  protocols: Array<{
    id: string
    fees: Array<{ date: string; fee: number }>
  } & Metadata>
}

interface UseFeesOptions {
  immediate?: boolean
}

export function useFees(options: UseFeesOptions = { immediate: true }) {
  const data = ref<ProtocolData[]>([])
  const bundles = ref<Record<string, Metadata>>({})
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  async function fetchFees() {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<FeeResponse>('/api/v1/fees')

      if (!response.success) {
        throw new Error('Failed to fetch fees')
      }

      // Transform the API response to match ProtocolData format
      const protocols = response.protocols.map((protocol) => {
        const fees = protocol.fees || []
        const oneDay = fees[0]?.fee || 0
        const sevenDayMA = fees.reduce((sum, f) => sum + (f.fee || 0), 0) / 7

        // Extract bundle metadata
        if (protocol.bundle) {
          bundles.value[protocol.bundle] = {
            name: protocol.name,
            category: protocol.category,
            adapter: protocol.adapter,
            protocolLaunch: protocol.protocolLaunch,
          }
        }

        return {
          id: protocol.id,
          name: protocol.name,
          shortName: protocol.shortName,
          subtitle: protocol.subtitle,
          bundle: protocol.bundle,
          category: protocol.category,
          description: protocol.description,
          feeDescription: protocol.feeDescription,
          icon: protocol.icon,
          website: protocol.website,
          blockchain: protocol.blockchain,
          source: protocol.source,
          adapter: protocol.adapter,
          tokenTicker: protocol.tokenTicker,
          tokenCoingecko: protocol.tokenCoingecko,
          protocolLaunch: protocol.protocolLaunch,
          tokenLaunch: protocol.tokenLaunch,
          legacy: protocol.legacy,
          events: protocol.events,
          oneDay,
          sevenDayMA,
          price: null,
          marketCap: null,
          fdv: null,
          psRatio: null,
          psRatioFDV: null,
        } as ProtocolData
      })

      data.value = protocols.filter((p) => p.oneDay > 0 || p.sevenDayMA > 0)
    } catch (e) {
      error.value = e instanceof Error ? e : new Error('Unknown error')
      console.error('Failed to fetch fees:', e)
    } finally {
      isLoading.value = false
    }
  }

  if (options.immediate) {
    fetchFees()
  }

  return {
    data: readonly(data),
    bundles: readonly(bundles),
    isLoading: readonly(isLoading),
    error: readonly(error),
    refresh: fetchFees,
  }
}
