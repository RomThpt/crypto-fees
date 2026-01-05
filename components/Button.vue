<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  href?: string
  target?: string
  icon?: Component
}

defineProps<Props>()
const emit = defineEmits<{
  click: []
}>()

function handleClick() {
  emit('click')
}
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    class="button"
    :href="href"
    :target="target"
    @click="handleClick"
  >
    <component v-if="icon" :is="icon" class="icon" />
    <slot />
  </component>
</template>

<style scoped>
.button {
  padding: 3px 10px 2px;
  border-radius: 3px;
  border: solid 1px #d0d1d9;
  background: transparent;
  font-size: 14px;
  color: #091636;
  min-height: 30px;
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-family: 'sofia-pro', sans-serif;
  cursor: pointer;
}

.button:hover {
  background: #eeeeee;
}

.button :deep(.icon) {
  margin-right: 2px;
  width: 18px;
  height: 18px;
}

@media (max-width: 700px) {
  .button {
    padding: 3px 6px 2px;
  }
}
</style>
