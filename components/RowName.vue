<script setup lang="ts">
interface Props {
  name: string
  shortName?: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <div class="name">
    <div :class="{ 'long-name': shortName }">{{ name }}</div>
    <div v-if="shortName" class="short-name">{{ shortName }}</div>
    <div v-if="subtitle" class="subtitle">{{ subtitle }}</div>
  </div>
</template>

<style scoped>
.name {
  flex: 1;
  padding-left: 32px;
}

.short-name {
  display: none;
}

.subtitle {
  font-size: 14px;
  color: #616161;
}

@media (max-width: 700px) {
  .name {
    font-size: 14px;
    padding: 0;
  }

  .short-name {
    display: block;
  }

  .long-name {
    display: none;
  }
}
</style>
