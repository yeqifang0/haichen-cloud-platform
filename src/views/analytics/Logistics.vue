<template>
  <div class="page-container">
    <!-- 页头 -->
    <el-card shadow="hover" class="mb-16">
      <div class="page-title">
        <el-icon><Monitor /></el-icon>
        <span>{{ $t('analytics.logisticsTitle') }}</span>
      </div>
    </el-card>

    <!-- KPI 指标卡片 -->
    <el-row :gutter="16">
      <el-col v-for="s in cards" :key="s.label" :xs="12" :sm="8" :md="4">
        <div class="stat-card">
          <div class="stat-icon" :style="{ background: s.color + '1a', color: s.color }">
            <el-icon :size="24"><component :is="s.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-label">{{ t(s.label) }}</div>
            <div class="stat-value">{{ s.value }}<small>{{ s.unit }}</small></div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区：仪表盘 + 异常率趋势 -->
    <el-row :gutter="16" class="mt-16">
      <el-col :xs="24" :lg="10">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">{{ $t('analytics.slaRate') }}</span>
            </div>
          </template>
          <BaseChart :option="gaugeOption" height="340px" />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="14">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">{{ $t('analytics.logisticsTitle') }}</span>
            </div>
          </template>
          <BaseChart :option="trendOption" height="340px" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据源健康度 -->
    <el-card shadow="hover" class="mt-16">
      <template #header>
        <div class="card-header">
          <span class="card-title">{{ $t('analytics.logisticsTitle') }}</span>
        </div>
      </template>
      <el-table :data="sources" v-loading="loading" stripe border>
        <el-table-column prop="id" :label="$t('field.no')" width="80" align="center" />
        <el-table-column prop="name" :label="$t('field.name')" min-width="200" show-overflow-tooltip />
        <el-table-column prop="type" :label="$t('field.type')" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small" effect="plain" :type="typeTag(row.type)">{{ translateTransport(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('field.status')" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="statusType(row.status)" effect="light">{{ translateDataSourceStatus(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('field.gps')" width="120" align="right">
          <template #default="{ row }">
            <span :style="{ color: latencyColor(row.latency) }">{{ row.latency }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dailyVolume" :label="$t('dashboard.dataVolume')" width="140" align="right" />
        <el-table-column prop="accuracy" :label="$t('analytics.slaRate')" width="140" align="right">
          <template #default="{ row }">
            <span :style="{ color: accuracyColor(row.accuracy), fontWeight: 600 }">{{ row.accuracy }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseChart from '@/components/BaseChart.vue'
import { analyticsApi } from '@/api'

const { t } = useI18n()

const kpis = ref({ avgResponseTime: 0, accuracy: 0, warningRate: 0, predictionAccuracy: 0, dailyVolume: '-', concurrency: 0 })
const sources = ref([])
const loading = ref(false)

const TRANSPORT_MAP = { '海运': 'transport.sea', '空运': 'transport.air', '陆运': 'transport.road' }
function translateTransport(m) { return TRANSPORT_MAP[m] ? t(TRANSPORT_MAP[m]) : m }

const DS_STATUS_MAP = { '在线': 'dataSource.online', '降级': 'dataSource.degraded', '离线': 'shipmentStatus.pendingAssign' }
function translateDataSourceStatus(s) {
  const map = { '在线': 'dataSource.online', '降级': 'dataSource.degraded', '离线': 'shipmentStatus.pendingAssign' }
  const key = map[s]
  return key ? t(key) : s
}

const cards = computed(() => {
  const k = kpis.value
  return [
    { label: 'dashboard.queryResponse', value: k.avgResponseTime, unit: 'ms', icon: 'Timer', color: '#1677ff' },
    { label: 'analytics.slaRate', value: k.accuracy, unit: '%', icon: 'CircleCheck', color: '#52c41a' },
    { label: 'analytics.slaRate', value: k.predictionAccuracy, unit: '%', icon: 'Aim', color: '#722ed1' },
    { label: 'analytics.slaRate', value: k.warningRate, unit: '%', icon: 'Warning', color: '#faad14' },
    { label: 'dashboard.dataVolume', value: (k.dailyVolume || '-').replace(/TB$/i, ''), unit: 'TB', icon: 'Coin', color: '#13c2c2' },
    { label: 'dashboard.onlineConcurrent', value: k.concurrency ? k.concurrency.toLocaleString() : '-', unit: '', icon: 'Connection', color: '#ff4d4f' }
  ]
})

const trendValues = [3, 5, 2, 4, 6, 3, 2]
const trendDates = computed(() => {
  const out = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const p = (n) => String(n).padStart(2, '0')
    out.push(`${p(d.getMonth() + 1)}-${p(d.getDate())}`)
  }
  return out
})

const gaugeOption = computed(() => ({
  series: [
    {
      type: 'gauge',
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      progress: { show: true, width: 16, itemStyle: { color: '#52c41a' } },
      axisLine: { lineStyle: { width: 16, color: [[1, '#f0f2f5']] } },
      pointer: { width: 5, length: '60%', itemStyle: { color: '#52c41a' } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      anchor: { show: true, size: 14, itemStyle: { color: '#52c41a', borderColor: '#fff', borderWidth: 2 } },
      detail: {
        valueAnimation: true,
        formatter: '{value}%',
        fontSize: 28,
        fontWeight: 'bold',
        color: '#52c41a',
        offsetCenter: [0, '65%']
      },
      title: { show: true, offsetCenter: [0, '92%'], fontSize: 13, color: '#909399' },
      data: [{ value: kpis.value.accuracy || 0, name: t('analytics.slaRate') }]
    }
  ]
}))

const trendOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    formatter: (p) => `${p[0].name}<br/>${t('analytics.slaRate')}：<b>${p[0].value}%</b>`
  },
  grid: { left: 45, right: 20, top: 30, bottom: 35 },
  xAxis: { type: 'category', data: trendDates.value, axisLine: { lineStyle: { color: '#dcdfe6' } } },
  yAxis: { type: 'value', name: '%', splitLine: { lineStyle: { color: '#f0f0f0' } } },
  series: [
    {
      name: t('analytics.slaRate'),
      type: 'bar',
      data: trendValues,
      barWidth: '42%',
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [{ offset: 0, color: '#faad14' }, { offset: 1, color: '#ff4d4f' }]
        }
      },
      label: { show: true, position: 'top', formatter: '{c}%', fontSize: 11, color: '#606266' }
    }
  ]
}))

function statusType(s) {
  return { 在线: 'success', 降级: 'warning', 离线: 'danger' }[s] || 'info'
}
function typeTag(t) {
  return { 海运: 'primary', 空运: 'success', 陆运: 'warning' }[t] || 'info'
}
function latencyColor(lat) {
  const ms = parseInt(lat, 10)
  if (isNaN(ms)) return '#303133'
  if (ms >= 300) return '#ff4d4f'
  if (ms >= 150) return '#faad14'
  return '#52c41a'
}
function accuracyColor(acc) {
  const v = parseFloat(acc)
  if (isNaN(v)) return '#303133'
  if (v >= 98) return '#52c41a'
  if (v >= 95) return '#faad14'
  return '#ff4d4f'
}

async function loadKpi() {
  const res = await analyticsApi.logisticsKpi()
  if (res.code === 200) kpis.value = res.data
}
async function loadSources() {
  loading.value = true
  try {
    const res = await analyticsApi.dataSources()
    if (res.code === 200) sources.value = res.data
  } finally { loading.value = false }
}

onMounted(() => { loadKpi(); loadSources() })
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
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-title { font-weight: 600; color: #303133; }
</style>
