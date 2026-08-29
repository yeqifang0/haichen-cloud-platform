<template>
  <div class="page-container">
    <el-card shadow="hover">
      <div class="toolbar">
        <div>
          <el-input v-model="query.keyword" placeholder="仓库名称/编码" clearable style="width: 200px" @keyup.enter="load" />
          <el-select v-model="query.type" placeholder="仓库类型" clearable style="width: 140px; margin-left: 8px" @change="load">
            <el-option v-for="t in ['中心仓','区域仓','前置仓']" :key="t" :label="t" :value="t" />
          </el-select>
          <el-button type="primary" style="margin-left: 8px" @click="load">查询</el-button>
        </div>
        <el-button v-permission="'warehouse:goods:add'" type="primary" :icon="Plus" @click="openDialog()">新增仓库</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe border>
        <el-table-column prop="code" label="仓库编码" width="140" />
        <el-table-column prop="name" label="仓库名称" width="160" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="address" label="地址" show-overflow-tooltip />
        <el-table-column prop="area" label="面积(㎡)" width="100" />
        <el-table-column prop="manager" label="负责人" width="100" />
        <el-table-column prop="phone" label="联系电话" width="130" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }"><el-tag :type="row.status ? 'success' : 'info'" size="small">{{ row.status ? '启用' : '停用' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button v-permission="'warehouse:goods:edit'" link type="primary" @click="openDialog(row)">编辑</el-button>
            <el-button v-permission="'warehouse:goods:del'" link type="danger" @click="remove(row)">删除</el-button>
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

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑仓库' : '新增仓库'" width="560px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="仓库编码" prop="code"><el-input v-model="form.code" placeholder="WH-XXX" /></el-form-item>
        <el-form-item label="仓库名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="仓库类型" prop="type">
          <el-select v-model="form.type" style="width: 100%">
            <el-option v-for="t in ['中心仓','区域仓','前置仓']" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="仓库地址" prop="address"><el-input v-model="form.address" /></el-form-item>
        <el-form-item label="面积(㎡)" prop="area"><el-input-number v-model="form.area" :min="0" style="width: 100%" /></el-form-item>
        <el-form-item label="负责人" prop="manager"><el-input v-model="form.manager" /></el-form-item>
        <el-form-item label="联系电话" prop="phone"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="停用" />
        </el-form-item>
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
import { warehouseApi } from '@/api'

const list = ref([])
const total = ref(0)
const loading = ref(false)
const query = reactive({ page: 1, pageSize: 10, keyword: '', type: '' })
const dialogVisible = ref(false)
const formRef = ref()
const form = reactive({})
const rules = {
  code: [{ required: true, message: '请输入仓库编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择仓库类型', trigger: 'change' }],
  address: [{ required: true, message: '请输入仓库地址', trigger: 'blur' }],
  area: [{ required: true, message: '请输入面积', trigger: 'blur' }],
  manager: [{ required: true, message: '请输入负责人', trigger: 'blur' }]
}

async function load() {
  loading.value = true
  try {
    const res = await warehouseApi.warehouses.list(query)
    if (res.code === 200) { list.value = res.data.list; total.value = res.data.total }
  } finally { loading.value = false }
}

function openDialog(row) {
  Object.keys(form).forEach((k) => delete form[k])
  if (row) Object.assign(form, JSON.parse(JSON.stringify(row)))
  else Object.assign(form, { code: '', name: '', type: '', address: '', area: 0, manager: '', phone: '', status: 1, usage: 0, temp: 22, humidity: 50 })
  dialogVisible.value = true
}

async function submit() {
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    const res = form.id ? await warehouseApi.warehouses.update(form) : await warehouseApi.warehouses.create(form)
    if (res.code === 200) { ElMessage.success(res.msg); dialogVisible.value = false; load() }
    else ElMessage.error(res.msg)
  })
}

async function remove(row) {
  await ElMessageBox.confirm(`确认删除仓库「${row.name}」？`, '提示', { type: 'warning' })
  const res = await warehouseApi.warehouses.remove(row.id)
  if (res.code === 200) { ElMessage.success(res.msg); load() }
}

load()
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.mt-16 { margin-top: 16px; }
</style>
