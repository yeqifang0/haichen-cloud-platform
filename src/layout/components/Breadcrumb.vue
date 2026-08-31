<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, idx) in levels" :key="idx">{{ t(item) }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const levels = computed(() => {
  const list = []
  route.matched.forEach((m) => {
    if (m.meta?.title && !m.meta?.hidden) list.push(m.meta.title)
  })
  return list
})
</script>
