<template>
  <div class="page-container">
    <!-- 页头 -->
    <el-card shadow="hover" class="mb-16">
      <div class="page-title">
        <el-icon><Sell /></el-icon>
        <span>{{ $t('analytics.salesTitle') }}</span>
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
            <div class="stat-label">{{ t(s.label) }}</div>
            <div class="stat-value">{{ s.value }}<small>{{ s.unit }}</small></div>
            <div v-if="s.trend !== null" class="stat-trend" :class="s.trend >= 0 ? 'up' : 'down'">
              <el-icon><CaretTop v-if="s.trend >= 0" /><CaretBottom v-else /></el-icon>
              {{ Math.abs(s.trend).toFixed(2) }}%
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 主图表：双Y轴 柱状(橙)+折线(蓝) -->
    <el-card shadow="hover" class="mt-16">
      <template #header>
        <div class="card-header">
          <span class="card-title">{{ $t('analytics.salesTitle') }}</span>
        </div>
      </template>
      <BaseChart v-loading="loading" :option="chartOption" height="380px" />
    </el-card>

    <!-- 明细表格 -->
    <el-card shadow="hover" class="mt-16">
      <template #header>
        <div class="card-header">
          <span class="card-title">{{ $t('analytics.salesTitle') }}</span>
          <el-button text type="primary" size="small" @click="exportData">{{ $t('btn.export') }}</el-button>
        </div>
      </template>
      <el-table :data="tableData" stripe border>
        <el-table-column prop="month" :label="$t('analytics.month')" width="140" />
        <el-table-column :label="$t('analytics.amount')" align="right">
          <template #default="{ row }">{{ formatMoney(row.amount) }}</template>
        </el-table-column>
        <el-table-column :label="$t('analytics.qty')" align="right">
          <template #default="{ row }">{{ row.quantity.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column :label="$t('analytics.avgPrice')" align="right">
          <template #default="{ row }">{{ formatMoney(Math.round(row.amount / row.quantity)) }}</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import BaseChart from '@/components/BaseChart.vue'
import { analyticsApi } from '@/api'

const { t } = useI18n()

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
    { label: 'analytics.amount', value: formatWan(totalAmount), unit: '万', icon: 'Money', color: '#fa8c16', trend: null },
    { label: 'analytics.qty', value: totalQty.toLocaleString(), unit: '件', icon: 'Box', color: '#1677ff', trend: null },
    { label: 'analytics.amount', value: formatWan(avgAmount), unit: '万', icon: 'TrendCharts', color: '#722ed1', trend: null },
    { label: 'analytics.amount', value: trend.toFixed(2), unit: '%', icon: 'DataLine', color: trend >= 0 ? '#52c41a' : '#ff4d4f', trend: null }
  ]
})

const chartOption = computed(() => {
  const d = data.value
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross', label: { backgroundColor: '#fa8c16' } },
      formatter: (params) => {
        const idx = params[0].dataIndex
        const date = (d.dates || [])[idx] || ''
        const amount = (d.amounts || [])[idx] || 0
        const qty = (d.quantities || [])[idx] || 0
        const unit = qty ? Math.round(amount / qty) : 0
        return `<b>${date}</b><br/>${t('analytics.amount')}：${formatMoney(amount)} 元<br/>${t('analytics.qty')}：${qty}<br/>${t('analytics.avgPrice')}：${formatMoney(unit)}`
      }
    },
    legend: { data: [t('analytics.amount'), t('analytics.qty')], right: 20, top: 0 },
    grid: { left: 60, right: 60, top: 50, bottom: 40 },
    xAxis: { type: 'category', data: d.dates || [], axisLine: { lineStyle: { color: '#dcdfe6' } } },
    yAxis: [
      {
        type: 'value', name: t('analytics.amount'), position: 'left',
        axisLabel: { formatter: (v) => v / 10000 + '万' },
        splitLine: { lineStyle: { color: '#f0f0f0' } },
        axisLine: { show: true, lineStyle: { color: '#fa8c16' } }
      },
      {
        type: 'value', name: t('analytics.qty'), position: 'right',
        splitLine: { show: false },
        axisLine: { show: true, lineStyle: { color: '#1677ff' } }
      }
    ],
    series: [
      {
        name: t('analytics.amount'), type: 'bar', data: d.amounts || [], barWidth: 30,
        itemStyle: { color: '#fa8c16', borderRadius: [6, 6, 0, 0] },
        label: { show: true, position: 'top', formatter: (p) => formatWan(p.value) + '万', fontSize: 11, color: '#fa8c16' }
      },
      {
        name: t('analytics.qty'), type: 'line', yAxisIndex: 1, data: d.quantities || [],
        smooth: true, symbol: 'circle', symbolSize: 9,
        lineStyle: { width: 3, color: '#1677ff' },
        itemStyle: { color: '#1677ff', borderColor: '#fff', borderWidth: 2 },
        areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(22,119,255,0.25)' }, { offset: 1, color: 'rgba(22,119,255,0)' }] } }
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

function exportData() { ElMessage.success(t('common.success')) }

async function load() {
  loading.value = true
  try {
    const res = await analyticsApi.sales()
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
:deep(.el-table__row) { cursor: default; }
</style>
