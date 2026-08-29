<template>
  <div class="not-found">
    <div class="nf-content">
      <div class="nf-code">404</div>
      <p class="nf-text">抱歉，您访问的页面不存在</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function goHome() {
  router.push('/')
}
</script>

<style scoped>
.not-found {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
}
.nf-content {
  text-align: center;
}
.nf-code {
  font-size: 120px;
  font-weight: bold;
  background: linear-gradient(135deg, #1677ff, #0052d9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}
.nf-text {
  color: #909399;
  margin: 16px 0 24px;
  font-size: 16px;
}
</style>
