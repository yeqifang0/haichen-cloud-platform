<template>
  <div class="page-container">
    <el-card shadow="hover">
      <div class="toolbar">
        <div>
          <el-input v-model="query.keyword" :placeholder="$t('sys.username') + '/' + $t('sys.realName')" clearable style="width: 200px" @keyup.enter="onSearch" />
          <el-select v-model="query.dept" :placeholder="$t('sys.dept')" clearable style="width: 140px; margin-left: 8px" @change="onSearch">
            <el-option v-for="d in depts" :key="d" :label="d" :value="d" />
          </el-select>
          <el-select v-model="query.status" :placeholder="$t('sys.status')" clearable style="width: 120px; margin-left: 8px" @change="onSearch">
            <el-option :label="$t('sys.enabled')" :value="1" />
            <el-option :label="$t('sys.disabled')" :value="0" />
          </el-select>
          <el-button type="primary" style="margin-left: 8px" :icon="Search" @click="onSearch">{{ $t('btn.search') }}</el-button>
          <el-button style="margin-left: 8px" @click="resetQuery">{{ $t('btn.reset') }}</el-button>
        </div>
        <el-button v-permission="'system:user:edit'" type="primary" :icon="Plus" @click="openDialog()">{{ $t('btn.add') }}{{ $t('sys.userTitle').replace('管理', '') }}</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe border>
        <el-table-column prop="username" :label="$t('sys.username')" width="120" />
        <el-table-column prop="name" :label="$t('sys.realName')" width="110" />
        <el-table-column :label="$t('sys.role')" min-width="180">
          <template #default="{ row }">
            <el-tag v-for="rid in row.roleIds" :key="rid" size="small" style="margin-right: 4px">{{ roleMap[rid] || '—' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dept" :label="$t('sys.dept')" width="100" />
        <el-table-column prop="phone" :label="$t('field.mobile')" width="130" />
        <el-table-column prop="email" label="Email" min-width="180" show-overflow-tooltip />
        <el-table-column :label="$t('sys.status')" width="90">
          <template #default="{ row }"><el-tag :type="row.status ? 'success' : 'info'" size="small">{{ row.status ? $t('sys.enabled') : $t('sys.disabled') }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="lastLogin" :label="$t('sys.lastLogin')" width="170" />
        <el-table-column :label="$t('sys.action')" width="220" fixed="right">
          <template #default="{ row }">
            <el-button v-permission="'system:user:edit'" link type="primary" @click="openDialog(row)">{{ $t('btn.edit') }}</el-button>
            <el-button v-permission="'system:user:edit'" link type="warning" @click="openReset(row)">{{ $t('common.reset') }}{{ $t('header.changePassword').replace(/^修改/, '') }}</el-button>
            <el-button v-permission="'system:user:edit'" link type="danger" @click="remove(row)">{{ $t('btn.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="mt-16"
        v-model:current-page="query.page"
        v-model:page-size="query.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="load"
        @current-change="load"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="form.id ? $t('btn.edit') + $t('sys.userTitle').replace('管理', '') : $t('btn.add') + $t('sys.userTitle').replace('管理', '')" width="640px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item :label="$t('sys.username')" prop="username"><el-input v-model="form.username" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('field.name')" prop="password"><el-input v-model="form.password" type="password" show-password :placeholder="form.id ? $t('field.remark') : ''" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('sys.realName')" prop="name"><el-input v-model="form.name" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('sys.dept')" prop="dept"><el-select v-model="form.dept" style="width: 100%"><el-option v-for="d in depts" :key="d" :label="d" :value="d" /></el-select></el-form-item></el-col>
          <el-col :span="24"><el-form-item :label="$t('sys.role')" prop="roleIds"><el-select v-model="form.roleIds" multiple style="width: 100%"><el-option v-for="r in rolesList" :key="r.id" :label="r.name" :value="r.id" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('field.mobile')" prop="phone"><el-input v-model="form.phone" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="Email" prop="email"><el-input v-model="form.email" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item :label="$t('sys.status')"><el-switch v-model="form.status" :active-value="1" :inactive-value="0" :active-text="$t('sys.enabled')" :inactive-text="$t('sys.disabled')" /></el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">{{ $t('btn.cancel') }}</el-button><el-button type="primary" @click="submit">{{ $t('btn.save') }}</el-button></template>
    </el-dialog>

    <el-dialog v-model="resetVisible" :title="$t('common.reset') + $t('header.changePassword').replace(/^修改/, '')" width="420px">
      <el-form :model="resetForm" label-width="90px">
        <el-form-item :label="$t('sys.username')"><el-input v-model="resetForm.username" disabled /></el-form-item>
        <el-form-item :label="$t('field.name')" required><el-input v-model="resetForm.password" type="password" show-password :placeholder="$t('login.rulesPassword')" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="resetVisible = false">{{ $t('btn.cancel') }}</el-button><el-button type="primary" @click="submitReset">{{ $t('btn.confirm') }}</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { systemApi } from '@/api'

const { t } = useI18n()

const depts = ['信息中心', '管理层', '仓储部', '物流部', '财务部']
const list = ref([])
const total = ref(0)
const loading = ref(false)
const query = reactive({ page: 1, pageSize: 10, keyword: '', dept: '', status: '' })
const rolesList = ref([])
const roleMap = computed(() => {
  const m = {}
  rolesList.value.forEach((r) => (m[r.id] = r.name))
  return m
})

const dialogVisible = ref(false)
const formRef = ref()
const form = reactive({})
const rules = computed(() => ({
  username: [{ required: true, message: t('login.rulesUsername'), trigger: 'blur' }],
  password: [{ required: !form.id, message: t('login.rulesPassword'), trigger: 'blur' }],
  name: [{ required: true, message: t('login.rulesUsername').replace(t('sys.username'), t('sys.realName')), trigger: 'blur' }],
  dept: [{ required: true, message: t('login.rulesUsername').replace(t('sys.username'), t('sys.dept')), trigger: 'change' }],
  roleIds: [{ required: true, type: 'array', message: t('login.rulesUsername').replace(t('sys.username'), t('sys.role')), trigger: 'change' }],
  phone: [{ validator: (rule, val, cb) => (!val || /^1\d{10}$/.test(val) ? cb() : cb(new Error(t('field.mobile')))), trigger: 'blur' }],
  email: [{ validator: (rule, val, cb) => (!val || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val) ? cb() : cb(new Error('Email'))), trigger: 'blur' }]
}))

const resetVisible = ref(false)
const resetForm = reactive({ id: null, username: '', password: '' })

async function loadRoles() {
  const res = await systemApi.roles.all()
  if (res.code === 200) rolesList.value = res.data
}
async function load() {
  loading.value = true
  try {
    const res = await systemApi.users.list(query)
    if (res.code === 200) { list.value = res.data.list; total.value = res.data.total }
  } finally { loading.value = false }
}
function onSearch() { query.page = 1; load() }
function resetQuery() { query.keyword = ''; query.dept = ''; query.status = ''; query.page = 1; load() }

function openDialog(row) {
  Object.keys(form).forEach((k) => delete form[k])
  if (row) { Object.assign(form, JSON.parse(JSON.stringify(row))); form.password = '' }
  else Object.assign(form, { username: '', password: '', name: '', dept: '', roleIds: [], phone: '', email: '', status: 1 })
  dialogVisible.value = true
}
async function submit() {
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    const payload = JSON.parse(JSON.stringify(form))
    if (form.id && !payload.password) delete payload.password
    const res = form.id ? await systemApi.users.update(payload) : await systemApi.users.create(payload)
    if (res.code === 200) { ElMessage.success(res.msg); dialogVisible.value = false; load() }
    else ElMessage.error(res.msg)
  })
}
async function remove(row) {
  await ElMessageBox.confirm(t('common.confirmDelete'), t('common.confirmTitle'), { type: 'warning' })
  const res = await systemApi.users.remove(row.id)
  if (res.code === 200) { ElMessage.success(res.msg); load() } else ElMessage.error(res.msg)
}
function openReset(row) {
  resetForm.id = row.id
  resetForm.username = row.username
  resetForm.password = ''
  resetVisible.value = true
}
async function submitReset() {
  if (!resetForm.password) { ElMessage.warning(t('login.rulesPassword')); return }
  const res = await systemApi.users.update({ id: resetForm.id, password: resetForm.password })
  if (res.code === 200) { ElMessage.success(res.msg); resetVisible.value = false } else ElMessage.error(res.msg)
}

loadRoles()
load()
</script>
