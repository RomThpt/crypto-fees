import { getProtocolFees } from '~/server/utils/defillama'

const TIMEOUT_MS = parseInt(process.env.API_TIMEOUT || '10000')

export default defineEventHandler(async (event) => {
  // Set cache headers
  setHeader(
    event,
    'Cache-Control',
    `max-age=0, s-maxage=${60 * 15}, stale-while-revalidate=${60 * 5}`
  )

  try {
    // Race between the handler and timeout
    const data = await Promise.race([
      getProtocolFees(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Query timed out')), TIMEOUT_MS)
      ),
    ])

    return {
      success: true,
      protocols: data,
    }
  } catch (error) {
    console.error('Error fetching fees:', error)

    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to fetch fees',
    })
  }
})
