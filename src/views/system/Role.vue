<template>
  <div class="page-container">
    <el-row :gutter="16">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <div class="toolbar">
              <span>{{ $t('sys.roleTitle') }}</span>
              <el-button v-permission="'system:user:edit'" type="primary" size="small" :icon="Plus" @click="openDialog()">{{ $t('btn.add') }}{{ $t('sys.roleTitle') }}</el-button>
            </div>
          </template>
          <div v-loading="loading">
            <div v-for="r in list" :key="r.id" :class="['role-item', { active: currentRole && currentRole.id === r.id }]" @click="selectRole(r)">
              <div class="role-head">
                <span class="role-name">{{ r.name }}</span>
                <el-tag :type="r.status ? 'success' : 'info'" size="small">{{ r.status ? $t('sys.enabled') : $t('sys.disabled') }}</el-tag>
              </div>
              <div class="role-desc">{{ r.desc || '—' }}</div>
              <div class="role-actions">
                <el-button v-permission="'system:user:edit'" link type="primary" size="small" @click.stop="openDialog(r)">{{ $t('btn.edit') }}</el-button>
                <el-button v-permission="'system:user:edit'" link type="danger" size="small" @click.stop="remove(r)">{{ $t('btn.delete') }}</el-button>
              </div>
            </div>
            <el-empty v-if="!list.length" :description="$t('common.noData')" :image-size="60" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="toolbar">
              <span>{{ $t('sys.roleTitle') }}{{ currentRole ? ' · ' + currentRole.name : '' }}</span>
              <el-button v-if="currentRole" v-permission="'system:user:edit'" type="primary" size="small" :icon="Check" @click="savePerms">{{ $t('btn.save') }}</el-button>
            </div>
          </template>
          <el-empty v-if="!currentRole" :description="$t('common.noData')" :image-size="80" />
          <template v-else>
            <el-alert v-if="allPermMode" :title="$t('sys.roleTitle') + ' *'" type="success" :closable="false" show-icon style="margin-bottom: 16px" />
            <el-tree ref="permTreeRef" :data="permData" show-checkbox node-key="code" check-strictly default-expand-all :props="{ label: 'label' }" />
          </template>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="dialogVisible" :title="form.id ? $t('btn.edit') + $t('sys.roleTitle') : $t('btn.add') + $t('sys.roleTitle')" width="480px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item :label="$t('field.code')" prop="code"><el-input v-model="form.code" /></el-form-item>
        <el-form-item :label="$t('field.name')" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item :label="$t('field.description')"><el-input v-model="form.desc" type="textarea" :rows="2" /></el-form-item>
        <el-form-item :label="$t('sys.status')"><el-switch v-model="form.status" :active-value="1" :inactive-value="0" :active-text="$t('sys.enabled')" :inactive-text="$t('sys.disabled')" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">{{ $t('btn.cancel') }}</el-button><el-button type="primary" @click="submit">{{ $t('btn.save') }}</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { Plus, Check } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { systemApi } from '@/api'

const { t } = useI18n()

const list = ref([])
const loading = ref(false)
const currentRole = ref(null)
const permData = ref([])
const allPermMode = ref(false)
const permTreeRef = ref()

const dialogVisible = ref(false)
const formRef = ref()
const form = reactive({})
const rules = {
  code: [{ required: true, message: t('login.rulesUsername').replace(t('sys.username'), t('field.code')), trigger: 'blur' }],
  name: [{ required: true, message: t('login.rulesUsername').replace(t('sys.username'), t('field.name')), trigger: 'blur' }]
}

async function loadPermissions() {
  const res = await systemApi.permissions()
  if (res.code === 200) permData.value = res.data.map((p) => ({ code: p.code, label: `${p.name}（${p.code}）` }))
}
async function loadRoles() {
  loading.value = true
  try {
    const res = await systemApi.roles.all()
    if (res.code === 200) {
      list.value = res.data
      if (list.value.length && !currentRole.value) await selectRole(list.value[0])
    }
  } finally { loading.value = false }
}
async function selectRole(role) {
  currentRole.value = role
  allPermMode.value = false
  const res = await systemApi.rolePermissions(role.id)
  const perms = res.code === 200 ? res.data : []
  await nextTick()
  if (!permTreeRef.value) return
  if (perms === '*') {
    allPermMode.value = true
    permTreeRef.value.setCheckedKeys(permData.value.map((p) => p.code))
  } else {
    permTreeRef.value.setCheckedKeys(Array.isArray(perms) ? perms : [])
  }
}
async function savePerms() {
  if (!currentRole.value || !permTreeRef.value) return
  const keys = permTreeRef.value.getCheckedKeys()
  const res = await systemApi.updateRolePermissions({ roleId: currentRole.value.id, perms: keys })
  if (res.code === 200) ElMessage.success(res.msg)
  else ElMessage.error(res.msg)
}
function openDialog(row) {
  Object.keys(form).forEach((k) => delete form[k])
  if (row) Object.assign(form, JSON.parse(JSON.stringify(row)))
  else Object.assign(form, { code: '', name: '', desc: '', status: 1 })
  dialogVisible.value = true
}
async function submit() {
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    const res = form.id ? await systemApi.roles.update(form) : await systemApi.roles.create(form)
    if (res.code === 200) { ElMessage.success(res.msg); dialogVisible.value = false; loadRoles() }
    else ElMessage.error(res.msg)
  })
}
async function remove(row) {
  await ElMessageBox.confirm(t('common.confirmDelete'), t('common.confirmTitle'), { type: 'warning' })
  const res = await systemApi.roles.remove(row.id)
  if (res.code === 200) {
    ElMessage.success(res.msg)
    if (currentRole.value && currentRole.value.id === row.id) currentRole.value = null
    loadRoles()
  } else ElMessage.error(res.msg)
}

async function init() {
  await loadPermissions()
  await loadRoles()
}
init()
</script>

<style scoped>
.role-item { padding: 10px 12px; border-radius: 6px; cursor: pointer; transition: background 0.2s; }
.role-item:hover { background: #f5f7fa; }
.role-item.active { background: #e6f4ff; }
.role-head { display: flex; justify-content: space-between; align-items: center; }
.role-name { font-size: 14px; font-weight: 500; color: #303133; }
.role-desc { font-size: 12px; color: #909399; margin-top: 4px; }
.role-actions { margin-top: 4px; }
</style>
