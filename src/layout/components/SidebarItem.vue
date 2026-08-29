<template>
  <template v-if="!item.meta?.hidden">
    <!-- 叶子节点 或 仅一个可见子项（折叠提升为菜单项） -->
    <el-menu-item v-if="!showAsSubmenu" :index="onlyChild ? resolveChild(onlyChild) : fullPath">
      <el-icon v-if="displayIcon"><component :is="displayIcon" /></el-icon>
      <template #title>{{ displayTitle }}</template>
    </el-menu-item>

    <!-- 多级菜单 -->
    <el-sub-menu v-else :index="fullPath">
      <template #title>
        <el-icon v-if="item.meta?.icon"><component :is="item.meta.icon" /></el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <SidebarItem
        v-for="child in visibleChildren"
        :key="child.path"
        :item="child"
        :full-path="resolveChild(child)"
      />
    </el-sub-menu>
  </template>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
  fullPath: { type: String, required: true }
})

const visibleChildren = computed(() => (props.item.children || []).filter((c) => !c.meta?.hidden))
const onlyChild = computed(() => (visibleChildren.value.length === 1 ? visibleChildren.value[0] : null))
const showAsSubmenu = computed(() => visibleChildren.value.length > 1)
const displayIcon = computed(() => onlyChild.value?.meta?.icon || props.item.meta?.icon)
const displayTitle = computed(() => onlyChild.value?.meta?.title || props.item.meta?.title)

function resolveChild(child) {
  if (child.path.startsWith('/')) return child.path
  return props.fullPath.replace(/\/$/, '') + '/' + child.path
}
</script>
