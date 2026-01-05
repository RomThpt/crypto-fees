<script setup lang="ts">
interface Props {
  title: string
  tooltip?: string
}

defineProps<Props>()

const showTooltip = ref(false)
</script>

<template>
  <div class="attribute">
    <div class="title">
      {{ title }}
      <div
        v-if="tooltip"
        class="tooltip-target"
        @mouseenter="showTooltip = true"
        @mouseleave="showTooltip = false"
      >
        ?
        <Transition name="fade">
          <div v-if="showTooltip" class="tooltip-text">
            {{ tooltip }}
          </div>
        </Transition>
      </div>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.attribute {
  margin: 8px 8px 8px 0;
}

.title {
  color: #999999;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
}

.content {
  font-size: 14px;
}

.tooltip-target {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #999999;
  color: #eeeeee;
  height: 18px;
  width: 18px;
  border-radius: 100px;
  text-align: center;
  margin-left: 8px;
  font-size: 12px;
  cursor: help;
  position: relative;
}

.tooltip-text {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  width: 150px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 8px;
  border-radius: 6px;
  white-space: normal;
  z-index: 100;
  font-size: 12px;
  line-height: 1.4;
}

.tooltip-text::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-bottom-color: black;
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
