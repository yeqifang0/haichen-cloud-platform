import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api'
import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '@/utils/auth'

export const useUserStore = defineStore('user', () => {
  const token = ref(getToken() || '')
  const userInfo = ref(getUser())
  const roles = ref([])
  const permissions = ref([])

  const isLogin = computed(() => !!token.value)
  const isAdmin = computed(() => permissions.value.includes('*'))

  async function login(payload) {
    const res = await authApi.login(payload)
    if (res.code === 200) {
      token.value = res.data.token
      userInfo.value = res.data.userInfo
      roles.value = res.data.roles
      permissions.value = res.data.permissions
      setToken(res.data.token)
      setUser(res.data.userInfo)
    }
    return res
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    roles.value = []
    permissions.value = []
    removeToken()
    removeUser()
  }

  function hasPermission(perm) {
    if (permissions.value.includes('*')) return true
    return permissions.value.includes(perm)
  }

  function hasAnyPermission(perms) {
    if (permissions.value.includes('*')) return true
    return perms.some((p) => permissions.value.includes(p))
  }

  return {
    token,
    userInfo,
    roles,
    permissions,
    isLogin,
    isAdmin,
    login,
    logout,
    hasPermission,
    hasAnyPermission
  }
})
