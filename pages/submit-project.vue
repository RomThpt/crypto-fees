<script setup lang="ts">
useHead({
  title: 'Submit a Project',
})

const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScLF8KcLpYsxzNl7Jv5AVe0D13ADXey7dcUb85N9Yw5LVNbmg/viewform'
</script>

<template>
  <main class="submit-page">
    <div class="back-link">
      <NuxtLink to="/">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to list
      </NuxtLink>
    </div>

    <h1 class="title">Submit a new project to CryptoFees.info</h1>

    <p>
      CryptoFees.info provides a simple metric for measuring the economic value of various
      blockchain protocols.
    </p>
    <p>
      As DeFi and the entire blockchain industry continues to grow, there's been a surge in
      interest to be listed on this site. We've worked together with the community to develop
      this set of criteria to ensure that the site remains a simple and trustworthy source of
      information.
    </p>

    <section>
      <h2>1. Make sure your protocol meets our criteria</h2>
      <p>To be listed, make sure your protocol meets the following criteria:</p>
      <ol>
        <li>The project is a decentralized protocol powered by blockchain technology</li>
        <li>The protocol has been live for at least 6 months</li>
        <li>Fees are designed to incentivize adding value to the protocol</li>
        <li>Any user may join the protocol to earn a share of fees</li>
        <li>If some fees accrue to a project treasury, it must be less than 33% of total fees</li>
      </ol>

      <h3>Example</h3>

      <div class="example-label">Meets criteria:</div>
      <ul>
        <li>Data provided by an independent, respected institution like CoinMetrics</li>
        <li>Data provided by an open-source indexer, such as a Graph Protocol subgraph</li>
      </ul>

      <div class="example-label">Does not meet criteria:</div>
      <ul>
        <li>DEX aggregator where fees are paid to the operator</li>
        <li>NFT marketplace where fees are paid to the NFT creator or the marketplace</li>
        <li>Protocol where a majority of the fees are paid to a permissioned treasury</li>
      </ul>
    </section>

    <section>
      <h2>2. Find a reliable data feed</h2>
      <p>
        CryptoFees.info is a stateless website, and relies on 3rd party APIs to source fee data.
      </p>

      <p>The best data sources are:</p>
      <ul>
        <li>Data provided by an independent, respected institution like CoinMetrics</li>
        <li>Data provided by an open-source indexer, such as a Graph Protocol subgraph</li>
      </ul>

      <p>
        In some cases, we may allow data from other APIs, however this is discouraged and subject to
        our discretion.
      </p>
    </section>

    <section>
      <h2>3. Submit an application</h2>
      <p>
        Complete the <a :href="FORM_URL" target="_blank" rel="noopener noreferrer">listing application form</a>.
        We'll be in touch soon!
      </p>
    </section>
  </main>
</template>

<style scoped>
.submit-page {
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

p {
  margin: 1rem 0;
  line-height: 1.6;
}

section {
  margin-bottom: 2rem;
}

h2 {
  margin: 1.5rem 0 0.5rem;
  font-size: 1.25rem;
}

h3 {
  font-size: 1rem;
  margin: 1rem 0 0.5rem;
}

ol, ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

li {
  margin: 0.5rem 0;
  line-height: 1.5;
}

.example-label {
  font-weight: 600;
  margin-top: 1rem;
}

a {
  color: #091636;
  text-decoration: underline;
}

a:hover {
  color: #666;
}
</style>
