<template>
  <div class="page-container">
    <el-card shadow="hover" class="mb-16">
      <template #header><span>{{ $t('alert.titleField') }}</span></template>
      <el-form :model="form" label-width="160px" v-loading="loading">
        <el-form-item :label="$t('sys.warnStock')">
          <el-input-number v-model="form.warnStock" :min="0" :max="10000" />
          <span class="unit">{{ $t('dashboard.unitItem') }}</span>
        </el-form-item>
        <el-form-item :label="$t('sys.warnExcess')">
          <el-input-number v-model="form.warnExcess" :min="0" :max="100" />
          <span class="unit">%</span>
        </el-form-item>
        <el-form-item :label="$t('analytics.retentionWarn')">
          <el-input-number v-model="form.warnTimeout" :min="1" :max="365" />
          <span class="unit">天</span>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="hover" class="mb-16">
      <template #header><span>{{ $t('sys.configTitle') }}</span></template>
      <el-form :model="form" label-width="160px" v-loading="loading">
        <el-form-item :label="$t('sys.loginLockCount')">
          <el-input-number v-model="form.loginLockCount" :min="1" :max="10" />
          <span class="unit">次</span>
        </el-form-item>
        <el-form-item :label="$t('sys.loginLockMinutes').replace(/\(.*\)/, '')">
          <el-input-number v-model="form.loginLockMinutes" :min="1" :max="1440" />
          <span class="unit">分钟</span>
        </el-form-item>
        <el-form-item :label="$t('sys.sessionTimeout').replace(/\(.*\)/, '')">
          <el-input-number v-model="form.sessionTimeout" :min="1" :max="720" />
          <span class="unit">分钟</span>
        </el-form-item>
        <el-form-item :label="$t('sys.dataRetention')">
          <el-input-number v-model="form.dataRetention" :min="1" :max="3650" />
          <span class="unit">天</span>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="footer-bar">
      <el-button type="primary" :icon="Check" :loading="saving" @click="save">{{ $t('btn.save') }}{{ $t('sys.configTitle') }}</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { systemApi } from '@/api'

const { t } = useI18n()

const loading = ref(false)
const saving = ref(false)
const form = reactive({ warnStock: 0, warnExcess: 0, warnTimeout: 0, loginLockCount: 0, loginLockMinutes: 0, sessionTimeout: 0, dataRetention: 0 })

async function load() {
  loading.value = true
  try {
    const res = await systemApi.config()
    if (res.code === 200) Object.assign(form, res.data)
  } finally { loading.value = false }
}
async function save() {
  saving.value = true
  try {
    const res = await systemApi.updateConfig({ ...form })
    if (res.code === 200) ElMessage.success(res.msg)
    else ElMessage.error(res.msg)
  } finally { saving.value = false }
}

load()
</script>

<style scoped>
.unit { margin-left: 8px; color: #909399; }
.footer-bar { text-align: center; }
</style>
