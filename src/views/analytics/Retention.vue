<template>
  <div class="page-container">
    <!-- 页头 -->
    <el-card shadow="hover" class="mb-16">
      <div class="page-title">
        <el-icon><Box /></el-icon>
        <span>滞留时长分析</span>
        <el-tag size="small" type="warning" effect="plain" style="margin-left: 8px">滞留超180天触发预警，超360天标记长期滞留</el-tag>
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
            <div class="stat-label">{{ s.label }}</div>
            <div class="stat-value">{{ s.value }}<small>{{ s.unit }}</small></div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 滞留列表 -->
    <el-card shadow="hover" class="mt-16">
      <div class="toolbar">
        <div class="sort-bar">
          <span class="sort-label">排序方式：</span>
          <el-radio-group v-model="sort" @change="load">
            <el-radio-button value="time">按滞留天数</el-radio-button>
            <el-radio-button value="stock">按库存数量</el-radio-button>
          </el-radio-group>
        </div>
        <el-tag type="info" size="small" effect="plain">共 {{ list.length }} 个品种</el-tag>
      </div>
      <el-table :data="list" v-loading="loading" stripe border @row-click="openDetail" row-key="sku">
        <el-table-column prop="sku" label="SKU" width="140" />
        <el-table-column prop="name" label="货品名称" min-width="220" show-overflow-tooltip />
        <el-table-column prop="warehouse" label="仓库" width="140" />
        <el-table-column prop="inDate" label="入库日期" width="130" />
        <el-table-column label="滞留天数" width="120" align="center">
          <template #default="{ row }">
            <span :style="{ color: daysColor(row.status), fontWeight: 600 }">{{ row.days }} 天</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存数量" width="120" align="right" />
        <el-table-column prop="lastOut" label="最后出库日期" width="140" />
        <el-table-column label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" size="small" effect="light">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="hint">点击任意行可查看滞留详情</div>
    </el-card>

    <!-- 详情抽屉 -->
    <el-drawer v-model="drawer" title="滞留详情" size="420px">
      <el-descriptions v-if="current" :column="1" border>
        <el-descriptions-item label="SKU">{{ current.sku }}</el-descriptions-item>
        <el-descriptions-item label="货品名称">{{ current.name }}</el-descriptions-item>
        <el-descriptions-item label="仓库">{{ current.warehouse }}</el-descriptions-item>
        <el-descriptions-item label="入库日期">{{ current.inDate }}</el-descriptions-item>
        <el-descriptions-item label="滞留天数">
          <span :style="{ color: daysColor(current.status), fontWeight: 600 }">{{ current.days }} 天</span>
        </el-descriptions-item>
        <el-descriptions-item label="库存数量">{{ current.stock }} 件</el-descriptions-item>
        <el-descriptions-item label="最后出库日期">{{ current.lastOut }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="statusType(current.status)" size="small" effect="light">{{ current.status }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { analyticsApi } from '@/api'

const list = ref([])
const loading = ref(false)
const sort = ref('time')
const drawer = ref(false)
const current = ref(null)

const stats = computed(() => {
  const total = list.value.length
  const warn = list.value.filter((i) => i.status === '滞留预警').length
  const long = list.value.filter((i) => i.status === '长期滞留').length
  return [
    { label: '总品种数', value: total, unit: '个', icon: 'Files', color: '#1677ff' },
    { label: '滞留预警', value: warn, unit: '个', icon: 'Warning', color: '#faad14' },
    { label: '长期滞留', value: long, unit: '个', icon: 'AlarmClock', color: '#ff4d4f' }
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
