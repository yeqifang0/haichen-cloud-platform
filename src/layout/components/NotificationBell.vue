<template>
  <el-badge :value="unread.length" :hidden="unread.length === 0" :max="99">
    <el-popover placement="bottom-end" :width="380" trigger="click">
      <template #reference>
        <el-icon class="header-icon"><Bell /></el-icon>
      </template>
      <div class="notif-panel">
        <div class="notif-header">
          <span>消息通知</span>
          <el-button text type="primary" size="small" @click="readAll">全部已读</el-button>
        </div>
        <div class="notif-list">
          <div
            v-for="n in list"
            :key="n.id"
            class="notif-item"
            :class="{ unread: !n.read }"
            @click="markRead(n)"
          >
            <el-tag :type="tagType(n.type)" size="small" effect="plain">{{ typeText(n.type) }}</el-tag>
            <div class="notif-body">
              <div class="notif-title">{{ n.title }}</div>
              <div class="notif-content">{{ n.content }}</div>
              <div class="notif-time">{{ n.time }}</div>
            </div>
          </div>
          <el-empty v-if="!list.length" description="暂无消息" :image-size="60" />
        </div>
      </div>
    </el-popover>
  </el-badge>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { systemApi } from '@/api'

const list = ref([])
const unread = computed(() => list.value.filter((n) => !n.read))

async function load() {
  const res = await systemApi.notifications()
  if (res.code === 200) list.value = res.data
}

async function markRead(n) {
  if (n.read) return
  await systemApi.readNotification(n.id)
  n.read = true
}

async function readAll() {
  for (const n of list.value) {
    if (!n.read) await markRead(n)
  }
}

function tagType(t) {
  return { alert: 'danger', audit: 'warning', dispatch: 'primary', system: 'info' }[t] || 'info'
}
function typeText(t) {
  return { alert: '预警', audit: '审核', dispatch: '调度', system: '系统' }[t] || '通知'
}

onMounted(load)
</script>

<style scoped>
.header-icon {
  font-size: 18px;
  cursor: pointer;
  color: #595959;
}
.notif-panel {
  margin: -8px -4px;
}
.notif-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 600;
}
.notif-list {
  max-height: 360px;
  overflow-y: auto;
}
.notif-item {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
}
.notif-item:hover {
  background: #fafafa;
}
.notif-item.unread {
  background: #f0f7ff;
}
.notif-body {
  flex: 1;
  min-width: 0;
}
.notif-title {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
}
.notif-content {
  font-size: 12px;
  color: #909399;
  margin: 2px 0;
}
.notif-time {
  font-size: 11px;
  color: #c0c4cc;
}
</style>
