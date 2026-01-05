<script setup lang="ts">
import type { ProtocolData, Metadata, Filters } from '~/types'

const route = useRoute()
const router = useRouter()
const date = computed(() => route.params.date as string)

// Validate date format
const DATE_REGEX = /^20\d{2}-\d{2}-\d{2}$/
const isValidDate = computed(() => DATE_REGEX.test(date.value))

// Page meta
useHead({
  title: computed(() => `${date.value} - CryptoFees.info`),
})

// Fetch historical data
const { data: historyData, pending, error } = await useAsyncData(
  `history-${date.value}`,
  async () => {
    if (!isValidDate.value) {
      throw new Error('Invalid date format')
    }

    // Check if date is in the future
    const dateObj = new Date(date.value)
    if (dateObj > new Date()) {
      throw new Error('Cannot view future dates')
    }

    // Fetch fee data - in production this would fetch historical data
    const response = await $fetch<{
      success: boolean
      protocols: Array<{
        id: string
        fees: Array<{ date: string; fee: number }>
      } & Metadata>
    }>('/api/v1/fees')

    if (!response.success) {
      throw new Error('Failed to fetch historical data')
    }

    const bundles: Record<string, Metadata> = {}

    const protocols: ProtocolData[] = response.protocols
      .map((protocol) => {
        const fees = protocol.fees || []
        const oneDay = fees[0]?.fee || 0
        const sevenDayMA = fees.reduce((sum, f) => sum + (f.fee || 0), 0) / 7

        if (protocol.bundle) {
          bundles[protocol.bundle] = {
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
      .filter((p) => p.oneDay > 0 || p.sevenDayMA > 0)

    return { protocols, bundles }
  }
)

// UI State
const filterCardOpen = ref(false)
const shareOpen = ref(false)
const bundling = ref(true)
const filters = ref<Filters>({})

// Filters
const { filterCategories, filterChains, bundleItems, allCategories, allChains } = useFilters()

const filteredData = computed(() => {
  if (!historyData.value) return []

  let data = [...historyData.value.protocols]
  const tags: string[] = []

  if (filters.value.categories && filters.value.categories.length > 0) {
    const result = filterCategories(data, filters.value.categories, allCategories)
    data = result.data
    if (result.tag) tags.push(result.tag)
  }

  if (filters.value.chains && filters.value.chains.length > 0) {
    const result = filterChains(data, filters.value.chains, allChains)
    data = result.data
    if (result.tag) tags.push(result.tag)
  }

  if (bundling.value && historyData.value.bundles) {
    data = bundleItems(data, historyData.value.bundles)
  }

  return data
})

const numFilters = computed(() => {
  let count = 0
  if (filters.value.categories?.length) count++
  if (filters.value.chains?.length) count++
  return count
})

// Methods
function handleDateChange(newDate: string) {
  router.push(`/history/${newDate}`)
}

function toggleFilterCard() {
  filterCardOpen.value = !filterCardOpen.value
}
</script>

<template>
  <main class="history-page">
    <!-- Invalid Date -->
    <div v-if="!isValidDate" class="error">
      <p>Invalid date format. Please use YYYY-MM-DD.</p>
      <NuxtLink to="/">
        <Button>Back to Home</Button>
      </NuxtLink>
    </div>

    <!-- Loading State -->
    <div v-else-if="pending" class="loading">
      <div class="loading-spinner"></div>
      <span>Loading historical data...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>{{ error.message || 'Failed to load data' }}</p>
      <NuxtLink to="/">
        <Button>Back to Home</Button>
      </NuxtLink>
    </div>

    <!-- Historical Data -->
    <template v-else>
      <!-- Social Tags -->
      <Head>
        <Meta property="og:title" :content="`${date} - CryptoFees.info`" />
      </Head>

      <h1 class="title">Crypto Fees</h1>

      <p class="description">
        There's tons of crypto projects.<br />
        Which ones are people actually paying to use?
      </p>

      <div class="date-display">
        Historical data for: <strong>{{ date }}</strong>
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <div class="toolbar-left">
          <label class="bundle-toggle">
            <input v-model="bundling" type="checkbox" />
            Bundle related protocols
          </label>
        </div>
        <div class="toolbar-right">
          <NuxtLink to="/">
            <Button>View Latest</Button>
          </NuxtLink>
          <Button v-if="numFilters > 0" @click="toggleFilterCard">
            Filters ({{ numFilters }})
          </Button>
          <Button v-else @click="toggleFilterCard">
            Filters
          </Button>
        </div>
      </div>

      <!-- Filter Card -->
      <Transition name="slide">
        <div v-if="filterCardOpen" class="filter-card">
          <div class="filter-section">
            <h4>Categories</h4>
            <div class="filter-options">
              <label v-for="cat in allCategories" :key="cat.value" class="filter-option">
                <input
                  type="checkbox"
                  :checked="filters.categories?.includes(cat.value)"
                  @change="(e) => {
                    const checked = (e.target as HTMLInputElement).checked
                    const current = filters.categories || []
                    if (checked) {
                      filters = { ...filters, categories: [...current, cat.value] }
                    } else {
                      filters = { ...filters, categories: current.filter(c => c !== cat.value) }
                    }
                  }"
                />
                {{ cat.label }}
              </label>
            </div>
          </div>
        </div>
      </Transition>

      <List :data="filteredData" />
    </template>
  </main>
</template>

<style scoped>
.history-page {
  padding: 2rem 0 3rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 700px;
  width: 100%;
}

.title {
  margin: 0 0 16px;
  line-height: 1.15;
  font-size: 4rem;
  font-weight: 700;
  text-align: center;
}

.description {
  line-height: 1.5;
  font-size: 1.5rem;
  margin: 4px 0 20px;
  text-align: center;
}

.date-display {
  background: #f0f0f0;
  padding: 8px 16px;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e0e0e0;
  border-top-color: #091636;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error {
  text-align: center;
  padding: 2rem;
}

.toolbar {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 4px;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.toolbar-right {
  display: flex;
  gap: 0.5rem;
}

.bundle-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 14px;
  cursor: pointer;
}

.filter-card {
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.filter-section h4 {
  margin: 0 0 0.5rem;
  font-size: 14px;
  color: #666;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 4px;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 700px) {
  .title {
    font-size: 2.5rem;
  }

  .description {
    font-size: 1.2rem;
  }
}
</style>
