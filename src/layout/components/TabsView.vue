<template>
  <div class="tabs-view">
    <el-scrollbar>
      <div class="tabs-inner">
        <div
          v-for="tab in appStore.tabs"
          :key="tab.path"
          class="tab-item"
          :class="{ active: isActive(tab) }"
          @click="clickTab(tab)"
        >
          <span>{{ t(tab.title) }}</span>
          <el-icon v-if="!tab.affix" class="close-icon" @click.stop="closeTab(tab)"><Close /></el-icon>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/stores'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

watch(
  () => route.fullPath,
  () => {
    if (route.meta?.title) appStore.addTab(route)
  },
  { immediate: true }
)

function isActive(tab) {
  return tab.path === route.path
}
function clickTab(tab) {
  router.push(tab.path)
}
function closeTab(tab) {
  const wasActive = isActive(tab)
  const next = appStore.removeTab(tab.path)
  if (wasActive && next) router.push(next.path)
}
</script>

<style scoped>
.tabs-view {
  background: var(--bg-header);
  border-top: 1px solid var(--border-subtle);
  height: 38px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}
.tabs-inner {
  display: flex;
  gap: 6px;
  align-items: center;
  white-space: nowrap;
}
.tab-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border: 1px solid var(--border-card);
  border-radius: 4px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  background: var(--bg-card);
  transition: all 0.2s;
}
.tab-item:hover {
  color: #4096ff;
  border-color: rgba(22, 119, 255, 0.5);
}
.tab-item.active {
  background: var(--primary-gradient);
  color: #fff;
  border-color: var(--primary-color);
  box-shadow: 0 2px 6px rgba(22, 119, 255, 0.35);
}
.close-icon {
  font-size: 12px;
  border-radius: 50%;
}
.close-icon:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
