import { useUserStore } from '@/stores'

/**
 * 权限指令 v-permission="'warehouse:goods:add'"
 * 用法：<el-button v-permission="'warehouse:goods:add'">新增</el-button>
 * 也支持数组 v-permission="['a','b']" (任一满足即可)
 */
function check(value) {
  const userStore = useUserStore()
  if (!value) return true
  const list = Array.isArray(value) ? value : [value]
  return list.some((v) => userStore.hasPermission(v))
}

export default {
  mounted(el, binding) {
    if (!check(binding.value)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
