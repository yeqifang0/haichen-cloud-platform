<template>
  <div class="app-main">
    <router-view v-slot="{ Component, route }">
      <keep-alive>
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup></script>

<style scoped>
.app-main {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: #f0f2f5;
}
</style>
