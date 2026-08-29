<template>
  <div class="page-container">
    <el-card shadow="hover">
      <div class="toolbar">
        <div>
          <el-input v-model="query.keyword" placeholder="SKU/货品名称" clearable style="width: 200px" @keyup.enter="load" />
          <el-select v-model="query.category" placeholder="品类" clearable style="width: 140px; margin-left: 8px" @change="load">
            <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
          </el-select>
          <el-button type="primary" style="margin-left: 8px" @click="load">查询</el-button>
        </div>
        <el-button v-permission="'warehouse:goods:add'" type="primary" :icon="Plus" @click="openDialog()">新增货品</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe border>
        <el-table-column prop="sku" label="SKU编码" width="140" />
        <el-table-column prop="name" label="货品名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="spec" label="规格型号" width="140" />
        <el-table-column prop="category" label="品类" width="100" />
        <el-table-column prop="unit" label="单位" width="70" />
        <el-table-column prop="manufacturer" label="生产厂商" width="120" />
        <el-table-column label="单价(元)" width="110" align="right">
          <template #default="{ row }">¥{{ row.price?.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }"><el-tag :type="row.status ? 'success' : 'info'" size="small">{{ row.status ? '启用' : '停用' }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button v-permission="'warehouse:goods:edit'" link type="primary" @click="openDialog(row)">编辑</el-button>
            <el-button v-permission="'warehouse:goods:del'" link type="danger" @click="remove(row)">停用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="mt-16" v-model:current-page="query.page" v-model:page-size="query.pageSize" :total="total" :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next, jumper" background @size-change="load" @current-change="load" />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑货品' : '新增货品'" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="SKU编码" prop="sku"><el-input v-model="form.sku" placeholder="留空自动生成" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="货品名称" prop="name"><el-input v-model="form.name" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="规格型号"><el-input v-model="form.spec" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="品类" prop="category"><el-select v-model="form.category" style="width:100%"><el-option v-for="c in categories" :key="c" :label="c" :value="c" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="单位" prop="unit"><el-select v-model="form.unit" style="width:100%"><el-option v-for="u in ['台','套','件','箱','托']" :key="u" :label="u" :value="u" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="生产厂商"><el-input v-model="form.manufacturer" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="单价(元)"><el-input-number v-model="form.price" :min="0" style="width:100%" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="存储条件"><el-input v-model="form.storageCond" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="状态"><el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="停用" /></el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="submit">保存</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { warehouseApi } from '@/api'

const categories = ['储能设备', '电力电子', '控制设备', '结构件']
const list = ref([])
const total = ref(0)
const loading = ref(false)
const query = reactive({ page: 1, pageSize: 10, keyword: '', category: '' })
const dialogVisible = ref(false)
const formRef = ref()
const form = reactive({})
const rules = {
  name: [{ required: true, message: '请输入货品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择品类', trigger: 'change' }],
  unit: [{ required: true, message: '请选择单位', trigger: 'change' }]
}

async function load() {
  loading.value = true
  try { const res = await warehouseApi.goods.list(query); if (res.code === 200) { list.value = res.data.list; total.value = res.data.total } } finally { loading.value = false }
}
function openDialog(row) {
  Object.keys(form).forEach((k) => delete form[k])
  if (row) Object.assign(form, JSON.parse(JSON.stringify(row)))
  else Object.assign(form, { sku: '', name: '', spec: '', category: '', unit: '台', manufacturer: '', price: 0, storageCond: '', status: 1 })
  dialogVisible.value = true
}
async function submit() {
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    if (!form.sku) form.sku = 'HC-' + Date.now().toString().slice(-6)
    const res = form.id ? await warehouseApi.goods.update(form) : await warehouseApi.goods.create(form)
    if (res.code === 200) { ElMessage.success(res.msg); dialogVisible.value = false; load() }
  })
}
async function remove(row) {
  await ElMessageBox.confirm(`确认停用货品「${row.name}」？`, '提示', { type: 'warning' })
  const res = await warehouseApi.goods.update({ id: row.id, status: 0 })
  if (res.code === 200) { ElMessage.success('已停用'); load() }
}
load()
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.mt-16 { margin-top: 16px; }
</style>
