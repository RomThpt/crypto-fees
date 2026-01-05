// Historical per-day fee data endpoint
// Note: DefiLlama API provides aggregate data, not historical per-protocol daily data
// This endpoint returns limited data based on what's available

export default defineEventHandler(async (event) => {
  // Set cache headers
  setHeader(
    event,
    'Cache-Control',
    `max-age=0, s-maxage=${60 * 10}, stale-while-revalidate=${60 * 5}`
  )

  // Return a message explaining the limitation
  return {
    success: false,
    message: 'Historical per-day fee data is no longer available. Please use /api/v1/fees for current fee data.',
    availableEndpoints: [
      '/api/v1/fees - Current fee data for all protocols',
      '/api/v1/protocols - List of available protocols',
    ],
  }
})
