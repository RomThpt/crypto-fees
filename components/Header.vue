<script setup lang="ts">
const config = useRuntimeConfig()

const sites = [
  { name: 'cryptofees.info', url: 'https://cryptofees.info', current: true },
  { name: 'l2fees.info', url: 'https://l2fees.info' },
  { name: 'cryptoflows.info', url: 'https://cryptoflows.info' },
  { name: 'openorgs.info', url: 'https://openorgs.info' },
]

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <header class="header">
    <div class="header-content">
      <div class="logo">
        <NuxtLink to="/" class="logo-link">
          <img src="/favicon.png" alt="CryptoFees" class="logo-icon" />
          <span class="logo-text">CryptoFees</span>
        </NuxtLink>
      </div>

      <nav class="nav" :class="{ open: isMenuOpen }">
        <div class="nav-sites">
          <template v-for="site in sites" :key="site.url">
            <a
              v-if="!site.current"
              :href="site.url"
              class="nav-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ site.name }}
            </a>
            <span v-else class="nav-link current">{{ site.name }}</span>
          </template>
        </div>

        <div class="nav-actions">
          <a
            href="https://github.com/romthpt"
            class="powered-by"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by romthpt
          </a>
        </div>
      </nav>

      <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu">
        <span class="menu-bar"></span>
        <span class="menu-bar"></span>
        <span class="menu-bar"></span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  width: 100%;
  padding: 0.5rem 1rem;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.logo-icon {
  width: 28px;
  height: 28px;
  margin-right: 8px;
}

.logo-text {
  font-size: 1.1rem;
  font-weight: 600;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-sites {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-link {
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.nav-link:hover {
  color: #091636;
}

.nav-link.current {
  color: #091636;
  font-weight: 600;
}

.powered-by {
  font-size: 0.8rem;
  color: #999;
  text-decoration: none;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: all 0.2s;
}

.powered-by:hover {
  color: #666;
  border-color: #999;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background: none;
  border: none;
  cursor: pointer;
}

.menu-bar {
  width: 20px;
  height: 2px;
  background: #333;
  transition: transform 0.2s;
}

@media (max-width: 768px) {
  .nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;
    gap: 1rem;
  }

  .nav.open {
    display: flex;
  }

  .nav-sites {
    flex-direction: column;
    align-items: center;
  }

  .menu-toggle {
    display: flex;
  }

  .header-content {
    position: relative;
  }
}
</style>
