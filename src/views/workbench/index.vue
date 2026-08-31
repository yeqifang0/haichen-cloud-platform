<template>
  <div class="workbench page-container">
    <div class="wb-banner">
      <h2>{{ $t('bench.title') }}</h2>
      <p>{{ userStore.userInfo?.name }}（{{ userStore.roles?.[0] }}）· {{ now }}</p>
    </div>
    <el-row :gutter="16">
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover" class="wb-card">
          <template #header><div class="card-header"><span class="card-title">{{ $t('bench.todo') }}</span><el-tag>{{ todos.length }}</el-tag></div></template>
          <div class="todo-list">
            <div v-for="t in todos" :key="t.id" class="todo-item">
              <el-tag :type="t.urgent ? 'danger' : 'warning'" size="small" effect="plain">{{ t.urgent ? $t('alert.severe') : $t('alert.warn') }}</el-tag>
              <div class="todo-body">
                <div class="todo-title">{{ t.title }}</div>
                <div class="todo-meta">{{ t.module }} · {{ t.time }}</div>
              </div>
              <el-button text type="primary" size="small" @click="go(t.path)">{{ $t('btn.view') }}</el-button>
            </div>
            <el-empty v-if="!todos.length" :description="$t('bench.noTodo')" :image-size="60" />
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover" class="wb-card">
          <template #header><div class="card-header"><span class="card-title">{{ $t('bench.myAlert') }}</span><el-tag type="danger">{{ alerts.length }}</el-tag></div></template>
          <div class="alert-list">
            <div v-for="a in alerts" :key="a.id" class="alert-item">
              <el-tag :type="a.level === '严重' ? 'danger' : 'warning'" size="small">{{ translateAlertLevel(a.level) }}</el-tag>
              <div class="alert-body">
                <div class="alert-title">{{ a.title }}</div>
                <div class="alert-meta">{{ a.type }} · {{ a.createTime }}</div>
              </div>
              <el-button text type="primary" size="small" @click="go('/logistics/alerts')">{{ $t('btn.view') }}</el-button>
            </div>
            <el-empty v-if="!alerts.length" :description="$t('bench.noAlert')" :image-size="60" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="mt-16">
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover" class="wb-card">
          <template #header><span class="card-title">{{ $t('menu.smartQuery') }}</span></template>
          <div class="shortcut-grid">
            <div v-for="s in shortcuts" :key="s.path" class="shortcut-item" @click="go(s.path)">
              <div class="shortcut-icon" :style="{ background: s.color + '1a', color: s.color }">
                <el-icon :size="22"><component :is="s.icon" /></el-icon>
              </div>
              <span>{{ s.label }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover" class="wb-card">
          <template #header><span class="card-title">{{ $t('sys.logTitle') }}</span></template>
          <el-timeline>
            <el-timeline-item v-for="l in logs" :key="l.id" :timestamp="l.time" placement="top" :type="l.status === '失败' ? 'danger' : 'success'">
              <div class="log-action">{{ l.action }}</div>
              <div class="log-meta">{{ l.module }} · {{ l.ip }}</div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores'
import { logisticsApi, warehouseApi, systemApi } from '@/api'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const now = new Date().toLocaleString('zh-CN')
const todos = ref([])
const alerts = ref([])
const logs = ref([])

const shortcuts = computed(() => [
  { label: t('menu.warehouseMonitor'), path: '/warehouse/monitor', icon: 'Monitor', color: '#1677ff' },
  { label: t('btn.add') + t('menu.orderList'), path: '/warehouse/orders', icon: 'Document', color: '#52c41a' },
  { label: t('menu.tracking'), path: '/logistics/track', icon: 'Van', color: '#722ed1' },
  { label: t('alert.detail'), path: '/logistics/alerts', icon: 'Warning', color: '#ff4d4f' },
  { label: t('menu.smartQuery'), path: '/logistics/smart-query', icon: 'ChatDotRound', color: '#13c2c2' },
  { label: t('btn.assign'), path: '/dispatch/list', icon: 'Operation', color: '#faad14' },
  { label: t('menu.dashboard'), path: '/analytics/purchase', icon: 'DataAnalysis', color: '#eb2f96' },
  { label: t('sys.configTitle'), path: '/system/config', icon: 'Setting', color: '#595959' }
])

function translateAlertLevel(level) {
  if (level === '严重') return t('alert.severe')
  if (level === '警告') return t('alert.warn')
  return level
}

function go(path) {
  router.push(path)
}

async function load() {
  const [a, o, l] = await Promise.all([
    logisticsApi.alerts({ status: '待处理', pageSize: 5 }),
    warehouseApi.orders.list({ status: '待审核', pageSize: 5 }),
    systemApi.logs({ pageSize: 6 })
  ])
  if (a.code === 200) alerts.value = a.data.list
  if (o.code === 200) {
    todos.value = o.data.list.map((x) => ({ id: x.id, title: `审核单据：${x.orderNo}（${x.type}）`, module: '仓储管理', time: x.createTime, urgent: x.amount > 500000, path: '/warehouse/orders' }))
  }
  if (l.code === 200) logs.value = l.data.list
}

onMounted(load)
</script>

<style scoped>
.wb-banner {
  background: linear-gradient(135deg, #1677ff 0%, #0052d9 100%);
  color: #fff;
  border-radius: 12px;
  padding: 22px 28px;
  margin-bottom: 16px;
}
.wb-banner h2 {
  font-size: 20px;
  margin-bottom: 6px;
}
.wb-banner p {
  font-size: 13px;
  opacity: 0.9;
}
.wb-card {
  border-radius: 10px;
  height: 100%;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-title {
  font-weight: 600;
}
.todo-item, .alert-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
}
.todo-body, .alert-body {
  flex: 1;
  min-width: 0;
}
.todo-title, .alert-title {
  font-size: 14px;
  color: #303133;
}
.todo-meta, .alert-meta {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}
.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.shortcut-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 12px 0;
  border-radius: 8px;
  transition: background 0.2s;
  font-size: 13px;
  color: #606266;
}
.shortcut-item:hover {
  background: #f5f7fa;
  color: #1677ff;
}
.shortcut-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.log-action {
  font-size: 14px;
  color: #303133;
}
.log-meta {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}
</style>
