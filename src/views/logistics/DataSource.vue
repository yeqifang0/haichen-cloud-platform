<template>
  <div class="page-container">
    <el-card shadow="hover" class="head-card">
      <div class="head-banner">
        <div class="head-text">
          <h2><el-icon><Connection /></el-icon> HC002 {{ $t('dataSource.title') }}</h2>
        </div>
      </div>
    </el-card>

    <!-- 顶部统计卡片 -->
    <el-row :gutter="16" class="mt-16">
      <el-col v-for="c in statCards" :key="c.key" :xs="24" :sm="8">
        <div class="stat-card" :class="c.cls">
          <div class="stat-icon"><el-icon :size="26"><component :is="c.icon" /></el-icon></div>
          <div class="stat-info">
            <div class="stat-label">{{ t(c.labelKey) }}</div>
            <div class="stat-value">{{ c.value }}<small>{{ c.unit }}</small></div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="mt-16">
      <el-col :xs="24" :lg="15">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">{{ $t('dataSource.title') }}</span>
            </div>
          </template>
          <el-table :data="list" v-loading="loading" stripe border>
            <el-table-column prop="name" :label="$t('dataSource.name')" min-width="200" show-overflow-tooltip />
            <el-table-column prop="type" :label="$t('field.type')" width="90">
              <template #default="{ row }"><el-tag :type="typeColor(row.type)" size="small" effect="plain">{{ translateDsType(row.type) }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="status" :label="$t('field.status')" width="90">
              <template #default="{ row }"><el-tag :type="sourceStatusColor(row.status)" size="small">{{ translateDsStatus(row.status) }}</el-tag></template>
            </el-table-column>
            <el-table-column prop="latency" :label="$t('dataSource.latency')" width="100">
              <template #default="{ row }">
                <span :class="{ 'lat-warn': isLatencyHigh(row.latency) }">{{ row.latency }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="dailyVolume" :label="$t('dataSource.dailyVolume')" width="110" />
            <el-table-column prop="accuracy" :label="$t('dataSource.accuracy')" width="100">
              <template #default="{ row }">
                <span :style="{ color: accuracyColor(row.accuracy) }">{{ row.accuracy }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="9">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">{{ $t('field.type') }}</span>
            </div>
          </template>
          <BaseChart :option="pieOption" height="320px" />
          <div class="legend-summary">
            <div v-for="t in typeSummary" :key="t.name" class="legend-item">
              <span class="legend-dot" :style="{ background: t.color }"></span>
              <span class="legend-name">{{ translateDsType(t.name) }}</span>
              <span class="legend-count">{{ t.count }}</span>
              <span class="legend-pct">{{ t.pct }}%</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseChart from '@/components/BaseChart.vue'
import { analyticsApi } from '@/api'

const { t } = useI18n()

const list = ref([])
const loading = ref(false)

const TYPE_COLORS = { 海运: '#1677ff', 空运: '#13c2c2', 陆运: '#722ed1' }

const DS_TYPE_MAP = { '海运': 'transport.sea', '空运': 'transport.air', '陆运': 'transport.road' }
function translateDsType(s) { return DS_TYPE_MAP[s] ? t(DS_TYPE_MAP[s]) : s }

const DS_STATUS_MAP = { '在线': 'dataSource.online', '降级': 'dataSource.degraded', '离线': 'common.noData' }
function translateDsStatus(s) {
  const map = { '在线': 'dataSource.online', '降级': 'dataSource.degraded', '离线': 'common.noData' }
  return map[s] ? t(map[s]) : s
}

const statCards = computed(() => [
  { key: 'count', labelKey: 'dataSource.title', value: list.value.length, unit: '', icon: 'Connection', cls: 'primary' },
  { key: 'volume', labelKey: 'dataSource.dailyVolume', value: '5.2', unit: 'TB', icon: 'DataAnalysis', cls: 'success' },
  { key: 'latency', labelKey: 'dataSource.latency', value: '142', unit: 'ms', icon: 'Timer', cls: 'warning' }
])

const typeSummary = computed(() => {
  const total = list.value.length
  const groups = ['海运', '空运', '陆运'].map((name) => {
    const count = list.value.filter((d) => d.type === name).length
    return { name, count, pct: total ? Math.round((count / total) * 100) : 0, color: TYPE_COLORS[name] }
  })
  return groups.filter((g) => g.count > 0)
})

const pieOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { bottom: 0, icon: 'circle' },
  color: ['#1677ff', '#13c2c2', '#722ed1'],
  series: [
    {
      type: 'pie',
      radius: ['45%', '70%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
      data: typeSummary.value.map((tp) => ({ name: translateDsType(tp.name), value: tp.count }))
    }
  ]
}))

async function load() {
  loading.value = true
  try {
    const res = await analyticsApi.dataSources()
    if (res.code === 200) list.value = res.data
  } finally { loading.value = false }
}

function typeColor(ts) {
  return { 海运: 'primary', 空运: 'success', 陆运: 'warning' }[ts] || ''
}
function sourceStatusColor(s) {
  return { 在线: 'success', 降级: 'warning', 离线: 'danger' }[s] || 'info'
}
function isLatencyHigh(lat) {
  const n = parseInt(lat, 10)
  return !isNaN(n) && n > 200
}
function accuracyColor(acc) {
  const n = parseFloat(acc)
  if (isNaN(n)) return '#303133'
  if (n >= 98) return '#52c41a'
  if (n >= 95) return '#faad14'
  return '#ff4d4f'
}

onMounted(load)
</script>

<style scoped>
.mt-16 { margin-top: 16px; }
.head-banner {
  background: linear-gradient(135deg, #1677ff 0%, #0052d9 100%);
  border-radius: 10px; padding: 22px 28px; color: #fff;
}
.head-text h2 { font-size: 20px; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
.head-text p { font-size: 13px; opacity: 0.9; }
.stat-card {
  display: flex; align-items: center; gap: 14px;
  background: #fff; border-radius: 10px; padding: 18px 20px;
  box-shadow: 0 1px 4px rgba(0,21,41,0.06); margin-bottom: 16px;
  border-left: 4px solid #dcdfe6; transition: transform 0.2s, box-shadow 0.2s;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,21,41,0.1); }
.stat-card.primary { border-left-color: #1677ff; }
.stat-card.success { border-left-color: #52c41a; }
.stat-card.warning { border-left-color: #faad14; }
.stat-icon { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-card.primary .stat-icon { background: rgba(22,119,255,0.1); color: #1677ff; }
.stat-card.success .stat-icon { background: rgba(82,196,26,0.1); color: #52c41a; }
.stat-card.warning .stat-icon { background: rgba(250,173,20,0.1); color: #faad14; }
.stat-label { font-size: 13px; color: #909399; }
.stat-value { font-size: 28px; font-weight: 700; color: #303133; line-height: 1.2; }
.stat-value small { font-size: 13px; font-weight: normal; color: #909399; margin-left: 2px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-title { font-weight: 600; color: #303133; }
.lat-warn { color: #ff4d4f; font-weight: 600; }
.legend-summary { display: flex; flex-direction: column; gap: 8px; padding: 8px 8px 0; }
.legend-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #606266; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.legend-name { flex: 1; }
.legend-count { color: #909399; }
.legend-pct { color: #1677ff; font-weight: 600; min-width: 44px; text-align: right; }
</style>
