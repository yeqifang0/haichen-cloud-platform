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
  // 深色主题默认：图表文字/坐标轴/网格线适配深色背景
  const darkOption = {
    backgroundColor: 'transparent',
    textStyle: { color: '#b7c4d4' },
    grid: { left: 48, right: 24, top: 30, bottom: 36 },
    tooltip: {
      backgroundColor: 'rgba(13, 28, 49, 0.95)',
      borderColor: 'rgba(22, 119, 255, 0.3)',
      textStyle: { color: '#e6edf6' }
    }
  }
  const merged = mergeDeep(darkOption, props.option || {})
  chart.setOption(merged)
}

// 简单的深合并，让外部传入的 option 覆盖默认深色主题
function mergeDeep(t, s) {
  const out = { ...t }
  for (const k in s) {
    if (s[k] && typeof s[k] === 'object' && !Array.isArray(s[k]) && t[k] && typeof t[k] === 'object') {
      out[k] = mergeDeep(t[k], s[k])
    } else {
      out[k] = s[k]
    }
  }
  return out
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
