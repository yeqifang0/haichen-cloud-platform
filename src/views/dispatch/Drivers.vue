<template>
  <div class="page-container">
    <el-card shadow="hover">
      <div class="toolbar">
        <div>
          <el-input v-model="query.keyword" placeholder="姓名/电话" clearable style="width: 220px" @keyup.enter="load" />
          <el-select v-model="query.status" placeholder="状态" clearable style="width: 130px; margin-left: 8px" @change="load">
            <el-option label="在职" value="在职" />
            <el-option label="休假" value="休假" />
          </el-select>
          <el-button type="primary" style="margin-left: 8px" @click="load">查询</el-button>
        </div>
        <el-button v-permission="'dispatch:assign'" type="primary" :icon="Plus" @click="openDialog()">新增司机</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe border>
        <el-table-column prop="name" label="姓名" width="110" />
        <el-table-column prop="phone" label="电话" width="140" />
        <el-table-column prop="license" label="驾照类型" width="100" />
        <el-table-column prop="plate" label="绑定车牌" width="130" />
        <el-table-column prop="age" label="年龄" width="80" align="center" />
        <el-table-column prop="joinDate" label="入职日期" width="120" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }"><el-tag :type="row.status === '在职' ? 'success' : 'info'" size="small">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="trips" label="累计趟数" width="100" align="right" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button v-permission="'dispatch:assign'" link type="primary" @click="openDialog(row)">编辑</el-button>
            <el-button v-permission="'dispatch:assign'" link type="danger" @click="remove(row)">删除</el-button>
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

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑司机' : '新增司机'" width="560px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="姓名" prop="name"><el-input v-model="form.name" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="电话" prop="phone"><el-input v-model="form.phone" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="驾照类型" prop="license"><el-select v-model="form.license" style="width:100%"><el-option v-for="l in ['A1','A2','B1','B2','C1']" :key="l" :label="l" :value="l" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="绑定车牌" prop="plate"><el-input v-model="form.plate" placeholder="如 沪A·88888" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="年龄" prop="age"><el-input-number v-model="form.age" :min="18" :max="65" style="width:100%" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="入职日期" prop="joinDate"><el-date-picker v-model="form.joinDate" type="date" value-format="YYYY-MM-DD" style="width:100%" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="状态" prop="status"><el-select v-model="form.status" style="width:100%"><el-option label="在职" value="在职" /><el-option label="休假" value="休假" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="累计趟数"><el-input-number v-model="form.trips" :min="0" style="width:100%" /></el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { dispatchApi } from '@/api'

const list = ref([])
const total = ref(0)
const loading = ref(false)
const query = reactive({ page: 1, pageSize: 10, keyword: '', status: '' })
const dialogVisible = ref(false)
const formRef = ref()
const form = reactive({})
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
  license: [{ required: true, message: '请选择驾照类型', trigger: 'change' }],
  plate: [{ required: true, message: '请输入绑定车牌', trigger: 'blur' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  joinDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

async function load() {
  loading.value = true
  try {
    const res = await dispatchApi.drivers.list(query)
    if (res.code === 200) { list.value = res.data.list; total.value = res.data.total }
  } finally { loading.value = false }
}

function openDialog(row) {
  Object.keys(form).forEach((k) => delete form[k])
  if (row) Object.assign(form, JSON.parse(JSON.stringify(row)))
  else Object.assign(form, { name: '', phone: '', license: 'A2', plate: '', age: 30, joinDate: new Date().toISOString().slice(0, 10), status: '在职', trips: 0 })
  dialogVisible.value = true
}

async function submit() {
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    const res = form.id ? await dispatchApi.drivers.update(form) : await dispatchApi.drivers.create(form)
    if (res.code === 200) { ElMessage.success(res.msg); dialogVisible.value = false; load() }
    else ElMessage.error(res.msg)
  })
}

async function remove(row) {
  await ElMessageBox.confirm(`确认删除司机「${row.name}」？`, '提示', { type: 'warning' })
  const res = await dispatchApi.drivers.remove(row.id)
  if (res.code === 200) { ElMessage.success(res.msg); load() }
}

load()
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.mt-16 { margin-top: 16px; }
</style>
