// Historical CSV export endpoint
// Note: DefiLlama API provides aggregate data, not historical per-protocol daily data
// This endpoint is deprecated

export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/plain')

  return `Historical CSV export is no longer available.

The data source that provided historical per-day fee data has been deprecated.

Available alternatives:
- /api/v1/fees - Get current fee data for all protocols (JSON)
- /api/v1/protocols - Get list of available protocols (JSON)
- https://defillama.com/fees - DefiLlama fees dashboard with historical charts

For historical data, please visit: https://defillama.com/fees
`
})
