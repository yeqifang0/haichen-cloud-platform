<template>
  <div class="login-container">
    <div class="login-bg">
      <div class="bg-circle c1"></div>
      <div class="bg-circle c2"></div>
      <div class="bg-circle c3"></div>
    </div>
    <div class="login-box">
      <div class="login-left">
        <div class="brand">
          <div class="brand-logo">HC</div>
          <h1>海辰智汇云平台</h1>
        </div>
        <p class="brand-sub">上海海辰智储科技有限公司 · 统一管理后台</p>
        <div class="features">
          <div class="feature-item">
            <el-icon><Box /></el-icon>
            <span>仓储管理中心 · 全链路库存可视</span>
          </div>
          <div class="feature-item">
            <el-icon><Van /></el-icon>
            <span>物流信息中心 · 多源数据实时追踪</span>
          </div>
          <div class="feature-item">
            <el-icon><DataAnalysis /></el-icon>
            <span>大数据分析中心 · 智能预警与决策</span>
          </div>
          <div class="feature-item">
            <el-icon><Connection /></el-icon>
            <span>融合 HC002 · 打通仓储-物流全链路</span>
          </div>
        </div>
        <p class="copyright">© 2026 上海海辰智储科技有限公司 版权所有</p>
      </div>
      <div class="login-right">
        <h2>欢迎登录</h2>
        <p class="login-tip">请输入账号密码进入管理后台</p>
        <el-form ref="formRef" :model="form" :rules="rules" size="large" @keyup.enter="handleLogin">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="用户名" :prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" type="password" placeholder="密码" :prefix-icon="Lock" show-password />
          </el-form-item>
          <el-form-item prop="captcha">
            <div class="captcha-row">
              <el-input v-model="form.captcha" placeholder="验证码" :prefix-icon="Key" />
              <div class="captcha-code" @click="refreshCaptcha">{{ captcha }}</div>
            </div>
          </el-form-item>
          <div class="login-options">
            <el-checkbox v-model="form.remember">记住登录态</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
          <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin">登 录</el-button>
        </el-form>
        <div class="quick-accounts">
          <div class="qa-title">快速登录（演示账号）：</div>
          <div class="qa-list">
            <span v-for="a in accounts" :key="a.username" class="qa-item" @click="fillAccount(a)">
              {{ a.label }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Key } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref()
const loading = ref(false)
const captcha = ref('')

const accounts = [
  { label: '管理员', username: 'admin', password: 'Admin@123' },
  { label: '管理层', username: 'wangjingli', password: 'Manager@123' },
  { label: '仓管', username: 'liCang', password: 'Wh@123456' },
  { label: '物流调度', username: 'zhangDiao', password: 'Lg@123456' },
  { label: '财务', username: 'caiWu', password: 'Fin@12345' }
]

const form = reactive({ username: 'admin', password: 'Admin@123', captcha: '', remember: true })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

function refreshCaptcha() {
  captcha.value = Math.random().toString(36).slice(2, 6).toUpperCase()
}
onMounted(refreshCaptcha)

function fillAccount(a) {
  form.username = a.username
  form.password = a.password
  form.captcha = ''
  refreshCaptcha()
}

async function handleLogin() {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    if (form.captcha.toUpperCase() !== captcha.value) {
      ElMessage.error('验证码错误')
      refreshCaptcha()
      form.captcha = ''
      return
    }
    loading.value = true
    try {
      const res = await userStore.login({ username: form.username, password: form.password })
      if (res.code === 200) {
        ElMessage.success(res.msg)
        router.push('/')
      } else {
        ElMessage.error(res.msg)
        refreshCaptcha()
        form.captcha = ''
      }
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a1929 0%, #001529 50%, #002140 100%);
  position: relative;
  overflow: hidden;
}
.login-bg .bg-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
}
.c1 {
  width: 400px;
  height: 400px;
  background: #1677ff;
  top: -100px;
  left: -100px;
}
.c2 {
  width: 500px;
  height: 500px;
  background: #0052d9;
  bottom: -150px;
  right: -100px;
}
.c3 {
  width: 300px;
  height: 300px;
  background: #13c2c2;
  top: 40%;
  left: 50%;
}
.login-box {
  display: flex;
  width: 880px;
  height: 520px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  z-index: 1;
}
.login-left {
  flex: 1;
  background: linear-gradient(135deg, #1677ff 0%, #0052d9 100%);
  color: #fff;
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
}
.brand {
  display: flex;
  align-items: center;
  gap: 14px;
}
.brand-logo {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 900;
  letter-spacing: 1px;
  font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
  backdrop-filter: blur(10px);
}
.brand h1 {
  font-size: 24px;
  font-weight: 600;
}
.brand-sub {
  margin-top: 12px;
  font-size: 13px;
  opacity: 0.85;
}
.features {
  margin-top: 40px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  opacity: 0.95;
}
.feature-item .el-icon {
  font-size: 20px;
}
.copyright {
  font-size: 12px;
  opacity: 0.6;
}
.login-right {
  width: 400px;
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
}
.login-right h2 {
  font-size: 24px;
  color: #303133;
}
.login-tip {
  color: #909399;
  font-size: 13px;
  margin: 8px 0 28px;
}
.captcha-row {
  display: flex;
  gap: 10px;
  width: 100%;
}
.captcha-code {
  width: 90px;
  height: 40px;
  background: linear-gradient(135deg, #1677ff, #0052d9);
  color: #fff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 2px;
  cursor: pointer;
  user-select: none;
  font-style: italic;
}
.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 13px;
}
.login-btn {
  width: 100%;
  height: 42px;
  font-size: 16px;
  letter-spacing: 4px;
}
.quick-accounts {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px dashed #ebeef5;
}
.qa-title {
  font-size: 12px;
  color: #909399;
  margin-bottom: 10px;
}
.qa-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.qa-item {
  padding: 4px 10px;
  background: #f0f7ff;
  color: #1677ff;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}
.qa-item:hover {
  background: #1677ff;
  color: #fff;
}
</style>
