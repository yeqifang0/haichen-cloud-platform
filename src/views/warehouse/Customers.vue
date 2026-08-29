<template>
  <div class="page-container">
    <el-card shadow="hover">
      <div class="toolbar">
        <div>
          <el-input v-model="query.keyword" placeholder="客户/供应商名称" clearable style="width: 220px" @keyup.enter="load" />
          <el-select v-model="query.type" placeholder="类型" clearable style="width: 120px; margin-left: 8px" @change="load">
            <el-option label="客户" value="客户" /><el-option label="供应商" value="供应商" />
          </el-select>
          <el-button type="primary" style="margin-left: 8px" @click="load">查询</el-button>
        </div>
        <el-button v-permission="'warehouse:goods:add'" type="primary" :icon="Plus" @click="openDialog()">新增</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe border>
        <el-table-column prop="name" label="名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="type" label="类型" width="90"><template #default="{ row }"><el-tag :type="row.type === '客户' ? 'success' : 'primary'" size="small">{{ row.type }}</el-tag></template></el-table-column>
        <el-table-column prop="level" label="等级" width="80" />
        <el-table-column prop="contact" label="联系人" width="100" />
        <el-table-column prop="phone" label="电话" width="140" />
        <el-table-column prop="credit" label="信用" width="80"><template #default="{ row }"><el-tag :type="row.credit === '优秀' ? 'success' : 'info'" size="small" effect="plain">{{ row.credit }}</el-tag></template></el-table-column>
        <el-table-column label="累计交易额(元)" width="140" align="right"><template #default="{ row }">¥{{ row.totalAmount?.toLocaleString() }}</template></el-table-column>
        <el-table-column prop="lastOrder" label="最近交易" width="120" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewVisits(row)">拜访记录</el-button>
            <el-button v-permission="'warehouse:goods:edit'" link type="primary" @click="openDialog(row)">编辑</el-button>
            <el-button v-permission="'warehouse:goods:del'" link type="danger" @click="remove(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="mt-16" v-model:current-page="query.page" v-model:page-size="query.pageSize" :total="total" :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next, jumper" background @size-change="load" @current-change="load" />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="form.id ? '编辑' : '新增'" width="560px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="16">
          <el-col :span="16"><el-form-item label="名称" prop="name"><el-input v-model="form.name" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="类型" prop="type"><el-select v-model="form.type" style="width:100%"><el-option label="客户" value="客户" /><el-option label="供应商" value="供应商" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="等级"><el-select v-model="form.level" style="width:100%"><el-option v-for="l in ['战略','A级','B级','C级']" :key="l" :label="l" :value="l" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="联系人"><el-input v-model="form.contact" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="电话"><el-input v-model="form.phone" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="地址"><el-input v-model="form.address" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="信用"><el-select v-model="form.credit" style="width:100%"><el-option v-for="c in ['优秀','良好','一般']" :key="c" :label="c" :value="c" /></el-select></el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="submit">保存</el-button></template>
    </el-dialog>

    <el-dialog v-model="visitVisible" :title="`${currentCustomer} - 拜访记录`" width="640px">
      <el-timeline>
        <el-timeline-item v-for="v in visits" :key="v.id" :timestamp="v.date" placement="top" type="primary">
          <div class="visit-content">{{ v.content }}</div>
          <div class="visit-meta">拜访人：{{ v.visitor }} · 结果：{{ v.result }}</div>
        </el-timeline-item>
        <el-empty v-if="!visits.length" description="暂无拜访记录" :image-size="60" />
      </el-timeline>
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
const rules = { name: [{ required: true, message: '请输入名称', trigger: 'blur' }], type: [{ required: true, message: '请选择类型', trigger: 'change' }] }
const visitVisible = ref(false)
const visits = ref([])
const currentCustomer = ref('')

async function load() {
  loading.value = true
  try { const res = await warehouseApi.customers.list(query); if (res.code === 200) { list.value = res.data.list; total.value = res.data.total } } finally { loading.value = false }
}
function openDialog(row) {
  Object.keys(form).forEach((k) => delete form[k])
  if (row) Object.assign(form, JSON.parse(JSON.stringify(row)))
  else Object.assign(form, { name: '', type: '客户', level: 'B级', contact: '', phone: '', address: '', credit: '良好', totalAmount: 0, lastOrder: '', createTime: new Date().toISOString().slice(0, 10) })
  dialogVisible.value = true
}
async function submit() {
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    const res = form.id ? await warehouseApi.customers.update(form) : await warehouseApi.customers.create(form)
    if (res.code === 200) { ElMessage.success(res.msg); dialogVisible.value = false; load() }
  })
}
async function remove(row) {
  await ElMessageBox.confirm(`确认删除「${row.name}」？`, '提示', { type: 'warning' })
  const res = await warehouseApi.customers.remove(row.id)
  if (res.code === 200) { ElMessage.success(res.msg); load() }
}
async function viewVisits(row) {
  currentCustomer.value = row.name
  const res = await warehouseApi.visits.all()
  if (res.code === 200) visits.value = res.data.filter((v) => v.customerId === row.id)
  visitVisible.value = true
}
load()
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.mt-16 { margin-top: 16px; }
.visit-content { font-size: 14px; color: #303133; }
.visit-meta { font-size: 12px; color: #909399; margin-top: 4px; }
</style>
