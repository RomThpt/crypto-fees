// Global type definitions for CryptoFees

export type Category = 'l1' | 'l2' | 'dex' | 'lending' | 'xchain' | 'other'

export interface Metadata {
  name?: string
  shortName?: string
  subtitle?: string
  bundle?: string
  category: Category
  description?: string
  feeDescription?: string
  icon?: string
  website?: string
  blockchain?: string
  source?: string
  adapter: string
  tokenTicker?: string
  tokenCoingecko?: string
  protocolLaunch: string
  tokenLaunch?: string
  legacy?: boolean
  events?: { date: string; description: string }[]
}

export interface ProtocolData extends Metadata {
  id: string
  bundleData?: ProtocolData[]
  price: number | null
  marketCap: number | null
  fdv: number | null
  psRatio: number | null
  psRatioFDV: number | null
  sevenDayMA: number
  oneDay: number
}

export type QueryFunction = (attribute: string, date: string) => Promise<number>

export interface RegisterFunction {
  (name: string, fn: QueryFunction, metadata: Metadata): void
  bundle(id: string, metadata: Metadata): void
}

// Filter types
export interface Filters {
  categories?: string[]
  chains?: string[]
}

// Sort options
export type SortOption = 'daily' | 'weekly'

// API response types
export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

export interface FeeData {
  id: string
  name: string
  oneDay: number
  sevenDayMA: number
  category: Category
}

// Chart data types
export interface ChartDataPoint {
  date: string
  value: number
}

export interface ProtocolChartData {
  id: string
  name: string
  data: ChartDataPoint[]
}

// Runtime config types
declare module 'nuxt/schema' {
  interface RuntimeConfig {
    mongoUri: string
    redisUrl: string
    pgConnectionString: string
    ethRpc: string
    pocketNetwork: string
  }

  interface PublicRuntimeConfig {
    siteUrl: string
    gaTrackingId: string
    plausibleDomain: string
    plausibleApiHost: string
  }
}

// Google Analytics global
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export {}
