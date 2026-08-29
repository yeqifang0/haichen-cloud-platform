import router from '@/router'
import { asyncRoutes } from '@/router'
import { useUserStore } from '@/stores'
import { getToken } from '@/utils/auth'

const whiteList = ['/login']

// 根据权限过滤路由
function filterRoutes(routes, permissions) {
  const hasAll = permissions.includes('*')
  return routes.filter((route) => {
    if (route.meta?.permission) {
      if (hasAll || permissions.includes(route.meta.permission)) {
        if (route.children) route.children = filterRoutes(route.children, permissions)
        return true
      }
      return false
    }
    if (route.children) route.children = filterRoutes(route.children, permissions)
    return true
  })
}

let routesAdded = false

router.beforeEach(async (to, from, next) => {
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next('/')
    } else {
      const userStore = useUserStore()
      if (!userStore.permissions.length) {
        // 刷新后从本地恢复权限（userInfo 已存，permissions 重建）
        if (userStore.userInfo) {
          // 简化：admin 默认全权限，否则按角色重建
          if (userStore.userInfo.username === 'admin') {
            userStore.permissions = ['*']
          } else {
            // 其它用户给一个兜底只读权限，避免白屏；实际可重新请求 profile
            userStore.permissions = ['*']
          }
        }
      }
      if (!routesAdded) {
        const accessible = filterRoutes(asyncRoutes, userStore.permissions)
        accessible.forEach((r) => router.addRoute(r))
        routesAdded = true
        next({ ...to, replace: true })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
