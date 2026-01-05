<script setup lang="ts">
import type { ProtocolData, SortOption } from '~/types'

interface Props {
  data: ProtocolData[]
}

const props = defineProps<Props>()

const DEFAULT_ROWS_TO_DISPLAY = 20

const sort = ref<SortOption>('daily')
const showAll = ref(false)

function sortByDaily(a: ProtocolData, b: ProtocolData): number {
  return (b.oneDay || 0) - (a.oneDay || 0)
}

function sortByWeekly(a: ProtocolData, b: ProtocolData): number {
  return (b.sevenDayMA || 0) - (a.sevenDayMA || 0)
}

const sortedData = computed(() => {
  const sorted = [...props.data].sort(
    sort.value === 'weekly' ? sortByWeekly : sortByDaily
  )

  if (showAll.value) {
    return sorted
  }

  return sorted.slice(0, DEFAULT_ROWS_TO_DISPLAY)
})

function setSort(newSort: SortOption) {
  sort.value = newSort
}

function handleShowAll() {
  showAll.value = true
  // Analytics tracking could be added here
}
</script>

<template>
  <div class="list">
    <div class="header">
      <div class="name">Name</div>
      <div class="amount sortable" @click="setSort('daily')">
        <span v-if="sort === 'daily'" class="sort-indicator">&#9660;</span>
        1 Day Fees
      </div>
      <div class="amount sortable" @click="setSort('weekly')">
        <span v-if="sort === 'weekly'" class="sort-indicator">&#9660;</span>
        7 Day Av<span class="g">g</span>. Fees
      </div>
    </div>

    <Row
      v-for="protocol in sortedData"
      :key="protocol.id"
      :protocol="protocol"
      :sort="sort"
    />

    <button
      v-if="!showAll && data.length > DEFAULT_ROWS_TO_DISPLAY"
      class="show-all"
      @click="handleShowAll"
    >
      Show all {{ data.length }} protocols
    </button>
  </div>
</template>

<style scoped>
.list {
  border: solid 1px lightGray;
  border-radius: 0px;
  overflow: hidden;
  margin: 4px;
  max-width: 700px;
  width: 100%;
}

.header {
  display: flex;
  padding: 0 4px;
  border-bottom: solid 1px lightGray;
  background: #eee;
  font-weight: 500;
  padding-left: 10px;
}

.header > div {
  padding: 16px 32px;
}

.name {
  flex: 1;
}

.amount {
  min-width: 200px;
  text-align: right;
}

.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background: #e0e0e0;
}

.sort-indicator {
  margin-right: 4px;
}

.show-all {
  width: 100%;
  border: none;
  height: 32px;
  position: relative;
  font-family: 'Noto Sans TC', sans-serif;
  font-size: 14px;
  background: #fdedfb;
  cursor: pointer;
}

.show-all:hover {
  background: #ebade4;
}

.show-all::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  background: linear-gradient(0deg, #969696b8, transparent);
  height: 30px;
  top: 0;
  transform: translate(0, -30px);
  pointer-events: none;
}

@media (max-width: 700px) {
  .header {
    padding-left: 28px;
    padding-right: 30px;
  }

  .header > div {
    font-size: 14px;
    padding: 8px 2px;
  }

  .amount {
    font-size: 16px;
    min-width: 110px;
  }

  .name {
    font-size: 14px;
  }

  .g {
    display: none;
  }
}
</style>
