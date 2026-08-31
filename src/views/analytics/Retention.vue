<template>
  <div class="page-container">
    <!-- 页头 -->
    <el-card shadow="hover" class="mb-16">
      <div class="page-title">
        <el-icon><Box /></el-icon>
        <span>{{ $t('analytics.retentionTitle') }}</span>
      </div>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="16">
      <el-col v-for="s in stats" :key="s.label" :xs="24" :sm="8">
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

    <!-- 滞留列表 -->
    <el-card shadow="hover" class="mt-16">
      <div class="toolbar">
        <div class="sort-bar">
          <span class="sort-label">{{ $t('analytics.retentionDays') }}：</span>
          <el-radio-group v-model="sort" @change="load">
            <el-radio-button value="time">{{ $t('analytics.retentionDays') }}</el-radio-button>
            <el-radio-button value="stock">{{ $t('analytics.qty') }}</el-radio-button>
          </el-radio-group>
        </div>
        <el-tag type="info" size="small" effect="plain">{{ $t('analytics.qty') }}: {{ list.length }}</el-tag>
      </div>
      <el-table :data="list" v-loading="loading" stripe border @row-click="openDetail" row-key="sku">
        <el-table-column prop="sku" label="SKU" width="140" />
        <el-table-column prop="name" :label="$t('field.name')" min-width="220" show-overflow-tooltip />
        <el-table-column prop="warehouse" :label="$t('warehouse_m.name')" width="140" />
        <el-table-column prop="inDate" :label="$t('analytics.lastIn')" width="130" />
        <el-table-column :label="$t('analytics.retentionDays')" width="120" align="center">
          <template #default="{ row }">
            <span :style="{ color: daysColor(row.status), fontWeight: 600 }">{{ row.days }} {{ $t('analytics.retentionDays') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" :label="$t('analytics.qty')" width="120" align="right" />
        <el-table-column prop="lastOut" :label="$t('analytics.lastOut')" width="140" />
        <el-table-column :label="$t('field.status')" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small" effect="light">{{ translateStatus(row.status) }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="hint">{{ $t('analytics.retentionDetail') }}</div>
    </el-card>

    <!-- 详情抽屉 -->
    <el-drawer v-model="drawer" :title="$t('analytics.retentionDetail')" size="420px">
      <el-descriptions v-if="current" :column="1" border>
        <el-descriptions-item label="SKU">{{ current.sku }}</el-descriptions-item>
        <el-descriptions-item :label="$t('field.name')">{{ current.name }}</el-descriptions-item>
        <el-descriptions-item :label="$t('warehouse_m.name')">{{ current.warehouse }}</el-descriptions-item>
        <el-descriptions-item :label="$t('analytics.lastIn')">{{ current.inDate }}</el-descriptions-item>
        <el-descriptions-item :label="$t('analytics.retentionDays')">
          <span :style="{ color: daysColor(current.status), fontWeight: 600 }">{{ current.days }} {{ $t('analytics.retentionDays') }}</span>
        </el-descriptions-item>
        <el-descriptions-item :label="$t('analytics.qty')">{{ current.stock }}</el-descriptions-item>
        <el-descriptions-item :label="$t('analytics.lastOut')">{{ current.lastOut }}</el-descriptions-item>
        <el-descriptions-item :label="$t('field.status')">
          <el-tag :type="statusType(current.status)" size="small" effect="light">{{ translateStatus(current.status) }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { analyticsApi } from '@/api'

const { t, te } = useI18n()

const list = ref([])
const loading = ref(false)
const sort = ref('time')
const drawer = ref(false)
const current = ref(null)

const STATUS_MAP = {
  '正常': '',
  '滞留预警': 'analytics.retentionWarn',
  '长期滞留': 'analytics.retentionWarn'
}
function translateStatus(s) {
  const key = STATUS_MAP[s]
  return key && te(key) ? t(key) : s
}

const stats = computed(() => {
  const total = list.value.length
  const warn = list.value.filter((i) => i.status === '滞留预警').length
  const long = list.value.filter((i) => i.status === '长期滞留').length
  return [
    { label: 'analytics.qty', value: total, unit: '', icon: 'Files', color: '#1677ff' },
    { label: 'analytics.retentionWarn', value: warn, unit: '', icon: 'Warning', color: '#faad14' },
    { label: 'analytics.retentionWarn', value: long, unit: '', icon: 'AlarmClock', color: '#ff4d4f' }
  ]
})

function statusType(s) {
  return { 正常: 'success', 滞留预警: 'warning', 长期滞留: 'danger' }[s] || 'info'
}
function daysColor(s) {
  return { 正常: '#52c41a', 滞留预警: '#faad14', 长期滞留: '#ff4d4f' }[s] || '#303133'
}

function openDetail(row) {
  current.value = row
  drawer.value = true
}

async function load() {
  loading.value = true
  try {
    const res = await analyticsApi.retention({ sort: sort.value })
    if (res.code === 200) list.value = res.data
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
.sort-bar { display: flex; align-items: center; }
.sort-label { font-size: 14px; color: #606266; margin-right: 8px; }
.hint { margin-top: 12px; font-size: 12px; color: #909399; text-align: right; }
:deep(.el-table__row) { cursor: pointer; }
</style>
