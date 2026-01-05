<script setup lang="ts">
useHead({
  title: 'API Documentation',
})

// Fetch sample data for API previews
const { data: feesData } = await useAsyncData('api-docs-fees', async () => {
  try {
    const response = await $fetch<{ success: boolean; protocols: unknown[] }>('/api/v1/fees')
    return response
  } catch {
    return { success: true, protocols: [] }
  }
})

const { data: protocolsData } = await useAsyncData('api-docs-protocols', async () => {
  try {
    const response = await $fetch<{ success: boolean; protocols: unknown[] }>('/api/v1/protocols')
    return response
  } catch {
    return { success: true, protocols: [] }
  }
})

// Format JSON for display (limit to first 2 items for preview)
function formatPreview(data: unknown): string {
  if (!data) return '{}'

  const preview = { ...data as object }
  if (Array.isArray((preview as { protocols?: unknown[] }).protocols)) {
    (preview as { protocols: unknown[] }).protocols = (preview as { protocols: unknown[] }).protocols.slice(0, 2)
  }

  return JSON.stringify(preview, null, 2)
}
</script>

<template>
  <main class="api-docs-page">
    <div class="back-link">
      <NuxtLink to="/">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to list
      </NuxtLink>
    </div>

    <h1 class="title">CryptoFees.info API</h1>

    <p class="intro">CryptoFees.info provides a public API for easy access to fee data.</p>

    <div class="alert">
      CryptoFees is transitioning to using the
      <a href="https://cryptostats.community" target="_blank" rel="noopener noreferrer">CryptoStats protocol</a>
      as a data source.
      <br />
      For a more comprehensive API, check out
      <a href="https://cryptostats.community/discover/fees" target="_blank" rel="noopener noreferrer">
        the "fees" collection on CryptoStats
      </a>.
    </div>

    <section class="endpoint">
      <h2><code>/api/v1/fees</code></h2>
      <p>Request metadata & fees from all supported protocols from the last 7 days.</p>
      <div class="response-preview">
        <div class="preview-header">
          <span>Response Preview</span>
          <a href="/api/v1/fees" target="_blank" class="try-link">Try it</a>
        </div>
        <pre><code>{{ formatPreview(feesData) }}</code></pre>
      </div>
    </section>

    <section class="endpoint">
      <h2><code>/api/v1/protocols</code></h2>
      <p>Request metadata for all supported protocols.</p>
      <div class="response-preview">
        <div class="preview-header">
          <span>Response Preview</span>
          <a href="/api/v1/protocols" target="_blank" class="try-link">Try it</a>
        </div>
        <pre><code>{{ formatPreview(protocolsData) }}</code></pre>
      </div>
    </section>

    <section class="endpoint">
      <h2><code>/api/v1/feesByDay</code></h2>
      <p>Request fee data for specific protocols and dates.</p>
      <p class="params">
        <strong>Query Parameters:</strong>
        <code>[protocol_id]=[date1,date2,...]</code>
      </p>
      <p class="example">
        <strong>Example:</strong>
        <code>/api/v1/feesByDay?ethereum=2024-01-01,2024-01-02</code>
      </p>
    </section>

    <section class="endpoint">
      <h2><code>/api/historic-data.csv</code></h2>
      <p>Download historical fee data as CSV.</p>
      <p class="params">
        <strong>Query Parameters:</strong>
      </p>
      <ul>
        <li><code>start-date</code> - Start date (YYYY-MM-DD)</li>
        <li><code>end-date</code> - End date (YYYY-MM-DD)</li>
        <li><code>protocols</code> - Comma-separated protocol IDs</li>
      </ul>
      <p class="example">
        <strong>Example:</strong>
        <code>/api/historic-data.csv?start-date=2024-01-01&end-date=2024-01-31&protocols=ethereum,uniswap</code>
      </p>
    </section>
  </main>
</template>

<style scoped>
.api-docs-page {
  max-width: 700px;
  margin: 20px auto;
  padding: 0 1rem;
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

.title {
  text-align: center;
  margin: 1.5rem 0;
}

.intro {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #666;
}

.alert {
  background: #ffb6b6;
  padding: 12px;
  border-radius: 8px;
  font-style: italic;
  margin-bottom: 2rem;
}

.alert a {
  color: #091636;
  text-decoration: underline;
}

.endpoint {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.endpoint:last-child {
  border-bottom: none;
}

.endpoint h2 {
  margin-bottom: 0.5rem;
}

.endpoint h2 code {
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 1rem;
}

.endpoint p {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.params, .example {
  font-size: 0.9rem;
}

.params code, .example code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.85rem;
}

.endpoint ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.endpoint li {
  margin: 0.25rem 0;
}

.endpoint li code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.85rem;
}

.response-preview {
  margin-top: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  font-size: 0.85rem;
  font-weight: 500;
}

.try-link {
  color: #091636;
  text-decoration: underline;
  font-size: 0.8rem;
}

.response-preview pre {
  margin: 0;
  padding: 12px;
  background: #fafafa;
  overflow-x: auto;
  font-size: 0.8rem;
  line-height: 1.4;
  max-height: 300px;
}

.response-preview code {
  font-family: 'Monaco', 'Menlo', monospace;
}
</style>
