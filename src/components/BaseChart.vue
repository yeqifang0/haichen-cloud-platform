<template>
  <div ref="chartRef" :style="{ width: '100%', height: height }"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  option: { type: Object, required: true },
  height: { type: String, default: '320px' }
})

const chartRef = ref(null)
let chart = null

function init() {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  chart.setOption(props.option)
}

function resize() {
  chart && chart.resize()
}

watch(
  () => props.option,
  (val) => {
    if (chart) chart.setOption(val, true)
  },
  { deep: true }
)

onMounted(async () => {
  await nextTick()
  init()
  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  chart && chart.dispose()
  chart = null
})

defineExpose({ resize })
</script>
