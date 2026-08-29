<template>
  <div class="app-wrapper">
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
</style>
