import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Filters, SortOption } from '~/types'

export const useUIStore = defineStore('ui', () => {
  // State
  const filterCardOpen = ref(false)
  const shareModalOpen = ref(false)
  const sortBy = ref<SortOption>('daily')
  const bundlingEnabled = ref(true)
  const activeFilters = ref<Filters>({
    categories: [],
    chains: [],
  })
  const activeTags = ref<string[]>([])

  // Getters
  const hasActiveFilters = computed(() => {
    return (
      (activeFilters.value.categories?.length ?? 0) > 0 ||
      (activeFilters.value.chains?.length ?? 0) > 0
    )
  })

  const filterCount = computed(() => {
    let count = 0
    if (activeFilters.value.categories?.length) count++
    if (activeFilters.value.chains?.length) count++
    return count
  })

  // Actions
  function toggleFilterCard() {
    filterCardOpen.value = !filterCardOpen.value
  }

  function openFilterCard() {
    filterCardOpen.value = true
  }

  function closeFilterCard() {
    filterCardOpen.value = false
  }

  function toggleShareModal() {
    shareModalOpen.value = !shareModalOpen.value
  }

  function openShareModal() {
    shareModalOpen.value = true
  }

  function closeShareModal() {
    shareModalOpen.value = false
  }

  function setSortBy(sort: SortOption) {
    sortBy.value = sort
  }

  function toggleBundling() {
    bundlingEnabled.value = !bundlingEnabled.value
  }

  function setBundling(enabled: boolean) {
    bundlingEnabled.value = enabled
  }

  function setFilters(filters: Filters) {
    activeFilters.value = filters
  }

  function updateFilter(key: keyof Filters, value: string[]) {
    activeFilters.value = {
      ...activeFilters.value,
      [key]: value,
    }
  }

  function clearFilters() {
    activeFilters.value = {
      categories: [],
      chains: [],
    }
    activeTags.value = []
  }

  function removeTag(tagId: string) {
    if (tagId === 'categories') {
      activeFilters.value.categories = []
    } else if (tagId === 'chains') {
      activeFilters.value.chains = []
    }
    activeTags.value = activeTags.value.filter((t) => t !== tagId)
  }

  function addTag(tag: string) {
    if (!activeTags.value.includes(tag)) {
      activeTags.value.push(tag)
    }
  }

  return {
    // State
    filterCardOpen,
    shareModalOpen,
    sortBy,
    bundlingEnabled,
    activeFilters,
    activeTags,

    // Getters
    hasActiveFilters,
    filterCount,

    // Actions
    toggleFilterCard,
    openFilterCard,
    closeFilterCard,
    toggleShareModal,
    openShareModal,
    closeShareModal,
    setSortBy,
    toggleBundling,
    setBundling,
    setFilters,
    updateFilter,
    clearFilters,
    removeTag,
    addTag,
  }
})
