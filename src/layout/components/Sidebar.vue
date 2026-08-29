<template>
  <div class="sidebar-container" :class="{ collapsed: appStore.sidebarCollapsed }">
    <div class="logo">
      <div class="logo-icon">HC</div>
      <span v-show="!appStore.sidebarCollapsed" class="logo-text">海辰智汇云平台</span>
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
  background: #001529;
  transition: width 0.28s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
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
  background: linear-gradient(135deg, #002140, #001529);
  flex-shrink: 0;
}
.logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, #1677ff, #0052d9);
  color: #fff;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 0.5px;
  font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.logo-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}
.menu-scroll {
  flex: 1;
}
:deep(.el-menu) {
  border-right: none;
}
:deep(.el-menu-item.is-active) {
  background: #1677ff !important;
}
:deep(.el-sub-menu__title:hover),
:deep(.el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.08) !important;
}
</style>
