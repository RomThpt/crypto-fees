<script setup lang="ts">
const internalLinks = [
  { name: 'FAQs', path: '/faqs' },
  { name: 'Request Project', path: '/submit-project' },
  { name: 'API Documentation', path: '/api-docs' },
]

const externalLinks = [
  { name: 'Join our Telegram', url: 'https://t.me/+VNTjwOvI-W40Y2E5' },
]

const sisterSites = [
  { name: 'cryptofees.info', url: 'https://cryptofees.info', current: true },
  { name: 'l2fees.info', url: 'https://l2fees.info' },
  { name: 'cryptoflows.info', url: 'https://cryptoflows.info' },
  { name: 'openorgs.info', url: 'https://openorgs.info' },
  { name: 'simplestakers.info', url: 'https://simplestakers.info' },
  { name: 'ethburned.info', url: 'https://ethburned.info' },
  { name: 'moneyprinter.info', url: 'https://moneyprinter.info' },
  { name: 'money-movers.info', url: 'https://money-movers.info' },
  { name: 'stakers.info', url: 'https://stakers.info' },
  { name: 'ethereumnodes.com', url: 'https://ethereumnodes.com' },
]
</script>

<template>
  <footer class="footer">
    <div class="footer-info">
      Data updates at 2am, UTC
    </div>

    <div class="footer-powered">
      Powered by
      <a href="https://github.com/romthpt" target="_blank" rel="noopener noreferrer">
        romthpt
      </a>
    </div>

    <div class="footer-links">
      <template v-for="(link, index) in internalLinks" :key="link.path">
        <NuxtLink :to="link.path">{{ link.name }}</NuxtLink>
        <span v-if="index < internalLinks.length - 1" class="separator">|</span>
      </template>
      <span class="separator">|</span>
      <template v-for="(link, index) in externalLinks" :key="link.url">
        <a :href="link.url" target="_blank" rel="noopener noreferrer">{{ link.name }}</a>
        <span v-if="index < externalLinks.length - 1" class="separator">|</span>
      </template>
    </div>

    <div class="footer-sites">
      <template v-for="(site, index) in sisterSites" :key="site.url">
        <template v-if="site.current">
          <strong>{{ site.name }}</strong>
        </template>
        <template v-else>
          <a :href="site.url" target="_blank" rel="noopener noreferrer">{{ site.name }}</a>
        </template>
        <span v-if="index < sisterSites.length - 1" class="separator">|</span>
      </template>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  text-align: center;
  padding: 2rem 1rem;
  width: 100%;
  max-width: 900px;
}

.footer-info {
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.footer-powered {
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.footer-powered a {
  color: #091636;
  text-decoration: underline;
}

.footer-links {
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.footer-links a {
  color: #091636;
  text-decoration: underline;
}

.footer-sites {
  font-size: 0.85rem;
  line-height: 1.8;
}

.footer-sites a {
  color: #091636;
  text-decoration: underline;
}

.separator {
  margin: 0 0.5rem;
  color: #999;
}

@media (max-width: 600px) {
  .footer-sites {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .footer-sites .separator {
    display: none;
  }
}
</style>
