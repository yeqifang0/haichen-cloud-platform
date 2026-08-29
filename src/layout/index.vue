<template>
  <div class="app-wrapper" :class="{ 'mobile-mode': appStore.isMobile }">
    <!-- 小屏遮罩层：sidebar 展开时显示 -->
    <div
      v-if="appStore.isMobile && !appStore.sidebarCollapsed"
      class="sidebar-overlay"
      @click="appStore.toggleSidebar"
    ></div>
    <Sidebar class="sidebar" />
    <div class="main-container" :class="{ collapsed: appStore.sidebarCollapsed }">
      <div class="header-wrapper">
        <Header />
        <TabsView />
      </div>
      <AppMain />
    </div>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import TabsView from './components/TabsView.vue'
import AppMain from './components/AppMain.vue'
import { useAppStore } from '@/stores'

const appStore = useAppStore()
</script>

<style scoped>
.app-wrapper {
  display: flex;
  height: 100%;
  width: 100%;
}
.sidebar {
  height: 100%;
}
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  overflow: hidden;
}
.header-wrapper {
  flex-shrink: 0;
}

/* ========== 小屏（<= 768px）：sidebar 抽屉化，main 占满 ========== */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 999;
  animation: fadeIn 0.2s ease;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 小屏模式下，sidebar 用 fixed 定位做抽屉 */
.app-wrapper.mobile-mode .sidebar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  transition: transform 0.28s ease;
}
.app-wrapper.mobile-mode .sidebar.collapsed {
  transform: translateX(-100%);
}
.app-wrapper.mobile-mode .sidebar:not(.collapsed) {
  transform: translateX(0);
}

/* 小屏模式下，main-container 占满 100% 宽度 */
.app-wrapper.mobile-mode .main-container {
  width: 100%;
  flex: 1 1 100%;
  margin-left: 0;
}
</style>
