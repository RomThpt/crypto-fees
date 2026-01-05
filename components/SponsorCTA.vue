<script setup lang="ts">
const isVisible = ref(true)
const isDismissed = ref(false)

function dismiss() {
  isDismissed.value = true
  // Store dismissal in session storage
  if (import.meta.client) {
    sessionStorage.setItem('sponsor-cta-dismissed', 'true')
  }
}

onMounted(() => {
  // Check if already dismissed
  if (import.meta.client) {
    isDismissed.value = sessionStorage.getItem('sponsor-cta-dismissed') === 'true'
  }
})
</script>

<template>
  <Transition name="slide">
    <div v-if="isVisible && !isDismissed" class="sponsor-cta">
      <div class="sponsor-content">
        <div class="sponsor-text">
          <span class="sponsor-label">Sponsored</span>
          <p class="sponsor-message">
            Want to reach crypto enthusiasts? Sponsor CryptoFees and get your project in front of thousands of daily visitors.
          </p>
        </div>
        <div class="sponsor-actions">
          <a
            href="https://cryptostats.community/sponsor"
            target="_blank"
            rel="noopener noreferrer"
            class="sponsor-button"
          >
            Learn More
          </a>
          <button class="dismiss-button" @click="dismiss" aria-label="Dismiss">
            &times;
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.sponsor-cta {
  width: 100%;
  max-width: 700px;
  margin: 1rem auto;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f0ff 100%);
  border: 1px solid #d0d8e8;
  border-radius: 8px;
}

.sponsor-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.sponsor-text {
  flex: 1;
}

.sponsor-label {
  display: inline-block;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #666;
  margin-bottom: 0.25rem;
}

.sponsor-message {
  margin: 0;
  font-size: 0.9rem;
  color: #333;
  line-height: 1.4;
}

.sponsor-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sponsor-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #091636;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background 0.2s;
  white-space: nowrap;
}

.sponsor-button:hover {
  background: #1a2d5a;
  color: white;
}

.dismiss-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  transition: color 0.2s;
}

.dismiss-button:hover {
  color: #666;
}

/* Transition animations */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 600px) {
  .sponsor-content {
    flex-direction: column;
    align-items: stretch;
  }

  .sponsor-actions {
    justify-content: space-between;
  }

  .sponsor-button {
    flex: 1;
    text-align: center;
  }
}
</style>
