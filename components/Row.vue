<script setup lang="ts">
import type { ProtocolData } from '~/types'

interface Props {
  protocol: ProtocolData
  sort: string
}

const props = defineProps<Props>()

const open = ref(false)
const cardHeight = 600

const isApp = computed(() =>
  props.protocol.category !== 'l1' && props.protocol.category !== 'l2'
)

const iconStyle = computed(() => {
  if (props.protocol.icon) {
    return { backgroundImage: `url('${props.protocol.icon}')` }
  }
  return {}
})

function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined) return '-'
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}

function toggleOpen(event: Event) {
  event.preventDefault()
  open.value = !open.value

  // Analytics tracking could be added here
  // Using Plausible or similar
}
</script>

<template>
  <div class="row-wrapper">
    <a
      :href="`/protocol/${protocol.id}`"
      :class="['item', { app: isApp, open }]"
      :style="iconStyle"
      @click="toggleOpen"
    >
      <RowName
        :name="protocol.name || ''"
        :short-name="protocol.shortName"
        :subtitle="protocol.subtitle"
      />
      <div class="amount">
        {{ formatCurrency(protocol.oneDay) }}
      </div>
      <div class="amount">
        {{ formatCurrency(protocol.sevenDayMA) }}
      </div>
      <div class="arrow">
        <svg
          v-if="open"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </a>

    <Transition name="slide">
      <div v-if="open" class="details-container">
        <DetailsCard :protocol="protocol" :sort="sort" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.row-wrapper {
  width: 100%;
}

.item {
  display: flex;
  padding: 0 4px;
  background-color: #fff;
  font-size: 18px;
  background-repeat: no-repeat;
  background-position: 10px center;
  background-size: 20px 20px;
  padding-left: 10px;
  color: black;
  text-decoration: none;
  align-items: center;
  height: 54px;
}

.item:hover {
  background-color: #f5f5f5;
}

.item.app {
  background-color: #fad3f6;
}

.item.app:hover {
  background-color: #f8c3f3;
}

.amount {
  padding-left: 32px;
  min-width: 200px;
  text-align: right;
  font-family: 'Noto Sans TC', sans-serif;
}

.arrow {
  padding: 0 4px;
  height: 24px;
  opacity: 0.7;
}

.details-container {
  overflow: hidden;
  border-top: solid 1px #e3e3e3;
  border-bottom: solid 1px #e3e3e3;
  display: flex;
  flex-direction: column;
}

/* Transition animations */
.slide-enter-active {
  animation: slidein 0.5s ease;
}

.slide-leave-active {
  animation: slideout 0.5s ease;
}

@keyframes slidein {
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: v-bind('cardHeight + "px"');
    opacity: 1;
  }
}

@keyframes slideout {
  from {
    max-height: v-bind('cardHeight + "px"');
    opacity: 1;
  }
  to {
    max-height: 0;
    opacity: 0;
  }
}

@media (max-width: 700px) {
  .amount {
    font-size: 14px;
    min-width: 110px;
    padding-left: 8px;
  }

  .item {
    padding-left: 30px;
    background-position: 6px center;
  }

  .arrow {
    padding: 0 2px;
  }
}
</style>
