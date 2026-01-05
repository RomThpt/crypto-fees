<script setup lang="ts">
useHead({
  title: 'Frequently Asked Questions',
})
</script>

<template>
  <main class="faqs-page">
    <div class="back-link">
      <NuxtLink to="/">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to list
      </NuxtLink>
    </div>

    <h1 class="title">CryptoFees.info Frequently Asked Questions</h1>

    <section class="faq-item">
      <h2>Wait... aren't fees bad?</h2>
      <p>Numbers aren't good or bad, they're just numbers!</p>
      <p>
        However, total fees can be a strong indicator for which protocols have actual economic
        activity behind them.
      </p>
    </section>

    <section class="faq-item">
      <h2>Can you add information about fees-per-transaction?</h2>
      <p>
        CryptoFees.info doesn't just show data for layer-1 blockchains, it also shows fees for
        blockchain applications, like decentralized exchanges, lending protocols, etc.
        Fee-per-transaction isn't a relevant metric for applications, so it's not included.
      </p>
      <p>
        Furthermore, fee-per-transaction implies that all transactions are equivalent. A simple
        token transfer is very different from a DEX trade, HTLC-lock, rollup data block, etc.
      </p>
    </section>

    <section class="faq-item">
      <h2>Where does this data come from?</h2>
      <p>
        Fee data comes from various sources. Data for many of the layer 1 chains comes from
        CoinMetrics, while data for many of the applications comes from Graph Protocol subgraphs.
      </p>
      <p>
        For more information, view the details of each protocol, or check the
        <a href="https://github.com/dmihal/crypto-fees" target="_blank" rel="noopener noreferrer">
          CryptoFees source code repository
        </a>.
      </p>
    </section>

    <section class="faq-item">
      <h2>Can you add data for [protocol]?</h2>
      <p>
        Visit the
        <NuxtLink to="/submit-project">submit project page</NuxtLink>
        for more details.
      </p>
    </section>

    <section class="faq-item">
      <h2>How does CryptoFees.info make money?</h2>
      <p>Generally, it doesn't! This site is run as a free, open-source community resource.</p>
      <p>
        If you'd like to support the continued development of this site, you can always make a
        donation to our
        <a href="https://gitcoin.co/grants/1624/cryptofees-info" target="_blank" rel="noopener noreferrer">
          Gitcoin Grants
        </a>.
      </p>
    </section>
  </main>
</template>

<style scoped>
.faqs-page {
  max-width: 600px;
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
  font-size: 1.75rem;
}

.faq-item {
  margin-bottom: 2rem;
}

.faq-item h2 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.faq-item p {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.faq-item a {
  color: #091636;
  text-decoration: underline;
}

.faq-item a:hover {
  color: #666;
}
</style>
