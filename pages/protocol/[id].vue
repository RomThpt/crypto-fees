<script setup lang="ts">
import { subDays, isAfter } from 'date-fns'
import type { Metadata } from '~/types'

interface FeeItem {
  date: number
  primary: number | null
  secondary: number | null
}

type FeeCache = Record<string, Record<string, { fee: number }>>

const route = useRoute()
const router = useRouter()
const id = computed(() => route.params.id as string)

// Page meta
useHead({
  title: computed(() => `${protocolData.value?.metadata?.name || id.value} - CryptoFees.info`),
})

const GITHUB_URL = 'https://github.com/dmihal/crypto-fees/blob/master/data/adapters/'

// Fetch protocol data
const { data: protocolData, pending, error } = await useAsyncData(
  `protocol-${id.value}`,
  async () => {
    // Fetch protocol metadata and fees
    const [protocolsRes, feesRes] = await Promise.all([
      $fetch<{ success: boolean; protocols: Array<{ id: string } & Metadata> }>('/api/v1/protocols'),
      $fetch<{ success: boolean; protocols: Array<{ id: string; fees: Array<{ date: string; fee: number }> } & Metadata> }>('/api/v1/fees'),
    ])

    if (!protocolsRes.success || !feesRes.success) {
      throw new Error('Failed to fetch protocol data')
    }

    // Find the protocol
    const protocol = protocolsRes.protocols.find((p) => p.id === id.value)
    const feeData = feesRes.protocols.find((p) => p.id === id.value)

    if (!protocol) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Protocol not found',
      })
    }

    // Build protocols map and icons
    const protocols: Record<string, string> = {}
    const icons: Record<string, string> = {}
    const protocolsByBundle: Record<string, string[]> = {}

    for (const p of protocolsRes.protocols) {
      protocols[p.id] = p.subtitle ? `${p.name} (${p.subtitle})` : p.name || p.id
      icons[p.id] = p.icon || ''

      if (p.bundle) {
        if (!protocolsByBundle[p.bundle]) {
          protocolsByBundle[p.bundle] = []
        }
        protocolsByBundle[p.bundle].push(p.id)
      }
    }

    // Calculate market data
    const fees = feeData?.fees || []
    const sevenDayMA = fees.reduce((sum, f) => sum + (f.fee || 0), 0) / 7

    return {
      id: id.value,
      metadata: protocol as Metadata,
      protocols,
      icons,
      protocolsByBundle,
      marketData: {
        sevenDayMA,
        price: null,
        marketCap: null,
        psRatio: null,
      },
      initialFees: fees,
    }
  }
)

// Chart state
const dateRange = ref({
  start: subDays(new Date(), 90),
  end: subDays(new Date(), 1),
})
const smoothing = ref(0)
const secondary = ref<string | null>(null)
const chartLoading = ref(false)
const chartData = ref<FeeItem[]>([])

// Format date for API
function formatDateStr(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Generate empty chart data
function generateEmptyData(): FeeItem[] {
  const data: FeeItem[] = []
  let current = new Date(dateRange.value.start)
  const end = new Date(dateRange.value.end)

  while (!isAfter(current, end)) {
    data.push({
      date: current.getTime() / 1000,
      primary: null,
      secondary: null,
    })
    current = new Date(current.getTime() + 24 * 60 * 60 * 1000)
  }

  return data
}

// Fetch chart data
async function fetchChartData() {
  if (!protocolData.value) return

  chartLoading.value = true

  try {
    const startDate = formatDateStr(dateRange.value.start)
    const endDate = formatDateStr(dateRange.value.end)

    // Build query params
    let query = `${id.value}=${startDate},${endDate}`
    if (secondary.value) {
      query += `&${secondary.value}=${startDate},${endDate}`
    }

    const response = await $fetch<{
      success: boolean
      data: Array<{ id: string; data: Array<{ date: string; fee: number | null }> }>
    }>(`/api/v1/feesByDay?${query}`)

    if (!response.success) {
      chartData.value = generateEmptyData()
      return
    }

    // Process data
    const primaryData = response.data.find((d) => d.id === id.value)?.data || []
    const secondaryData = secondary.value
      ? response.data.find((d) => d.id === secondary.value)?.data || []
      : []

    // Build chart data
    const feeMap: Record<string, { primary: number | null; secondary: number | null }> = {}

    for (const item of primaryData) {
      feeMap[item.date] = { primary: item.fee, secondary: null }
    }

    for (const item of secondaryData) {
      if (feeMap[item.date]) {
        feeMap[item.date].secondary = item.fee
      } else {
        feeMap[item.date] = { primary: null, secondary: item.fee }
      }
    }

    // Convert to array sorted by date
    chartData.value = Object.entries(feeMap)
      .map(([date, values]) => ({
        date: new Date(date).getTime() / 1000,
        primary: values.primary,
        secondary: values.secondary,
      }))
      .sort((a, b) => a.date - b.date)
  } catch (e) {
    console.error('Failed to fetch chart data:', e)
    chartData.value = generateEmptyData()
  } finally {
    chartLoading.value = false
  }
}

// Watch for changes and refetch
watch([dateRange, secondary, smoothing], () => {
  fetchChartData()
}, { deep: true })

// Initial fetch
onMounted(() => {
  fetchChartData()
})

// Other protocols for comparison dropdown
const otherProtocols = computed(() => {
  if (!protocolData.value) return {}
  const { [id.value]: _, ...others } = protocolData.value.protocols
  return others
})

// Format currency
function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-'
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}

function formatCurrencyNoDecimals(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-'
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}
</script>

<template>
  <main class="protocol-page">
    <!-- Loading State -->
    <div v-if="pending" class="loading">
      <div class="loading-spinner"></div>
      <span>Loading protocol data...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error">
      <p>{{ error.message || 'Protocol not found' }}</p>
      <NuxtLink to="/">
        <Button>Back to Home</Button>
      </NuxtLink>
    </div>

    <!-- Protocol Details -->
    <template v-else-if="protocolData">
      <!-- Social Tags -->
      <Head>
        <Meta property="og:title" :content="protocolData.metadata.name" />
        <Meta property="og:image" :content="`https://cryptofees.info/api/social/${id}.png`" />
      </Head>

      <h1 class="title">CryptoFees.info</h1>

      <div class="back-link">
        <NuxtLink to="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to list
        </NuxtLink>
      </div>

      <h2 class="subtitle">
        <div
          v-if="protocolData.icons[id]"
          class="icon"
          :style="{ backgroundImage: `url('${protocolData.icons[id]}')` }"
        />
        <div class="protocol-name">
          <div>{{ protocolData.metadata.name }}</div>
          <div v-if="protocolData.metadata.subtitle" class="protocol-subtitle">
            {{ protocolData.metadata.subtitle }}
          </div>
        </div>
      </h2>

      <!-- Legacy Warning -->
      <div v-if="protocolData.metadata.legacy" class="legacy">
        Some historical data may be unavailable
      </div>

      <!-- Chart Toolbar -->
      <div class="chart-toolbar">
        <div class="toolbar-item">
          <label>Date Range</label>
          <select v-model="dateRange" @change="fetchChartData">
            <option :value="{ start: subDays(new Date(), 30), end: subDays(new Date(), 1) }">
              30 Days
            </option>
            <option :value="{ start: subDays(new Date(), 90), end: subDays(new Date(), 1) }">
              90 Days
            </option>
            <option :value="{ start: subDays(new Date(), 180), end: subDays(new Date(), 1) }">
              180 Days
            </option>
            <option :value="{ start: subDays(new Date(), 365), end: subDays(new Date(), 1) }">
              1 Year
            </option>
          </select>
        </div>

        <div class="toolbar-item">
          <label>Smoothing</label>
          <select v-model="smoothing">
            <option :value="0">None</option>
            <option :value="2">3 Days</option>
            <option :value="6">7 Days</option>
          </select>
        </div>

        <div class="toolbar-item">
          <label>Compare</label>
          <select v-model="secondary">
            <option :value="null">None</option>
            <option
              v-for="(name, protocolId) in otherProtocols"
              :key="protocolId"
              :value="protocolId"
            >
              {{ name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Chart -->
      <div class="chart-container">
        <Chart
          :data="chartData"
          :primary="id"
          :secondary="secondary"
          :loading="chartLoading"
          :protocols="protocolData.protocols"
          :events="protocolData.metadata.events"
        />
      </div>

      <!-- Description -->
      <p v-if="protocolData.metadata.description" class="description">
        {{ protocolData.metadata.description }}
      </p>

      <!-- Fee Model -->
      <Attribute v-if="protocolData.metadata.feeDescription" title="Fee Model">
        {{ protocolData.metadata.feeDescription }}
      </Attribute>

      <!-- Metadata Row -->
      <div class="row">
        <Attribute v-if="protocolData.metadata.website" title="Website">
          <a :href="protocolData.metadata.website" target="_blank" rel="noopener noreferrer">
            {{ protocolData.metadata.website.replace('https://', '') }}
          </a>
        </Attribute>

        <Attribute v-if="protocolData.metadata.blockchain" title="Blockchain">
          {{ protocolData.metadata.blockchain }}
        </Attribute>

        <Attribute v-if="protocolData.metadata.source" title="Source">
          <a
            v-if="protocolData.metadata.adapter"
            :href="`${GITHUB_URL}${protocolData.metadata.adapter}.ts`"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ protocolData.metadata.source }}
          </a>
          <span v-else>{{ protocolData.metadata.source }}</span>
        </Attribute>
      </div>

      <!-- Token Info -->
      <div v-if="protocolData.metadata.tokenTicker" class="row">
        <Attribute title="Token">
          <a
            :href="`https://www.coingecko.com/en/coins/${protocolData.metadata.tokenCoingecko}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ protocolData.metadata.tokenTicker }}
          </a>
        </Attribute>

        <Attribute title="Price">
          {{ formatCurrency(protocolData.marketData.price) }}
        </Attribute>

        <Attribute title="Market Cap">
          {{ formatCurrencyNoDecimals(protocolData.marketData.marketCap) }}
        </Attribute>

        <Attribute title="P/S Ratio" tooltip="Based on 7 day average fees, annualized">
          {{ protocolData.marketData.psRatio?.toFixed(2) || '-' }}
        </Attribute>
      </div>
    </template>
  </main>
</template>

<style scoped>
.protocol-page {
  margin-bottom: 18px;
  width: 100%;
  max-width: 800px;
  padding: 0 1rem;
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

.title {
  margin: 10px 0 4px;
  font-weight: 700;
}

.back-link a {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #091636;
  text-decoration: none;
}

.back-link a:hover {
  text-decoration: underline;
}

.subtitle {
  display: flex;
  align-items: center;
  font-weight: 700;
  margin: 1rem 0;
}

.icon {
  height: 24px;
  width: 24px;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  margin-right: 8px;
}

.protocol-name {
  display: flex;
  flex-direction: column;
}

.protocol-subtitle {
  font-size: 14px;
  color: #616161;
  font-weight: 400;
}

.legacy {
  font-size: 12px;
  color: #666;
  margin: 4px 0;
  padding: 6px;
  background: #f3e8d4;
  border-radius: 4px;
}

.chart-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.toolbar-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toolbar-item label {
  font-size: 12px;
  color: #666;
}

.toolbar-item select {
  padding: 6px 8px;
  border: 1px solid #d0d1d9;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  min-width: 120px;
}

.chart-container {
  padding: 14px;
  background: #ffffff;
  border-radius: 8px;
  margin: 6px 0;
  border: solid 1px #d0d1d9;
}

.description {
  margin: 1rem 0;
  line-height: 1.6;
}

.row {
  display: flex;
  flex-wrap: wrap;
}

.row > :deep(div) {
  flex: 1;
  min-width: 120px;
}

@media (max-width: 700px) {
  .chart-toolbar {
    flex-direction: column;
  }

  .toolbar-item select {
    width: 100%;
  }
}
</style>
