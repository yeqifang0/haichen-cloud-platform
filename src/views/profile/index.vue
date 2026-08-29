<template>
  <div class="page-container">
    <el-card shadow="hover" class="profile-card">
      <el-row :gutter="24">
        <el-col :xs="24" :md="8">
          <div class="profile-side">
            <el-avatar :size="80" class="avatar">{{ userStore.userInfo?.name?.charAt(0) }}</el-avatar>
            <h3>{{ userStore.userInfo?.name }}</h3>
            <p>{{ userStore.roles?.[0] }}</p>
            <el-tag effect="plain">{{ userStore.userInfo?.dept }}</el-tag>
          </div>
        </el-col>
        <el-col :xs="24" :md="16">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本信息" name="info">
              <el-form :model="form" label-width="100px" disabled>
                <el-form-item label="用户名"><el-input v-model="form.username" /></el-form-item>
                <el-form-item label="姓名"><el-input v-model="form.name" /></el-form-item>
                <el-form-item label="部门"><el-input v-model="form.dept" /></el-form-item>
                <el-form-item label="手机"><el-input v-model="form.phone" /></el-form-item>
                <el-form-item label="邮箱"><el-input v-model="form.email" /></el-form-item>
                <el-form-item label="注册时间"><el-input v-model="form.createTime" /></el-form-item>
                <el-form-item label="最近登录"><el-input v-model="form.lastLogin" /></el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="pwd">
              <el-form :model="pwd" label-width="100px" style="max-width: 460px">
                <el-form-item label="原密码"><el-input v-model="pwd.oldPassword" type="password" show-password /></el-form-item>
                <el-form-item label="新密码"><el-input v-model="pwd.newPassword" type="password" show-password placeholder="8-20位含大小写+数字" /></el-form-item>
                <el-form-item label="确认密码"><el-input v-model="pwd.confirm" type="password" show-password /></el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submit">确认修改</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="消息通知设置" name="notify">
              <el-form label-width="160px">
                <el-form-item label="物流异常预警"><el-switch v-model="notify.alert" /></el-form-item>
                <el-form-item label="单据审核提醒"><el-switch v-model="notify.audit" /></el-form-item>
                <el-form-item label="调度指派通知"><el-switch v-model="notify.dispatch" /></el-form-item>
                <el-form-item label="系统公告"><el-switch v-model="notify.system" /></el-form-item>
                <el-form-item><el-button type="primary" @click="saveNotify">保存设置</el-button></el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'
import { authApi } from '@/api'

const userStore = useUserStore()
const activeTab = ref('info')
const form = reactive({ ...userStore.userInfo })
const pwd = reactive({ oldPassword: '', newPassword: '', confirm: '' })
const notify = reactive({ alert: true, audit: true, dispatch: true, system: false })

async function submit() {
  if (pwd.newPassword !== pwd.confirm) {
    ElMessage.error('两次输入的密码不一致')
    return
  }
  const res = await authApi.changePassword(pwd)
  if (res.code === 200) {
    ElMessage.success(res.msg)
    pwd.oldPassword = pwd.newPassword = pwd.confirm = ''
  }
}
function saveNotify() {
  ElMessage.success('通知设置已保存')
}
</script>

<style scoped>
.profile-card {
  border-radius: 10px;
  max-width: 900px;
  margin: 0 auto;
}
.profile-side {
  text-align: center;
  padding: 20px 0;
}
.avatar {
  background: var(--primary-gradient);
  color: #fff;
  font-size: 32px;
  font-weight: 600;
}
.profile-side h3 {
  margin-top: 14px;
  font-size: 18px;
}
.profile-side p {
  color: #909399;
  margin: 4px 0 12px;
}
</style>
