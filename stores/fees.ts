import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ProtocolData, Filters, SortOption } from '~/types'

export const useFeesStore = defineStore('fees', () => {
  // State
  const protocols = ref<ProtocolData[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)

  // Getters
  const protocolCount = computed(() => protocols.value.length)

  const sortedByDaily = computed(() =>
    [...protocols.value].sort((a, b) => b.oneDay - a.oneDay)
  )

  const sortedByWeekly = computed(() =>
    [...protocols.value].sort((a, b) => b.sevenDayMA - a.sevenDayMA)
  )

  const categories = computed(() => {
    const cats = new Set<string>()
    protocols.value.forEach((p) => {
      if (p.category) cats.add(p.category)
    })
    return Array.from(cats)
  })

  const chains = computed(() => {
    const chainSet = new Set<string>()
    protocols.value.forEach((p) => {
      if (p.blockchain) chainSet.add(p.blockchain)
    })
    return Array.from(chainSet)
  })

  // Actions
  async function fetchProtocols() {
    isLoading.value = true
    error.value = null

    try {
      const data = await $fetch<ProtocolData[]>('/api/v1/protocols')
      protocols.value = data
      lastUpdated.value = new Date()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch protocols'
      console.error('Failed to fetch protocols:', e)
    } finally {
      isLoading.value = false
    }
  }

  function getProtocolById(id: string): ProtocolData | undefined {
    return protocols.value.find((p) => p.id === id)
  }

  function filterProtocols(filters: Filters): ProtocolData[] {
    let result = [...protocols.value]

    if (filters.categories && filters.categories.length > 0) {
      result = result.filter((p) => filters.categories!.includes(p.category))
    }

    if (filters.chains && filters.chains.length > 0) {
      result = result.filter(
        (p) => p.blockchain && filters.chains!.includes(p.blockchain)
      )
    }

    return result
  }

  function getSortedProtocols(sort: SortOption): ProtocolData[] {
    return sort === 'daily' ? sortedByDaily.value : sortedByWeekly.value
  }

  return {
    // State
    protocols,
    isLoading,
    error,
    lastUpdated,

    // Getters
    protocolCount,
    sortedByDaily,
    sortedByWeekly,
    categories,
    chains,

    // Actions
    fetchProtocols,
    getProtocolById,
    filterProtocols,
    getSortedProtocols,
  }
})
