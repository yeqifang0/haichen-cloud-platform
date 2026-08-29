<template>
  <div class="dashboard page-container">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="welcome-text">
        <h2>{{ greeting }}，{{ userStore.userInfo?.name || '管理员' }} 👋</h2>
        <p>欢迎回到海辰智汇云平台，今天是 {{ today }}，祝您工作顺利</p>
      </div>
      <div class="welcome-stats">
        <div class="ws-item">
          <span class="ws-label">数据接入量(今日)</span>
          <span class="ws-value">5.2 <small>TB</small></span>
        </div>
        <div class="ws-divider"></div>
        <div class="ws-item">
          <span class="ws-label">查询响应</span>
          <span class="ws-value">142 <small>ms</small></span>
        </div>
        <div class="ws-divider"></div>
        <div class="ws-item">
          <span class="ws-label">在线并发</span>
          <span class="ws-value">8,620</span>
        </div>
      </div>
    </div>

    <!-- KPI 卡片 -->
    <el-row :gutter="16" class="kpi-row">
      <el-col v-for="kpi in data.kpis" :key="kpi.key" :xs="12" :sm="8" :md="4">
        <div class="kpi-card">
          <div class="kpi-icon" :style="{ background: kpi.color + '1a', color: kpi.color }">
            <el-icon :size="24"><component :is="kpi.icon" /></el-icon>
          </div>
          <div class="kpi-info">
            <div class="kpi-label">{{ kpi.label }}</div>
            <div class="kpi-value">{{ kpi.value }}<small>{{ kpi.unit }}</small></div>
            <div class="kpi-trend" :class="kpi.trend >= 0 ? 'up' : 'down'">
              <el-icon><CaretTop v-if="kpi.trend >= 0" /><CaretBottom v-else /></el-icon>
              {{ Math.abs(kpi.trend) }}% 较昨日
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
              <span class="card-title">仓储出入库趋势（近7日）</span>
              <el-tag type="success" size="small" effect="plain">融合销售仓储系统</el-tag>
            </div>
          </template>
          <BaseChart :option="inOutOption" height="320px" />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">运输方式占比</span>
              <el-tag type="primary" size="small" effect="plain">HC002 多源</el-tag>
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
              <span class="card-title">物流异常趋势（近7日）</span>
              <el-tag type="warning" size="small" effect="plain">预警准确率 92%</el-tag>
            </div>
          </template>
          <BaseChart :option="alertOption" height="300px" />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">客户交易额 TOP5（万元）</span>
              <el-tag size="small" effect="plain">本年累计</el-tag>
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
              <span class="card-title">仓库库容监控</span>
              <el-button text type="primary" size="small" @click="$router.push('/warehouse/monitor')">详情</el-button>
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
                <span>温度 {{ wh.temp }}℃</span>
                <span>湿度 {{ wh.humidity }}%</span>
                <span>{{ wh.type }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="14">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">在途运单实时状态</span>
              <el-button text type="primary" size="small" @click="$router.push('/logistics/track')">物流追踪</el-button>
            </div>
          </template>
          <el-table :data="activeShipments" style="width: 100%" size="small">
            <el-table-column prop="trackingNo" label="运单号" width="170" />
            <el-table-column label="线路">
              <template #default="{ row }">{{ row.fromCity }} → {{ row.toCity }}</template>
            </el-table-column>
            <el-table-column prop="mode" label="方式" width="70" />
            <el-table-column label="进度">
              <template #default="{ row }">
                <el-progress :percentage="row.progress" :stroke-width="6" />
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="shipStatusType(row.status)" size="small">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="eta" label="预计到达" width="150" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BaseChart from '@/components/BaseChart.vue'
import { dashboardApi, warehouseApi, logisticsApi } from '@/api'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const data = ref({ kpis: [], inventoryTrend: {}, transportMode: [], alertTrend: {}, topCustomers: [] })
const warehouses = ref([])
const shipments = ref([])

const activeShipments = computed(() => shipments.value.filter((s) => s.status !== '已签收'))

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return '凌晨好'
  if (h < 9) return '早上好'
  if (h < 12) return '上午好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
})
const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })

const inOutOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['入库', '出库'], right: 10, top: 0 },
  grid: { left: 40, right: 20, top: 40, bottom: 30 },
  xAxis: { type: 'category', data: data.value.inventoryTrend.dates || [], axisLine: { lineStyle: { color: '#dcdfe6' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
  series: [
    { name: '入库', type: 'bar', data: data.value.inventoryTrend.in || [], itemStyle: { color: '#1677ff', borderRadius: [4, 4, 0, 0] }, barWidth: 14 },
    { name: '出库', type: 'bar', data: data.value.inventoryTrend.out || [], itemStyle: { color: '#52c41a', borderRadius: [4, 4, 0, 0] }, barWidth: 14 }
  ]
}))

const modeOption = computed(() => ({
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
      data: data.value.transportMode || []
    }
  ]
}))

const alertOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: 40, right: 20, top: 20, bottom: 30 },
  xAxis: { type: 'category', data: data.value.alertTrend.dates || [], boundaryGap: false, axisLine: { lineStyle: { color: '#dcdfe6' } } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f0f0' } } },
  series: [
    {
      name: '异常数',
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
      label: { show: true, position: 'right', formatter: '{c}万' }
    }
  ]
}))

function shipStatusType(s) {
  return { 运输中: 'primary', 已签收: 'success', 待发运: 'info', 待指派: 'warning' }[s] || 'info'
}

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
  padding: 24px 28px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.welcome-text h2 {
  font-size: 22px;
  margin-bottom: 6px;
}
.welcome-text p {
  font-size: 13px;
  opacity: 0.9;
}
.welcome-stats {
  display: flex;
  align-items: center;
  gap: 24px;
}
.ws-item {
  text-align: center;
}
.ws-label {
  display: block;
  font-size: 12px;
  opacity: 0.85;
  margin-bottom: 4px;
}
.ws-value {
  font-size: 24px;
  font-weight: 600;
}
.ws-value small {
  font-size: 12px;
  font-weight: normal;
  opacity: 0.85;
}
.ws-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.3);
}
.kpi-row {
  margin-bottom: 0;
}
.kpi-card {
  background: #fff;
  border-radius: 10px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.06);
  margin-bottom: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}
.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 21, 41, 0.1);
}
.kpi-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.kpi-info {
  flex: 1;
  min-width: 0;
}
.kpi-label {
  font-size: 13px;
  color: #909399;
}
.kpi-value {
  font-size: 26px;
  font-weight: 700;
  color: #303133;
  line-height: 1.3;
}
.kpi-value small {
  font-size: 13px;
  font-weight: normal;
  color: #909399;
  margin-left: 2px;
}
.kpi-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 2px;
}
.kpi-trend.up {
  color: #52c41a;
}
.kpi-trend.down {
  color: #ff4d4f;
}
.chart-card {
  border-radius: 10px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-title {
  font-weight: 600;
  color: #303133;
}
.wh-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.wh-item {
  padding: 4px 0;
}
.wh-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.wh-name {
  font-size: 14px;
  font-weight: 500;
}
.wh-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
  margin-top: 6px;
}
</style>
