<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, idx) in levels" :key="idx">{{ item }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const levels = computed(() => {
  const list = []
  route.matched.forEach((m) => {
    if (m.meta?.title && !m.meta?.hidden) list.push(m.meta.title)
  })
  return list
})
</script>
