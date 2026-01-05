<script setup lang="ts">
// Google Analytics tracking
const route = useRoute()
const config = useRuntimeConfig()

// Track page views on route change
watch(
  () => route.fullPath,
  (path) => {
    if (import.meta.client && window.gtag) {
      window.gtag('config', config.public.gaTrackingId, {
        page_path: path,
      })
    }
  }
)

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - CryptoFees.info` : 'CryptoFees.info'
  },
})
</script>

<template>
  <div class="app-container">
    <Header />
    <NuxtPage />
    <Footer />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
</style>
