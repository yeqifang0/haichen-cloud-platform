<template>
  <div class="sidebar-container" :class="{ collapsed: appStore.sidebarCollapsed }">
    <div class="logo">
      <div class="logo-icon">HC</div>
      <span v-show="!appStore.sidebarCollapsed" class="logo-text">{{ $t('app.name') }}</span>
    </div>
    <el-scrollbar class="menu-scroll">
      <el-menu
        :default-active="activeMenu"
        :collapse="appStore.sidebarCollapsed"
        :collapse-transition="false"
        background-color="#001529"
        text-color="rgba(255,255,255,0.75)"
        active-text-color="#fff"
        router
        unique-opened
      >
        <SidebarItem v-for="route in routes" :key="route.path" :item="route" :full-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore, useUserStore } from '@/stores'
import { asyncRoutes } from '@/router'
import SidebarItem from './SidebarItem.vue'

const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

const routes = computed(() => {
  if (userStore.permissions.includes('*')) return asyncRoutes
  return asyncRoutes.filter((r) => !r.meta?.permission || userStore.hasPermission(r.meta.permission))
})

const activeMenu = computed(() => route.path)
</script>

<style scoped>
.sidebar-container {
  width: 230px;
  height: 100%;
  background: var(--bg-sidebar);
  transition: width 0.28s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--border-subtle);
}
.sidebar-container.collapsed {
  width: 64px;
}
.logo {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 10px;
  background: var(--bg-header);
  border-bottom: 1px solid var(--border-subtle);
  flex-shrink: 0;
}
.logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--primary-gradient);
  color: #fff;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 0.5px;
  font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 12px rgba(22, 119, 255, 0.5);
}
.logo-text {
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}
.menu-scroll {
  flex: 1;
}
:deep(.el-menu) {
  border-right: none;
  background: var(--bg-sidebar) !important;
}
:deep(.el-menu-item) {
  color: var(--text-regular) !important;
}
:deep(.el-sub-menu__title) {
  color: var(--text-regular) !important;
}
:deep(.el-menu-item.is-active) {
  background: var(--primary-gradient) !important;
  color: #fff !important;
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.35);
}
:deep(.el-sub-menu__title:hover),
:deep(.el-menu-item:hover) {
  background-color: rgba(22, 119, 255, 0.12) !important;
  color: #4096ff !important;
}
:deep(.el-sub-menu .el-menu-item) {
  background: var(--bg-sidebar) !important;
}
:deep(.el-sub-menu .el-menu-item:hover) {
  background: rgba(22, 119, 255, 0.12) !important;
}
:deep(.el-sub-menu .el-menu-item.is-active) {
  background: var(--primary-gradient) !important;
}

/* ========== 小屏（<= 768px）：sidebar 始终保持完整宽度，由父级 transform 控制抽屉 ========== */
@media (max-width: 768px) {
  .sidebar-container,
  .sidebar-container.collapsed {
    width: 260px !important;
  }
}
</style>
