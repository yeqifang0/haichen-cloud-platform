<template>
  <div class="page-container">
    <el-card shadow="hover">
      <div class="toolbar">
        <div>
          <el-input v-model="query.keyword" placeholder="用户名/姓名" clearable style="width: 200px" @keyup.enter="onSearch" />
          <el-select v-model="query.dept" placeholder="部门" clearable style="width: 140px; margin-left: 8px" @change="onSearch">
            <el-option v-for="d in depts" :key="d" :label="d" :value="d" />
          </el-select>
          <el-select v-model="query.status" placeholder="状态" clearable style="width: 120px; margin-left: 8px" @change="onSearch">
            <el-option label="启用" :value="1" />
            <el-option label="停用" :value="0" />
          </el-select>
          <el-button type="primary" style="margin-left: 8px" :icon="Search" @click="onSearch">查询</el-button>
          <el-button style="margin-left: 8px" @click="resetQuery">重置</el-button>
        </div>
        <el-button v-permission="'system:user:edit'" type="primary" :icon="Plus" @click="openDialog()">新增用户</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe border>
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="name" label="姓名" width="110" />
        <el-table-column label="角色" min-width="180">
          <template #default="{ row }">
            <el-tag v-for="rid in row.roleIds" :key="rid" size="small" style="margin-right: 4px">{{ roleMap[rid] || '未知' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dept" label="部门" width="100" />
        <el-table-column prop="phone" label="手机" width="130" />
        <el-table-column prop="email" label="邮箱" min-width="180" show-overflow-tooltip />
        <el-table-column label="状态" width="90">
          <template #default="{ row }"><el-tag :type="row.status ? 'success' : 'info'" size="small">{{ row.status ? '启用' : '停用' }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="lastLogin" label="最近登录" width="170" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button v-permission="'system:user:edit'" link type="primary" @click="openDialog(row)">编辑</el-button>
            <el-button v-permission="'system:user:edit'" link type="warning" @click="openReset(row)">重置密码</el-button>
            <el-button v-permission="'system:user:edit'" link type="danger" @click="remove(row)">删除</el-button>
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

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑用户' : '新增用户'" width="640px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="用户名" prop="username"><el-input v-model="form.username" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="密码" prop="password"><el-input v-model="form.password" type="password" show-password :placeholder="form.id ? '留空不修改' : ''" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="姓名" prop="name"><el-input v-model="form.name" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="部门" prop="dept"><el-select v-model="form.dept" style="width: 100%"><el-option v-for="d in depts" :key="d" :label="d" :value="d" /></el-select></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="角色" prop="roleIds"><el-select v-model="form.roleIds" multiple style="width: 100%"><el-option v-for="r in rolesList" :key="r.id" :label="r.name" :value="r.id" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="手机" prop="phone"><el-input v-model="form.phone" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="邮箱" prop="email"><el-input v-model="form.email" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="状态"><el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="停用" /></el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="submit">保存</el-button></template>
    </el-dialog>

    <el-dialog v-model="resetVisible" title="重置密码" width="420px">
      <el-form :model="resetForm" label-width="90px">
        <el-form-item label="用户名"><el-input v-model="resetForm.username" disabled /></el-form-item>
        <el-form-item label="新密码" required><el-input v-model="resetForm.password" type="password" show-password placeholder="请输入新密码" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="resetVisible = false">取消</el-button><el-button type="primary" @click="submitReset">确认重置</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { systemApi } from '@/api'

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
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: !form.id, message: '请输入密码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  dept: [{ required: true, message: '请选择部门', trigger: 'change' }],
  roleIds: [{ required: true, type: 'array', message: '请分配角色', trigger: 'change' }],
  phone: [{ validator: (rule, val, cb) => (!val || /^1\d{10}$/.test(val) ? cb() : cb(new Error('请输入正确的手机号'))), trigger: 'blur' }],
  email: [{ validator: (rule, val, cb) => (!val || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val) ? cb() : cb(new Error('邮箱格式不正确'))), trigger: 'blur' }]
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
  await ElMessageBox.confirm(`确认删除用户「${row.username}」？`, '提示', { type: 'warning' })
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
  if (!resetForm.password) { ElMessage.warning('请输入新密码'); return }
  const res = await systemApi.users.update({ id: resetForm.id, password: resetForm.password })
  if (res.code === 200) { ElMessage.success('密码重置成功'); resetVisible.value = false } else ElMessage.error(res.msg)
}

loadRoles()
load()
</script>
