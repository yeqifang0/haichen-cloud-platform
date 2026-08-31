<template>
  <div class="page-container">
    <el-card shadow="hover">
      <div class="toolbar">
        <div>
          <el-input v-model="query.keyword" :placeholder="$t('partner.customer') + '/' + $t('partner.supplier')" clearable style="width: 220px" @keyup.enter="load" />
          <el-select v-model="query.type" :placeholder="$t('partner.type')" clearable style="width: 120px; margin-left: 8px" @change="load">
            <el-option :label="$t('partner.customer')" value="客户" /><el-option :label="$t('partner.supplier')" value="供应商" />
          </el-select>
          <el-button type="primary" style="margin-left: 8px" @click="load">{{ $t('btn.search') }}</el-button>
        </div>
        <el-button v-permission="'warehouse:goods:add'" type="primary" :icon="Plus" @click="openDialog()">{{ $t('btn.add') }}</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe border>
        <el-table-column prop="name" :label="$t('field.name')" min-width="200" show-overflow-tooltip />
        <el-table-column prop="type" :label="$t('partner.type')" width="90"><template #default="{ row }"><el-tag :type="row.type === '客户' ? 'success' : 'primary'" size="small">{{ row.type === '客户' ? $t('partner.customer') : $t('partner.supplier') }}</el-tag></template></el-table-column>
        <el-table-column prop="level" :label="$t('partner.level')" width="80">
          <template #default="{ row }">{{ translateLevel(row.level) }}</template>
        </el-table-column>
        <el-table-column prop="contact" :label="$t('partner.contact')" width="100" />
        <el-table-column prop="phone" :label="$t('partner.phone')" width="140" />
        <el-table-column prop="credit" :label="$t('partner.credit')" width="80"><template #default="{ row }"><el-tag :type="row.credit === '优秀' ? 'success' : 'info'" size="small" effect="plain">{{ translateCredit(row.credit) }}</el-tag></template></el-table-column>
        <el-table-column :label="$t('partner.totalAmount')" width="140" align="right"><template #default="{ row }">¥{{ row.totalAmount?.toLocaleString() }}</template></el-table-column>
        <el-table-column prop="lastOrder" :label="$t('partner.lastOrder')" width="120" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewVisits(row)">{{ $t('partner.visitTitle') }}</el-button>
            <el-button v-permission="'warehouse:goods:edit'" link type="primary" @click="openDialog(row)">{{ $t('btn.edit') }}</el-button>
            <el-button v-permission="'warehouse:goods:del'" link type="danger" @click="remove(row)">{{ $t('btn.delete') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="mt-16" v-model:current-page="query.page" v-model:page-size="query.pageSize" :total="total" :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next, jumper" background @size-change="load" @current-change="load" />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="form.id ? $t('btn.edit') : $t('btn.add')" width="560px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="16">
          <el-col :span="16"><el-form-item :label="$t('field.name')" prop="name"><el-input v-model="form.name" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item :label="$t('partner.type')" prop="type"><el-select v-model="form.type" style="width:100%"><el-option :label="$t('partner.customer')" value="客户" /><el-option :label="$t('partner.supplier')" value="供应商" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item :label="$t('partner.level')"><el-select v-model="form.level" style="width:100%"><el-option v-for="l in levels" :key="l" :label="translateLevel(l)" :value="l" /></el-select></el-form-item></el-col>
          <el-col :span="8"><el-form-item :label="$t('partner.contact')"><el-input v-model="form.contact" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item :label="$t('partner.phone')"><el-input v-model="form.phone" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item :label="$t('partner.address')"><el-input v-model="form.address" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item :label="$t('partner.credit')"><el-select v-model="form.credit" style="width:100%"><el-option v-for="c in credits" :key="c" :label="translateCredit(c)" :value="c" /></el-select></el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">{{ $t('btn.cancel') }}</el-button><el-button type="primary" @click="submit">{{ $t('btn.save') }}</el-button></template>
    </el-dialog>

    <el-dialog v-model="visitVisible" :title="`${currentCustomer} - ${$t('partner.visitTitle')}`" width="640px">
      <el-timeline>
        <el-timeline-item v-for="v in visits" :key="v.id" :timestamp="v.date" placement="top" type="primary">
          <div class="visit-content">{{ v.content }}</div>
          <div class="visit-meta">{{ $t('partner.contact') }}: {{ v.visitor }} · 结果: {{ v.result }}</div>
        </el-timeline-item>
        <el-empty v-if="!visits.length" :description="$t('partner.noVisit')" :image-size="60" />
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { warehouseApi } from '@/api'

const { t } = useI18n()

const LEVEL_MAP = { '战略': 'partner.strategic', 'A级': 'partner.levelA', 'B级': 'partner.levelB', 'C级': 'partner.levelC' }
function translateLevel(v) { return LEVEL_MAP[v] ? t(LEVEL_MAP[v]) : v }

const CREDIT_MAP = { '优秀': 'partner.excellent', '良好': 'partner.good', '一般': 'partner.avg' }
function translateCredit(v) { return CREDIT_MAP[v] ? t(CREDIT_MAP[v]) : v }

const levels = ['战略', 'A级', 'B级', 'C级']
const credits = ['优秀', '良好', '一般']
const list = ref([])
const total = ref(0)
const loading = ref(false)
const query = reactive({ page: 1, pageSize: 10, keyword: '', type: '' })
const dialogVisible = ref(false)
const formRef = ref()
const form = reactive({})
const rules = { name: [{ required: true, message: t('field.name') + 'message.input', trigger: 'blur' }], type: [{ required: true, message: t('partner.type') + 'message.select', trigger: 'change' }] }
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
  await ElMessageBox.confirm(`${t('header.tip')}？`, t('header.tip'), { type: 'warning' })
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
