<template>
  <div class="dashboard page-container">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="welcome-text">
        <h2>{{ greeting }}, {{ userNameDisplay }} 👋</h2>
        <p>{{ $t('dashboard.welcomeBack', { date: today }) }}</p>
      </div>
      <div class="welcome-stats">
        <div class="ws-item">
          <span class="ws-label">{{ $t('dashboard.dataVolume') }}</span>
          <span class="ws-value">5.2 <small>TB</small></span>
        </div>
        <div class="ws-divider"></div>
        <div class="ws-item">
          <span class="ws-label">{{ $t('dashboard.queryResponse') }}</span>
          <span class="ws-value">142 <small>ms</small></span>
        </div>
        <div class="ws-divider"></div>
        <div class="ws-item">
          <span class="ws-label">{{ $t('dashboard.onlineConcurrent') }}</span>
          <span class="ws-value">8,620</span>
        </div>
      </div>
    </div>

    <!-- KPI 卡片 -->
    <el-row :gutter="16" class="kpi-row">
      <el-col v-for="kpi in kpis" :key="kpi.key" :xs="12" :sm="8" :md="4">
        <div class="kpi-card">
          <div class="kpi-icon" :style="{ background: kpi.color + '1a', color: kpi.color }">
            <el-icon :size="24"><component :is="kpi.icon" /></el-icon>
          </div>
          <div class="kpi-info">
            <div class="kpi-label">{{ t(kpi.labelKey) }}</div>
            <div class="kpi-value">{{ kpi.value }}<small>{{ kpi.unitKey ? t(kpi.unitKey) : '' }}</small></div>
            <div class="kpi-trend" :class="kpi.trend >= 0 ? 'up' : 'down'">
              <el-icon><CaretTop v-if="kpi.trend >= 0" /><CaretBottom v-else /></el-icon>
              {{ Math.abs(kpi.trend) }}% {{ $t('dashboard.trendCompare') }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区 -->
    <el-row :gutter="16" class="mt-16">
      <el-col :xs="24" :lg="16">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">{{ $t('dashboard.inOutTrend') }}</span>
              <el-tag type="success" size="small" effect="plain">{{ $t('dashboard.tagFinance') }}</el-tag>
            </div>
          </template>
          <BaseChart :option="inOutOption" height="320px" />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">{{ $t('dashboard.transportMode') }}</span>
              <el-tag type="primary" size="small" effect="plain">{{ $t('dashboard.tagHC002') }}</el-tag>
            </div>
          </template>
          <BaseChart :option="modeOption" height="320px" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="mt-16">
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">{{ $t('dashboard.alertTrend') }}</span>
              <el-tag type="warning" size="small" effect="plain">{{ $t('dashboard.tagAlertAccuracy') }}</el-tag>
            </div>
          </template>
          <BaseChart :option="alertOption" height="300px" />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">{{ $t('dashboard.topCustomers') }}</span>
              <el-tag size="small" effect="plain">{{ $t('dashboard.tagYearTotal') }}</el-tag>
            </div>
          </template>
          <BaseChart :option="customerOption" height="300px" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 仓储监控 + 物流在途 -->
    <el-row :gutter="16" class="mt-16">
      <el-col :xs="24" :lg="10">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">{{ $t('dashboard.warehouseStatus') }}</span>
              <el-button text type="primary" size="small" @click="$router.push('/warehouse/monitor')">{{ $t('dashboard.details') }}</el-button>
            </div>
          </template>
          <div class="wh-list">
            <div v-for="wh in warehouses" :key="wh.id" class="wh-item">
              <div class="wh-head">
                <span class="wh-name">{{ wh.name }}</span>
                <el-tag :type="wh.usage > 90 ? 'danger' : wh.usage > 75 ? 'warning' : 'success'" size="small">{{ wh.usage }}%</el-tag>
              </div>
              <el-progress :percentage="wh.usage" :color="wh.usage > 90 ? '#ff4d4f' : wh.usage > 75 ? '#faad14' : '#52c41a'" :show-text="false" :stroke-width="8" />
              <div class="wh-meta">
                <span>{{ $t('dashboard.temp') }} {{ wh.temp }}℃</span>
                <span>{{ $t('dashboard.humidity') }} {{ wh.humidity }}%</span>
                <span>{{ translateWarehouseType(wh.type) }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="14">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">{{ $t('dashboard.inTransitShipments') }}</span>
              <el-button text type="primary" size="small" @click="$router.push('/logistics/track')">{{ $t('dashboard.track') }}</el-button>
            </div>
          </template>
          <el-table :data="activeShipments" style="width: 100%" size="small">
            <el-table-column prop="trackingNo" :label="$t('dashboard.trackingNo')" width="170" />
            <el-table-column :label="$t('dashboard.route')">
              <template #default="{ row }">{{ row.fromCity }} → {{ row.toCity }}</template>
            </el-table-column>
            <el-table-column :label="$t('dashboard.mode')" width="80">
              <template #default="{ row }">{{ translateTransportMode(row.mode) }}</template>
            </el-table-column>
            <el-table-column :label="$t('dashboard.progress')">
              <template #default="{ row }">
                <el-progress :percentage="row.progress" :stroke-width="6" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('dashboard.status')" width="100">
              <template #default="{ row }">
                <el-tag :type="shipStatusType(row.status)" size="small">{{ translateShipStatus(row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="eta" :label="$t('dashboard.eta')" width="150" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseChart from '@/components/BaseChart.vue'
import { dashboardApi, warehouseApi, logisticsApi } from '@/api'
import { useUserStore } from '@/stores'
import { getLocale } from '@/i18n'

const { t } = useI18n()
const userStore = useUserStore()

// 模拟数据加载
const data = ref({ kpis: [], inventoryTrend: {}, transportMode: [], alertTrend: {}, topCustomers: [] })
const warehouses = ref([])
const shipments = ref([])

// KPI 配置：key → i18n label / unit 映射
const KPI_MAP = {
  todayIn:    { labelKey: 'dashboard.todayIn',    unitKey: 'dashboard.unitItem' },
  todayOut:   { labelKey: 'dashboard.todayOut',   unitKey: 'dashboard.unitItem' },
  stockWarn:  { labelKey: 'dashboard.lowStock',  unitKey: 'dashboard.unitRecord' },
  shipments:  { labelKey: 'dashboard.inTransit',  unitKey: 'dashboard.unitOrder' },
  alerts:     { labelKey: 'dashboard.abnormal',   unitKey: 'dashboard.unitRecord' },
  usage:      { labelKey: 'dashboard.avgRate',    unitKey: 'dashboard.unitPercent' }
}

const kpis = computed(() => {
  return (data.value.kpis || []).map((kpi) => ({
    ...kpi,
    labelKey: KPI_MAP[kpi.key]?.labelKey || '',
    unitKey: KPI_MAP[kpi.key]?.unitKey || ''
  }))
})

const activeShipments = computed(() => shipments.value.filter((s) => s.status !== '已签收'))

// 用户名 i18n 映射：mock 存中文，英文环境下需要翻译
const NAME_MAP = {
  '系统管理员': 'System Admin',
  '王经理': 'Manager Wang',
  '李仓管': 'Li Cang',
  '张调度': 'Zhang Dispatch',
  '蔡财务': 'Cai Finance'
}
const userNameDisplay = computed(() => {
  const raw = userStore.userInfo?.name || ''
  if (!raw) return t('dashboard.admin')
  if (getLocale() === 'en-US') return NAME_MAP[raw] || raw
  return raw
})

// 问候语：根据当前时间 + locale 计算
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return t('dashboard.greetingDawn')
  if (h < 9) return t('dashboard.greetingMorning')
  if (h < 12) return t('dashboard.greetingForenoon')
  if (h < 14) return t('dashboard.greetingNoon')
  if (h < 18) return t('dashboard.greetingAfternoon')
  return t('dashboard.greetingEvening')
})

// 今天日期：根据当前 locale 格式化
const today = computed(() => {
  const locale = getLocale()
  return new Date().toLocaleDateString(locale === 'en-US' ? 'en-US' : 'zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})

// === 枚举翻译：mock 中存中文，前端用 i18n 映射 ===
const SHIP_STATUS_MAP = {
  '运输中': 'shipmentStatus.inTransit',
  '已签收': 'shipmentStatus.delivered',
  '待发运': 'shipmentStatus.pendingShip',
  '待指派': 'shipmentStatus.pendingAssign'
}
function translateShipStatus(s) { return SHIP_STATUS_MAP[s] ? t(SHIP_STATUS_MAP[s]) : s }

const TRANSPORT_MAP = { '陆运': 'transport.road', '空运': 'transport.air', '海运': 'transport.sea' }
function translateTransportMode(m) { return TRANSPORT_MAP[m] ? t(TRANSPORT_MAP[m]) : m }

const WH_TYPE_MAP = { '中心仓': 'warehouseType.center', '区域仓': 'warehouseType.region', '前置仓': 'warehouseType.front' }
function translateWarehouseType(wt) { return WH_TYPE_MAP[wt] ? t(WH_TYPE_MAP[wt]) : wt }

function shipStatusType(s) {
  return { '运输中': 'primary', '已签收': 'success', '待发运': 'info', '待指派': 'warning' }[s] || 'info'
}

// === ECharts 配置（响应式：依赖 t()，随语言切换自动更新） ===
const inOutOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: [t('dashboard.inLegend'), t('dashboard.outLegend')], right: 10, top: 0 },
  grid: { left: 40, right: 20, top: 40, bottom: 30 },
  xAxis: { type: 'category', data: data.value.inventoryTrend.dates || [], axisLine: { lineStyle: { color: '#dcdfe6' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
  series: [
    { name: t('dashboard.inLegend'), type: 'bar', data: data.value.inventoryTrend.in || [], itemStyle: { color: '#1677ff', borderRadius: [4, 4, 0, 0] }, barWidth: 14 },
    { name: t('dashboard.outLegend'), type: 'bar', data: data.value.inventoryTrend.out || [], itemStyle: { color: '#52c41a', borderRadius: [4, 4, 0, 0] }, barWidth: 14 }
  ]
}))

const modeOption = computed(() => {
  const trMap = { '陆运': t('transport.road'), '空运': t('transport.air'), '海运': t('transport.sea') }
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0 },
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
        data: (data.value.transportMode || []).map((d) => ({ name: trMap[d.name] || d.name, value: d.value }))
      }
    ]
  }
})

const alertOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 20, top: 20, bottom: 30 },
  xAxis: { type: 'category', data: data.value.alertTrend.dates || [], boundaryGap: false, axisLine: { lineStyle: { color: '#dcdfe6' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
  series: [
    {
      name: t('dashboard.alertLegend'),
      type: 'line',
      data: data.value.alertTrend.values || [],
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { width: 3, color: '#faad14' },
      itemStyle: { color: '#faad14' },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(250,173,20,0.4)' }, { offset: 1, color: 'rgba(250,173,20,0)' }] } }
    }
  ]
}))

const customerOption = computed(() => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 100, right: 20, top: 20, bottom: 30 },
  xAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
  yAxis: { type: 'category', data: (data.value.topCustomers || []).map((c) => c.name), axisLine: { lineStyle: { color: '#dcdfe6' } } },
  series: [
    {
      type: 'bar',
      data: (data.value.topCustomers || []).map((c) => c.value),
      barWidth: 16,
      itemStyle: {
        borderRadius: [0, 4, 4, 0],
        color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#1677ff' }, { offset: 1, color: '#0052d9' }] }
      },
      label: { show: true, position: 'right', formatter: '{c}' }
    }
  ]
}))

async function load() {
  const [d, w, s] = await Promise.all([
    dashboardApi.overview(),
    warehouseApi.warehouses.all(),
    logisticsApi.shipments({ pageSize: 50 })
  ])
  if (d.code === 200) data.value = d.data
  if (w.code === 200) warehouses.value = w.data.filter((x) => x.status === 1)
  if (s.code === 200) shipments.value = s.data.list
}

onMounted(load)
</script>

<style scoped>
.welcome-banner {
  background: linear-gradient(135deg, #1677ff 0%, #0052d9 100%);
  border-radius: 12px;
  padding: clamp(16px, 2.5vw, 28px) clamp(18px, 3vw, 28px);
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(22, 119, 255, 0.35);
  position: relative;
  overflow: hidden;
}
.welcome-banner::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
}
.welcome-text {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
}
.welcome-text h2 {
  font-size: clamp(16px, 2.2vw, 22px);
  margin-bottom: 6px;
  font-weight: 600;
  line-height: 1.4;
  white-space: normal;
  overflow-wrap: break-word;
  word-break: normal;
}
.welcome-text p {
  font-size: clamp(12px, 1.5vw, 13px);
  opacity: 0.9;
  white-space: normal;
  overflow-wrap: break-word;
}
.welcome-stats {
  display: flex;
  align-items: center;
  gap: clamp(12px, 2vw, 24px);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}
.ws-item {
  text-align: center;
  white-space: nowrap;
}
.ws-label {
  display: block;
  font-size: clamp(11px, 1.3vw, 12px);
  opacity: 0.85;
  margin-bottom: 4px;
}
.ws-value {
  font-size: clamp(18px, 2.2vw, 24px);
  font-weight: 600;
  line-height: 1.2;
}
.ws-value small {
  font-size: clamp(10px, 1.2vw, 12px);
  font-weight: normal;
  opacity: 0.85;
}
.ws-divider {
  width: 1px;
  height: clamp(24px, 4vw, 36px);
  background: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .welcome-banner {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    padding: 18px 20px;
  }
  .welcome-stats { width: 100%; justify-content: space-between; }
  .ws-divider { height: 28px; }
}
@media (max-width: 480px) {
  .welcome-stats { gap: 8px; }
  .ws-divider { height: 24px; }
}

.kpi-row { margin-bottom: 0; }
.kpi-card {
  background: var(--bg-card);
  border-radius: 10px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid var(--border-card);
  box-shadow: 0 2px 12px rgba(0, 10, 30, 0.4);
  margin-bottom: 16px;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}
.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 10, 30, 0.5);
  border-color: rgba(22, 119, 255, 0.5);
}
.kpi-icon {
  width: 52px; height: 52px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.kpi-info { flex: 1; min-width: 0; }
.kpi-label { font-size: 13px; color: var(--text-secondary); }
.kpi-value { font-size: 26px; font-weight: 700; color: var(--text-primary); line-height: 1.3; }
.kpi-value small { font-size: 13px; font-weight: normal; color: var(--text-secondary); margin-left: 2px; }
.kpi-trend { font-size: 12px; display: flex; align-items: center; gap: 2px; }
.kpi-trend.up { color: #73d13d; }
.kpi-trend.down { color: #ff7875; }
.chart-card { border-radius: 10px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-title { font-weight: 600; color: var(--text-primary); }
.wh-list { display: flex; flex-direction: column; gap: 16px; }
.wh-item { padding: 4px 0; }
.wh-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.wh-name { font-size: 14px; font-weight: 500; color: var(--text-primary); }
.wh-meta { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-secondary); margin-top: 6px; }
</style>
