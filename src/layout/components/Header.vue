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
      <!-- 语言切换按钮 -->
      <div class="lang-switch" @click="handleToggleLang">
        <el-icon><Switch /></el-icon>
        <span>{{ currentLangLabel }}</span>
      </div>
      <GlobalSearch />
      <NotificationBell />
      <el-tooltip :content="$t('header.refreshCache')" placement="bottom">
        <el-icon class="header-icon" @click="handleRefresh"><Refresh /></el-icon>
      </el-tooltip>
      <el-dropdown @command="handleCommand">
        <div class="user-info">
          <el-avatar :size="32" class="avatar">{{ avatarText }}</el-avatar>
          <div class="user-meta">
            <div class="user-name">{{ userStore.userInfo?.name }}</div>
            <div class="user-role">{{ userStore.roles?.[0] || $t('header.user') }}</div>
          </div>
          <el-icon><CaretBottom /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">{{ $t('header.profile') }}</el-dropdown-item>
            <el-dropdown-item command="password">{{ $t('header.changePassword') }}</el-dropdown-item>
            <el-dropdown-item divided command="logout">{{ $t('header.logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <el-dialog v-model="pwdVisible" :title="$t('header.changePassword')" width="420px">
      <el-form :model="pwdForm" label-width="90px">
        <el-form-item :label="$t('header.oldPassword')">
          <el-input v-model="pwdForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item :label="$t('header.newPassword')">
          <el-input v-model="pwdForm.newPassword" type="password" show-password :placeholder="$t('header.pwdPlaceholder')" />
        </el-form-item>
        <el-form-item :label="$t('header.confirmPassword')">
          <el-input v-model="pwdForm.confirm" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pwdVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="submitPwd">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAppStore, useUserStore } from '@/stores'
import { authApi } from '@/api'
import { resetDB } from '@/mock'
import { toggleLocale, getLocale } from '@/i18n'
import Breadcrumb from './Breadcrumb.vue'
import NotificationBell from './NotificationBell.vue'
import GlobalSearch from './GlobalSearch.vue'

const { t } = useI18n()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const avatarText = computed(() => userStore.userInfo?.name?.charAt(0) || 'U')

// 当前语言显示的切换标签：中文环境显示 "English"，英文环境显示 "中文"
const currentLangLabel = computed(() => {
  const lang = getLocale()
  return lang === 'zh-CN' ? 'English' : '中文'
})

function handleToggleLang() {
  toggleLocale()
}

const pwdVisible = ref(false)
const pwdForm = ref({ oldPassword: '', newPassword: '', confirm: '' })

async function handleCommand(cmd) {
  if (cmd === 'profile') {
    router.push('/profile')
  } else if (cmd === 'password') {
    pwdVisible.value = true
  } else if (cmd === 'logout') {
    try {
      await ElMessageBox.confirm(t('header.confirmLogout'), t('header.tip'), { type: 'warning' })
      userStore.logout()
      router.push('/login')
    } catch (e) {
      /* cancelled */
    }
  }
}

async function submitPwd() {
  if (pwdForm.value.newPassword !== pwdForm.value.confirm) {
    ElMessage.error(t('header.pwdMismatch'))
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
    await ElMessageBox.confirm(t('header.confirmRefresh'), t('header.cacheTitle'), { type: 'warning' })
    resetDB()
    ElMessage.success(t('header.cacheReset'))
    setTimeout(() => location.reload(), 800)
  } catch (e) {
    /* cancelled */
  }
}
</script>

<style scoped>
.header {
  height: 56px;
  background: var(--bg-header);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  border-bottom: 1px solid var(--border-subtle);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
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
  color: var(--text-secondary);
  transition: color 0.2s;
}
.collapse-btn:hover {
  color: #4096ff;
}
.header-icon {
  font-size: 18px;
  cursor: pointer;
  color: var(--text-secondary);
  transition: color 0.2s;
}
.header-icon:hover {
  color: #4096ff;
}

/* ===== 语言切换按钮 ===== */
.lang-switch {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  background: rgba(22, 119, 255, 0.08);
  border: 1px solid rgba(22, 119, 255, 0.25);
  transition: all 0.2s;
  white-space: nowrap;
  user-select: none;
}
.lang-switch:hover {
  color: #4096ff;
  background: rgba(22, 119, 255, 0.18);
  border-color: rgba(22, 119, 255, 0.5);
}
.lang-switch .el-icon {
  font-size: 14px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  flex-shrink: 0;
  padding: 4px 8px 4px 4px;
  border-radius: 20px;
  transition: background 0.2s;
}
.user-info:hover {
  background: rgba(22, 119, 255, 0.1);
}
.avatar {
  background: var(--primary-gradient);
  color: #fff;
  font-weight: 600;
  flex-shrink: 0;
  box-shadow: 0 0 8px rgba(22, 119, 255, 0.4);
}
.user-meta {
  line-height: 1.2;
  flex-shrink: 0;
  min-width: 0;
}
.user-name {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
  white-space: nowrap;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-role {
  font-size: 12px;
  color: var(--text-secondary);
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
  .lang-switch {
    padding: 4px 8px;
    font-size: 12px;
  }
}
</style>
