<script setup lang="ts">
import type { ProtocolData } from '~/types'

interface Props {
  protocol: ProtocolData
  sort: string
  yearly?: boolean
}

const props = defineProps<Props>()

const useFDV = ref(false)

const GITHUB_URL = 'https://github.com/dmihal/crypto-fees/blob/master/data/adapters/'

const mCap = computed(() => (useFDV.value ? props.protocol.fdv : props.protocol.marketCap))
const psRatio = computed(() => (useFDV.value ? props.protocol.psRatioFDV : props.protocol.psRatio))

function formatCurrency(value: number | null | undefined, decimals = 2): string {
  if (value === null || value === undefined) return '-'
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
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

function sortByDaily(a: ProtocolData, b: ProtocolData): number {
  return (b.oneDay || 0) - (a.oneDay || 0)
}

function sortByWeekly(a: ProtocolData, b: ProtocolData): number {
  return (b.sevenDayMA || 0) - (a.sevenDayMA || 0)
}

const sortedBundleData = computed(() => {
  if (!props.protocol.bundleData) return []
  return [...props.protocol.bundleData].sort(
    props.sort === 'weekly' ? sortByWeekly : sortByDaily
  )
})

function toggleFDV() {
  useFDV.value = !useFDV.value
}
</script>

<template>
  <div class="details-card">
    <!-- Bundle Items -->
    <div v-if="protocol.bundleData && protocol.bundleData.length > 0" class="bundle-items">
      <div
        v-for="item in sortedBundleData"
        :key="item.id"
        class="bundle-item"
      >
        <span class="bundle-name">{{ item.name }}</span>
        <span class="bundle-fee">{{ formatCurrency(yearly ? item.sevenDayMA * 365 : item.oneDay) }}</span>
      </div>
    </div>

    <div class="metadata">
      <!-- Description -->
      <div v-if="protocol.description" class="description">
        {{ protocol.description }}
      </div>

      <!-- Fee Model -->
      <Attribute v-if="protocol.feeDescription" title="Fee Model">
        {{ protocol.feeDescription }}
      </Attribute>

      <!-- Website, Blockchain, Source -->
      <div class="row">
        <Attribute v-if="protocol.website" title="Website">
          <a :href="protocol.website" target="_blank" rel="noopener noreferrer">
            {{ protocol.website.replace('https://', '') }}
          </a>
        </Attribute>

        <Attribute v-if="protocol.blockchain" title="Blockchain">
          {{ protocol.blockchain }}
        </Attribute>

        <Attribute v-if="protocol.source" title="Source">
          <a
            v-if="protocol.adapter"
            :href="`${GITHUB_URL}${protocol.adapter}.ts`"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ protocol.source }}
          </a>
          <span v-else>{{ protocol.source }}</span>
        </Attribute>
      </div>

      <!-- Token Info -->
      <div v-if="protocol.tokenTicker" class="row">
        <Attribute title="Token">
          <a
            :href="`https://www.coingecko.com/en/coins/${protocol.tokenCoingecko}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ protocol.tokenTicker }}
          </a>
        </Attribute>

        <Attribute title="Price">
          {{ formatCurrency(protocol.price) }}
        </Attribute>

        <Attribute :title="useFDV ? 'FDV' : 'Market Cap'">
          <button v-if="protocol.fdv" class="fdv-btn" @click="toggleFDV">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="17 1 21 5 17 9"></polyline>
              <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
              <polyline points="7 23 3 19 7 15"></polyline>
              <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
            </svg>
          </button>
          {{ formatCurrencyNoDecimals(mCap) }}
        </Attribute>

        <Attribute
          :title="useFDV ? 'P/S Ratio (FDV)' : 'P/S Ratio'"
          tooltip="Based on 7 day average fees, annualized"
        >
          {{ psRatio?.toFixed(2) || '-' }}
        </Attribute>
      </div>

      <div class="spacer" />

      <!-- More Details Button -->
      <div class="actions">
        <NuxtLink :to="`/protocol/${protocol.id}`">
          <Button>More Details</Button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.details-card {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.bundle-items {
  border-bottom: 1px solid #e3e3e3;
}

.bundle-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.bundle-item:last-child {
  border-bottom: none;
}

.bundle-name {
  font-size: 14px;
}

.bundle-fee {
  font-size: 14px;
  font-family: 'Noto Sans TC', sans-serif;
}

.metadata {
  padding: 12px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.description {
  margin: 4px 0;
  font-size: 14px;
  line-height: 1.5;
}

.row {
  display: flex;
  flex-wrap: wrap;
}

.row > :deep(div) {
  flex: 1;
  min-width: 100px;
}

.fdv-btn {
  border: none;
  background: none;
  padding: 2px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  margin-right: 4px;
  color: inherit;
}

.fdv-btn:hover {
  color: #999;
}

.spacer {
  flex: 1;
  min-height: 8px;
}

.actions {
  margin-top: 8px;
}

.actions a {
  text-decoration: none;
}
</style>
