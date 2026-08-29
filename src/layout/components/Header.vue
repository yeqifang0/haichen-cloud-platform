<template>
  <div class="header">
    <div class="header-left">
      <el-icon class="collapse-btn" @click="appStore.toggleSidebar">
        <Fold v-if="!appStore.sidebarCollapsed" />
        <Expand v-else />
      </el-icon>
      <Breadcrumb />
    </div>
    <div class="header-right">
      <GlobalSearch />
      <NotificationBell />
      <el-tooltip content="刷新缓存数据" placement="bottom">
        <el-icon class="header-icon" @click="handleRefresh"><Refresh /></el-icon>
      </el-tooltip>
      <el-dropdown @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="32" class="avatar">{{ avatarText }}</el-avatar>
          <div class="user-meta">
            <div class="user-name">{{ userStore.userInfo?.name }}</div>
            <div class="user-role">{{ userStore.roles?.[0] || '用户' }}</div>
          </div>
          <el-icon><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item command="password">修改密码</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <el-dialog v-model="pwdVisible" title="修改密码" width="420px">
      <el-form :model="pwdForm" label-width="90px">
        <el-form-item label="原密码">
          <el-input v-model="pwdForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="pwdForm.newPassword" type="password" show-password placeholder="8-20位含大小写+数字" />
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="pwdForm.confirm" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pwdVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPwd">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAppStore, useUserStore } from '@/stores'
import { authApi } from '@/api'
import { resetDB } from '@/mock'
import Breadcrumb from './Breadcrumb.vue'
import NotificationBell from './NotificationBell.vue'
import GlobalSearch from './GlobalSearch.vue'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const avatarText = computed(() => userStore.userInfo?.name?.charAt(0) || 'U')

const pwdVisible = ref(false)
const pwdForm = ref({ oldPassword: '', newPassword: '', confirm: '' })

async function handleCommand(cmd) {
  if (cmd === 'profile') {
    router.push('/profile')
  } else if (cmd === 'password') {
    pwdVisible.value = true
  } else if (cmd === 'logout') {
    try {
      await ElMessageBox.confirm('确定要退出登录吗？', '提示', { type: 'warning' })
      userStore.logout()
      router.push('/login')
    } catch (e) {
      /* cancelled */
    }
  }
}

async function submitPwd() {
  if (pwdForm.value.newPassword !== pwdForm.value.confirm) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  const res = await authApi.changePassword(pwdForm.value)
  if (res.code === 200) {
    ElMessage.success(res.msg)
    pwdVisible.value = false
    pwdForm.value = { oldPassword: '', newPassword: '', confirm: '' }
  }
}

async function handleRefresh() {
  try {
    await ElMessageBox.confirm('将清空本地模拟数据并恢复初始数据，确认继续？', '刷新缓存', { type: 'warning' })
    resetDB()
    ElMessage.success('数据已重置，即将刷新页面')
    setTimeout(() => location.reload(), 800)
  } catch (e) {
    /* cancelled */
  }
}
</script>

<style scoped>
.header {
  height: 56px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 10;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 18px;
}
.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #595959;
}
.header-icon {
  font-size: 18px;
  cursor: pointer;
  color: #595959;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  flex-shrink: 0;
}
.avatar {
  background: var(--primary-gradient);
  color: #fff;
  font-weight: 600;
  flex-shrink: 0;
}
.user-meta {
  line-height: 1.2;
  /* 防止文字被挤压竖排：flex-shrink + 允许截断 */
  flex-shrink: 0;
  min-width: 0;
}
.user-name {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
  white-space: nowrap;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-role {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ========== 小屏（<= 768px）：隐藏用户文字，只留头像 ========== */
@media (max-width: 768px) {
  .header {
    padding: 0 12px;
  }
  .header-right {
    gap: 10px;
  }
  .user-meta {
    display: none;
  }
}
</style>
