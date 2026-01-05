import { fetchDefiLlamaFees } from '~/server/utils/defillama'

export default defineEventHandler(async (event) => {
  // Set cache headers - protocols list changes less frequently
  setHeader(
    event,
    'Cache-Control',
    `max-age=0, s-maxage=${60 * 60}, stale-while-revalidate=${60 * 30}`
  )

  try {
    const data = await fetchDefiLlamaFees()

    const protocols = data.protocols
      .filter((p) => p.total24h !== null && p.total24h > 0)
      .map((p) => ({
        id: p.slug || p.module,
        name: p.displayName || p.name,
        category: p.category,
        logo: p.logo,
        chains: p.chains,
        slug: p.slug,
      }))

    return {
      success: true,
      protocols,
    }
  } catch (error) {
    console.error('Error fetching protocols:', error)

    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to fetch protocols',
    })
  }
})
