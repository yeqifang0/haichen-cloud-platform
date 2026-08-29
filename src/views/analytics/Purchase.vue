<template>
  <div class="page-container">
    <!-- 页头 -->
    <el-card shadow="hover" class="mb-16">
      <div class="page-title">
        <el-icon><DataAnalysis /></el-icon>
        <span>采购入库分析</span>
        <el-tag size="small" type="primary" effect="plain" style="margin-left: 8px">源自销售仓储管理大数据交互系统</el-tag>
      </div>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="16">
      <el-col v-for="s in stats" :key="s.label" :xs="12" :sm="6">
        <div class="stat-card">
          <div class="stat-icon" :style="{ background: s.color + '1a', color: s.color }">
            <el-icon :size="24"><component :is="s.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-label">{{ s.label }}</div>
            <div class="stat-value">{{ s.value }}<small>{{ s.unit }}</small></div>
            <div v-if="s.trend !== null" class="stat-trend" :class="s.trend >= 0 ? 'up' : 'down'">
              <el-icon><CaretTop v-if="s.trend >= 0" /><CaretBottom v-else /></el-icon>
              {{ Math.abs(s.trend).toFixed(2) }}% 较上月
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 主图表：双Y轴 柱状+折线 -->
    <el-card shadow="hover" class="mt-16">
      <template #header>
        <div class="card-header">
          <span class="card-title">采购金额与数量趋势（双轴分析）</span>
          <el-tag type="primary" size="small" effect="plain">月度</el-tag>
        </div>
      </template>
      <BaseChart v-loading="loading" :option="chartOption" height="380px" />
    </el-card>

    <!-- 明细表格 -->
    <el-card shadow="hover" class="mt-16">
      <template #header>
        <div class="card-header">
          <span class="card-title">月度采购明细</span>
          <el-button text type="primary" size="small" @click="exportData">导出 Excel</el-button>
        </div>
      </template>
      <el-table :data="tableData" stripe border>
        <el-table-column prop="month" label="月份" width="140" />
        <el-table-column label="采购金额（元）" align="right">
          <template #default="{ row }">{{ formatMoney(row.amount) }}</template>
        </el-table-column>
        <el-table-column label="采购数量（件）" align="right">
          <template #default="{ row }">{{ row.quantity.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="单价均值（元/件）" align="right">
          <template #default="{ row }">{{ formatMoney(Math.round(row.amount / row.quantity)) }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import BaseChart from '@/components/BaseChart.vue'
import { analyticsApi } from '@/api'

const data = ref({ dates: [], amounts: [], quantities: [] })
const loading = ref(false)

const stats = computed(() => {
  const d = data.value
  const arr = d.amounts || []
  const totalAmount = arr.reduce((s, v) => s + v, 0)
  const totalQty = (d.quantities || []).reduce((s, v) => s + v, 0)
  const n = (d.dates || []).length || 1
  const avgAmount = totalAmount / n
  const last = arr[arr.length - 1] || 0
  const prev = arr[arr.length - 2] || last
  const trend = prev === 0 ? 0 : ((last - prev) / prev) * 100
  return [
    { label: '总采购额', value: formatWan(totalAmount), unit: '万', icon: 'Money', color: '#1677ff', trend: null },
    { label: '总采购量', value: totalQty.toLocaleString(), unit: '件', icon: 'Box', color: '#52c41a', trend: null },
    { label: '月均采购额', value: formatWan(avgAmount), unit: '万', icon: 'TrendCharts', color: '#722ed1', trend: null },
    { label: '环比增长', value: trend.toFixed(2), unit: '%', icon: 'DataLine', color: trend >= 0 ? '#52c41a' : '#ff4d4f', trend: null }
  ]
})

const chartOption = computed(() => {
  const d = data.value
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross', label: { backgroundColor: '#1677ff' } },
      formatter: (params) => {
        const idx = params[0].dataIndex
        const date = (d.dates || [])[idx] || ''
        const amount = (d.amounts || [])[idx] || 0
        const qty = (d.quantities || [])[idx] || 0
        const unit = qty ? Math.round(amount / qty) : 0
        return `<b>${date}</b><br/>采购金额：${formatMoney(amount)} 元<br/>采购数量：${qty} 件<br/>均价：${formatMoney(unit)} 元/件`
      }
    },
    legend: { data: ['采购金额', '采购数量'], right: 20, top: 0 },
    grid: { left: 60, right: 60, top: 50, bottom: 40 },
    xAxis: { type: 'category', data: d.dates || [], axisLine: { lineStyle: { color: '#dcdfe6' } } },
    yAxis: [
      {
        type: 'value', name: '金额(元)', position: 'left',
        axisLabel: { formatter: (v) => v / 10000 + '万' },
        splitLine: { lineStyle: { color: '#f0f0f0' } },
        axisLine: { show: true, lineStyle: { color: '#1677ff' } }
      },
      {
        type: 'value', name: '数量(件)', position: 'right',
        splitLine: { show: false },
        axisLine: { show: true, lineStyle: { color: '#52c41a' } }
      }
    ],
    series: [
      {
        name: '采购金额', type: 'bar', data: d.amounts || [], barWidth: 30,
        itemStyle: { color: '#1677ff', borderRadius: [6, 6, 0, 0] },
        label: { show: true, position: 'top', formatter: (p) => formatWan(p.value) + '万', fontSize: 11, color: '#1677ff' }
      },
      {
        name: '采购数量', type: 'line', yAxisIndex: 1, data: d.quantities || [],
        smooth: true, symbol: 'circle', symbolSize: 9,
        lineStyle: { width: 3, color: '#52c41a' },
        itemStyle: { color: '#52c41a', borderColor: '#fff', borderWidth: 2 },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(82,196,26,0.25)' }, { offset: 1, color: 'rgba(82,196,26,0)' }] } }
      }
    ]
  }
})

const tableData = computed(() => {
  const d = data.value
  return (d.dates || []).map((m, i) => ({ month: m, amount: (d.amounts || [])[i] || 0, quantity: (d.quantities || [])[i] || 0 }))
})

function formatMoney(v) { return Number(v || 0).toLocaleString('zh-CN') }
function formatWan(v) { return (Number(v || 0) / 10000).toFixed(1) }

function exportData() { ElMessage.success('已导出采购分析明细为 Excel（演示）') }

async function load() {
  loading.value = true
  try {
    const res = await analyticsApi.purchase()
    if (res.code === 200) data.value = res.data
  } finally { loading.value = false }
}

onMounted(load)
</script>

<style scoped>
.page-title { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 600; color: #303133; }
.stat-card {
  background: #fff; border-radius: 10px; padding: 18px;
  display: flex; align-items: center; gap: 14px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.06);
  margin-bottom: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 21, 41, 0.1); }
.stat-icon {
  width: 52px; height: 52px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.stat-info { flex: 1; min-width: 0; }
.stat-label { font-size: 13px; color: #909399; }
.stat-value { font-size: 26px; font-weight: 700; color: #303133; line-height: 1.3; }
.stat-value small { font-size: 13px; font-weight: normal; color: #909399; margin-left: 2px; }
.stat-trend { font-size: 12px; display: flex; align-items: center; gap: 2px; }
.stat-trend.up { color: #52c41a; }
.stat-trend.down { color: #ff4d4f; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-title { font-weight: 600; color: #303133; }
</style>
