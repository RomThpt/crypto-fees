// DefiLlama Fees API integration
// Replaces the deprecated CryptoStats SDK

interface DefiLlamaProtocol {
  defillamaId: string
  name: string
  displayName: string
  module: string
  category: string
  logo: string
  chains: string[]
  slug: string
  total24h: number | null
  total7d: number | null
  total30d: number | null
  change_1d: number | null
  change_7d: number | null
  change_1m: number | null
  methodology?: Record<string, string>
  methodologyURL?: string
  parentProtocol?: string
}

interface DefiLlamaResponse {
  protocols: DefiLlamaProtocol[]
  total24h: number
  total7d: number
  total30d: number
  allChains: string[]
}

// Cache for API responses
let cache: { data: DefiLlamaResponse | null; timestamp: number } = {
  data: null,
  timestamp: 0,
}
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function fetchDefiLlamaFees(): Promise<DefiLlamaResponse> {
  const now = Date.now()

  // Return cached data if valid
  if (cache.data && now - cache.timestamp < CACHE_TTL) {
    return cache.data
  }

  try {
    const response = await fetch('https://api.llama.fi/overview/fees')
    if (!response.ok) {
      throw new Error(`DefiLlama API error: ${response.status}`)
    }

    const data = (await response.json()) as DefiLlamaResponse

    // Update cache
    cache = { data, timestamp: now }

    return data
  } catch (error) {
    // Return stale cache if available
    if (cache.data) {
      console.warn('Using stale cache due to API error:', error)
      return cache.data
    }
    throw error
  }
}

// Map DefiLlama categories to CryptoFees categories
function mapCategory(category: string): string {
  const categoryMap: Record<string, string> = {
    Dexs: 'dex',
    'Dexes': 'dex',
    Lending: 'lending',
    Bridge: 'xchain',
    Chain: 'l1',
    'Liquid Staking': 'other',
    Derivatives: 'dex',
    CDP: 'lending',
    'Yield Aggregator': 'other',
    'Yield': 'other',
    Options: 'dex',
    Prediction: 'other',
    NFT: 'other',
    Gaming: 'other',
    RWA: 'other',
    'L2': 'l2',
    Rollup: 'l2',
  }

  return categoryMap[category] || 'other'
}

// Transform DefiLlama data to CryptoFees format
export function transformToProtocolData(protocols: DefiLlamaProtocol[]) {
  return protocols
    .filter((p) => p.total24h !== null && p.total24h > 0)
    .map((p) => {
      const oneDay = p.total24h || 0
      const sevenDayMA = p.total7d ? p.total7d / 7 : oneDay

      return {
        id: p.slug || p.module,
        name: p.displayName || p.name,
        shortName: p.name.length > 15 ? p.name.substring(0, 12) + '...' : undefined,
        category: mapCategory(p.category),
        description: p.methodology?.Fees || `${p.name} protocol fees`,
        feeDescription: p.methodology?.Fees,
        icon: p.logo,
        website: p.methodologyURL
          ? `https://defillama.com/protocol/${p.slug}`
          : undefined,
        blockchain: p.chains?.[0] || undefined,
        source: {
          name: 'DefiLlama',
          url: `https://defillama.com/fees/${p.slug}`,
        },
        adapter: 'defillama',
        protocolLaunch: undefined,
        oneDay,
        sevenDayMA,
        fees: generateLast7DaysFees(oneDay, p.total7d || oneDay * 7),
        // Market data not available from DefiLlama fees API
        price: null,
        marketCap: null,
        fdv: null,
        psRatio: null,
        psRatioFDV: null,
      }
    })
    .sort((a, b) => b.oneDay - a.oneDay)
}

// Generate approximate daily fees for the last 7 days
function generateLast7DaysFees(oneDay: number, total7d: number) {
  const avgDaily = total7d / 7
  const fees = []
  const today = new Date()

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    // Use actual data for today, estimated for other days
    const fee = i === 0 ? oneDay : avgDaily

    fees.push({ date: dateStr, fee })
  }

  return fees
}

export async function getProtocolFees() {
  const data = await fetchDefiLlamaFees()
  return transformToProtocolData(data.protocols)
}

export async function getProtocolById(id: string) {
  const data = await fetchDefiLlamaFees()
  const protocol = data.protocols.find(
    (p) => p.slug === id || p.module === id || p.name.toLowerCase() === id.toLowerCase()
  )

  if (!protocol) {
    return null
  }

  const transformed = transformToProtocolData([protocol])
  return transformed[0] || null
}
