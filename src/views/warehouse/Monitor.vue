<template>
  <div class="page-container">
    <el-row :gutter="16">
      <el-col v-for="card in overview" :key="card.label" :xs="12" :sm="6">
        <div class="ov-card" :style="{ background: card.bg }">
          <div class="ov-icon"><el-icon :size="28"><component :is="card.icon" /></el-icon></div>
          <div>
            <div class="ov-value">{{ card.value }}</div>
            <div class="ov-label">{{ card.label }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="mt-16">
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover">
          <template #header><span class="card-title">{{ $t('warehouse_m.title') }}{{ $t('field.type') }}{{ $t('dashboard.unitPercent') }}</span></template>
          <BaseChart :option="usageOption" height="300px" />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover">
          <template #header><span class="card-title">{{ $t('dashboard.temp') }}/{{ $t('dashboard.humidity') }}</span></template>
          <BaseChart :option="envOption" height="300px" />
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover" class="mt-16">
      <template #header><span class="card-title">{{ $t('warehouse_m.list') }}</span></template>
      <el-table :data="warehouses" stripe>
        <el-table-column prop="code" :label="$t('warehouse_m.code')" width="140" />
        <el-table-column prop="name" :label="$t('warehouse_m.name')" width="160" />
        <el-table-column prop="type" :label="$t('warehouse_m.type')" width="100">
          <template #default="{ row }">{{ translateWhType(row.type) }}</template>
        </el-table-column>
        <el-table-column prop="area" label="面积(㎡)" width="100" />
        <el-table-column prop="manager" :label="$t('warehouse_m.manager')" width="100" />
        <el-table-column label="库容使用率" width="200">
          <template #default="{ row }">
            <el-progress v-if="row.status" :percentage="row.usage" :color="usageColor(row.usage)" />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('dashboard.temp')" width="80">
          <template #default="{ row }">{{ row.status ? row.temp + '℃' : '-' }}</template>
        </el-table-column>
        <el-table-column :label="$t('dashboard.humidity')" width="80">
          <template #default="{ row }">{{ row.status ? row.humidity + '%' : '-' }}</template>
        </el-table-column>
        <el-table-column :label="$t('field.status')" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'info'" size="small">{{ row.status ? $t('goods_m.enabled') : $t('goods_m.disabled') }}</el-tag>
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
import { warehouseApi } from '@/api'

const { t } = useI18n()

const WH_TYPE_MAP = { '中心仓': 'warehouse_m.center', '区域仓': 'warehouse_m.region', '前置仓': 'warehouse_m.front' }
function translateWhType(v) { return WH_TYPE_MAP[v] ? t(WH_TYPE_MAP[v]) : v }

const warehouses = ref([])

const overview = computed(() => [
  { label: t('dashboard.inLegend'), value: 50, icon: 'Goods', bg: 'linear-gradient(135deg,#e6f4ff,#bae0ff)' },
  { label: t('dashboard.outLegend'), value: 64, icon: 'Sell', bg: 'linear-gradient(135deg,#f6ffed,#d9f7be)' },
  { label: t('alert.titleField') + t('inventory.noStock'), value: warehouses.value.filter((w) => w.usage < 30 && w.status).length + 2, icon: 'Warning', bg: 'linear-gradient(135deg,#fffbe6,#fff1b8)' },
  { label: t('warehouse_m.title') + t('alert.titleField'), value: warehouses.value.filter((w) => w.usage > 90).length, icon: 'AlarmClock', bg: 'linear-gradient(135deg,#fff1f0,#ffccc7)' }
])

const usageOption = computed(() => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: 50, right: 20, top: 30, bottom: 30 },
  xAxis: { type: 'category', data: warehouses.value.map((w) => w.name), axisLine: { lineStyle: { color: '#dcdfe6' } } },
  yAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: '#f0f0f0' } } },
  series: [
    {
      type: 'bar',
      data: warehouses.value.map((w) => w.usage),
      barWidth: 28,
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
        color: (p) => (p.value > 90 ? '#ff4d4f' : p.value > 75 ? '#faad14' : '#52c41a')
      },
      label: { show: true, position: 'top', formatter: '{c}%' }
    }
  ]
}))

const envOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: [t('dashboard.temp') + '(℃)', t('dashboard.humidity') + '(%)'], top: 0 },
  grid: { left: 40, right: 40, top: 40, bottom: 30 },
  xAxis: { type: 'category', data: warehouses.value.filter((w) => w.status).map((w) => w.name), axisLine: { lineStyle: { color: '#dcdfe6' } } },
  yAxis: [
    { type: 'value', name: t('dashboard.temp'), position: 'left', splitLine: { lineStyle: { color: '#f0f0f0' } } },
    { type: 'value', name: t('dashboard.humidity'), position: 'right' }
  ],
  series: [
    { name: t('dashboard.temp') + '(℃)', type: 'line', data: warehouses.value.filter((w) => w.status).map((w) => w.temp), smooth: true, itemStyle: { color: '#ff4d4f' } },
    { name: t('dashboard.humidity') + '(%)', type: 'line', data: warehouses.value.filter((w) => w.status).map((w) => w.humidity), smooth: true, itemStyle: { color: '#1677ff' } }
  ]
}))

function usageColor(v) {
  return v > 90 ? '#ff4d4f' : v > 75 ? '#faad14' : '#52c41a'
}

async function load() {
  const res = await warehouseApi.warehouses.all()
  if (res.code === 200) warehouses.value = res.data
}
onMounted(load)
</script>

<style scoped>
.ov-card {
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}
.ov-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1677ff;
}
.ov-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
}
.ov-label {
  font-size: 13px;
  color: #606266;
}
.card-title {
  font-weight: 600;
}
</style>
