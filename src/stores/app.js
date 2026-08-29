import { defineStore } from 'pinia'
import { ref, onMounted, onBeforeUnmount } from 'vue'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(localStorage.getItem('haichen_sidebar') === '1')
  const tabs = ref([])
  const isMobile = ref(false)

  // 小屏自动折叠 sidebar（抽屉模式）
  function checkMobile() {
    const mobile = window.innerWidth <= 768
    isMobile.value = mobile
    if (mobile) sidebarCollapsed.value = true
  }

  // 在 app 初始化时挂 resize 监听
  if (typeof window !== 'undefined') {
    checkMobile()
    window.addEventListener('resize', checkMobile)
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
    if (!isMobile.value) {
      localStorage.setItem('haichen_sidebar', sidebarCollapsed.value ? '1' : '0')
    }
  }

  function addTab(route) {
    if (route.name === 'Login' || !route.name) return
    if (tabs.value.some((t) => t.path === route.path)) return
    tabs.value.push({
      title: route.meta?.title || route.name,
      path: route.path,
      name: route.name
    })
    if (tabs.value.length > 8) tabs.value.shift()
  }

  function removeTab(path) {
    const idx = tabs.value.findIndex((t) => t.path === path)
    if (idx > -1) tabs.value.splice(idx, 1)
    return tabs.value[idx] || tabs.value[idx - 1] || tabs.value[tabs.value.length - 1]
  }

  function clearTabs() {
    tabs.value = []
  }

  return { sidebarCollapsed, tabs, isMobile, toggleSidebar, addTab, removeTab, clearTabs }
})
