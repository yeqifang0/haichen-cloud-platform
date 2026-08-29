<template>
  <div class="page-container">
    <el-card shadow="hover">
      <div class="toolbar">
        <div>
          <el-input v-model="query.keyword" placeholder="单号/客户/供应商" clearable style="width: 220px" @keyup.enter="load" />
          <el-select v-model="query.type" placeholder="单据类型" clearable style="width: 130px; margin-left: 8px" @change="load">
            <el-option v-for="t in orderTypes" :key="t" :label="t" :value="t" />
          </el-select>
          <el-select v-model="query.status" placeholder="状态" clearable style="width: 120px; margin-left: 8px" @change="load">
            <el-option v-for="s in statusList" :key="s" :label="s" :value="s" />
          </el-select>
          <el-button type="primary" style="margin-left: 8px" @click="load">查询</el-button>
        </div>
        <div>
          <el-button :icon="Refresh" plain @click="syncMobile">同步移动端</el-button>
          <el-button v-permission="'warehouse:order:add'" type="primary" :icon="Plus" @click="openDialog()">新增单据</el-button>
        </div>
      </div>
      <el-table :data="list" v-loading="loading" stripe border>
        <el-table-column prop="orderNo" label="单据号" width="190" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="typeColor(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="往来方" width="160">
          <template #default="{ row }">{{ row.customer || row.supplier || (row.fromWh + '→' + row.toWh) }}</template>
        </el-table-column>
        <el-table-column prop="warehouse" label="仓库" width="130" />
        <el-table-column prop="expectDate" label="预计日期" width="120" />
        <el-table-column prop="itemCount" label="数量" width="80" align="right" />
        <el-table-column label="金额(元)" width="120" align="right">
          <template #default="{ row }">¥{{ row.amount?.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }"><el-tag :type="statusColor(row.status)" size="small">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="creator" label="创建人" width="90" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDetail(row)">详情</el-button>
            <el-button v-if="row.status === '待审核'" v-permission="'warehouse:order:audit'" link type="success" @click="audit(row, 'pass')">通过</el-button>
            <el-button v-if="row.status === '待审核'" v-permission="'warehouse:order:audit'" link type="danger" @click="audit(row, 'reject')">驳回</el-button>
            <el-button v-if="row.type === '销售出库' && (row.status === '已审核' || row.status === '已发运')" link type="warning" @click="goTrack(row)">物流追踪</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="mt-16" v-model:current-page="query.page" v-model:page-size="query.pageSize" :total="total" :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next, jumper" background @size-change="load" @current-change="load" />
    </el-card>

    <!-- 单据详情 -->
    <el-dialog v-model="detailVisible" title="单据详情" width="640px">
      <el-descriptions v-if="detail" :column="2" border>
        <el-descriptions-item label="单据号">{{ detail.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="类型">{{ detail.type }}</el-descriptions-item>
        <el-descriptions-item label="往来方">{{ detail.customer || detail.supplier }}</el-descriptions-item>
        <el-descriptions-item label="仓库">{{ detail.warehouse }}</el-descriptions-item>
        <el-descriptions-item label="预计日期">{{ detail.expectDate }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ detail.status }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ detail.creator }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detail.createTime }}</el-descriptions-item>
      </el-descriptions>
      <el-table :data="detail?.items || []" class="mt-16" border size="small">
        <el-table-column prop="sku" label="SKU" width="140" />
        <el-table-column prop="name" label="货品名称" />
        <el-table-column prop="qty" label="数量" width="80" align="right" />
        <el-table-column label="单价" width="100" align="right"><template #default="{ row }">¥{{ row.price?.toLocaleString() }}</template></el-table-column>
        <el-table-column label="小计" width="120" align="right"><template #default="{ row }">¥{{ (row.qty * row.price)?.toLocaleString() }}</template></el-table-column>
      </el-table>
    </el-dialog>

    <!-- 新增单据 -->
    <el-dialog v-model="dialogVisible" title="新增单据" width="680px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="单据类型" prop="type"><el-select v-model="form.type" style="width:100%" @change="onTypeChange"><el-option v-for="t in orderTypes" :key="t" :label="t" :value="t" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="partnerLabel" prop="partner"><el-input v-model="form.partner" :placeholder="partnerLabel" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="仓库" prop="warehouse"><el-input v-model="form.warehouse" placeholder="如 上海中心仓" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="预计日期" prop="expectDate"><el-date-picker v-model="form.expectDate" type="date" value-format="YYYY-MM-DD" style="width:100%" /></el-form-item></el-col>
        </el-row>
        <el-divider content-position="left">货品明细</el-divider>
        <div v-for="(item, idx) in form.items" :key="idx" class="item-row">
          <el-input v-model="item.sku" placeholder="SKU编码" style="width: 140px" />
          <el-input v-model="item.name" placeholder="货品名称" style="flex:1" />
          <el-input-number v-model="item.qty" :min="1" placeholder="数量" style="width: 120px" />
          <el-input-number v-model="item.price" :min="0" placeholder="单价" style="width: 140px" />
          <el-button link type="danger" :icon="Delete" @click="form.items.splice(idx, 1)" />
        </div>
        <el-button :icon="Plus" plain style="width: 100%; margin-top: 8px" @click="form.items.push({ sku: '', name: '', qty: 1, price: 0 })">添加明细</el-button>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="submit">提交（状态：待审核）</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Delete, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { warehouseApi } from '@/api'

const router = useRouter()
const orderTypes = ['采购入库', '销售出库', '调拨单', '退货单']
const statusList = ['待审核', '已审核', '拣货完成', '已发运', '已完成', '已驳回']
const list = ref([])
const total = ref(0)
const loading = ref(false)
const query = reactive({ page: 1, pageSize: 10, keyword: '', type: '', status: '' })
const detailVisible = ref(false)
const detail = ref(null)
const dialogVisible = ref(false)
const formRef = ref()
const form = reactive({ type: '采购入库', partner: '', warehouse: '', expectDate: '', items: [{ sku: '', name: '', qty: 1, price: 0 }] })
const rules = {
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  partner: [{ required: true, message: '请输入往来方', trigger: 'blur' }],
  warehouse: [{ required: true, message: '请输入仓库', trigger: 'blur' }],
  expectDate: [{ required: true, message: '请选择日期', trigger: 'change' }]
}
const partnerLabel = computed(() => (form.type === '采购入库' ? '供应商' : form.type === '销售出库' || form.type === '退货单' ? '客户' : '调出方'))

async function load() {
  loading.value = true
  try { const res = await warehouseApi.orders.list(query); if (res.code === 200) { list.value = res.data.list; total.value = res.data.total } } finally { loading.value = false }
}
function onTypeChange() { form.partner = '' }
async function viewDetail(row) {
  const res = await warehouseApi.orderDetail(row.id)
  if (res.code === 200) { detail.value = res.data; detailVisible.value = true }
}
async function audit(row, action) {
  const txt = action === 'pass' ? '通过' : '驳回'
  await ElMessageBox.confirm(`确认${txt}单据「${row.orderNo}」？`, '审核确认', { type: action === 'pass' ? 'success' : 'warning' })
  const res = await warehouseApi.auditOrder({ id: row.id, action })
  if (res.code === 200) {
    ElMessage.success(res.msg)
    if (action === 'pass' && row.type === '销售出库') {
      ElMessage({ message: '已自动生成运输任务并推送至车辆调度中心', type: 'success', duration: 4000 })
    }
    load()
  }
}
function goTrack(row) { router.push('/logistics/track') }
function openDialog() {
  Object.assign(form, { type: '采购入库', partner: '', warehouse: '', expectDate: '', items: [{ sku: '', name: '', qty: 1, price: 0 }] })
  dialogVisible.value = true
}
async function submit() {
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    if (!form.items.length || !form.items[0].sku) { ElMessage.warning('请添加至少一条货品明细'); return }
    const prefix = { '采购入库': 'PO', '销售出库': 'SO', '调拨单': 'TR', '退货单': 'RT' }[form.type]
    const payload = {
      type: form.type,
      orderNo: `${prefix}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Date.now()).slice(-5)}`,
      warehouse: form.warehouse,
      expectDate: form.expectDate,
      amount: form.items.reduce((s, i) => s + i.qty * i.price, 0),
      itemCount: form.items.reduce((s, i) => s + i.qty, 0),
      status: '待审核',
      creator: '当前用户',
      [form.type === '采购入库' ? 'supplier' : 'customer']: form.partner,
      items: form.items
    }
    const res = await warehouseApi.orders.create(payload)
    if (res.code === 200) { ElMessage.success(res.msg); dialogVisible.value = false; load() }
  })
}
async function syncMobile() {
  const res = await warehouseApi.syncMobile()
  if (res.code === 200) { ElMessage.success(`已同步 ${res.data.synced} 条移动端单据`); load() }
}
function typeColor(t) { return { '采购入库': 'primary', '销售出库': 'success', '调拨单': 'warning', '退货单': 'danger' }[t] || '' }
function statusColor(s) { return { '待审核': 'warning', '已审核': 'primary', '拣货完成': 'info', '已发运': 'primary', '已完成': 'success', '已驳回': 'danger' }[s] || '' }
load()
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.mt-16 { margin-top: 16px; }
.item-row { display: flex; gap: 8px; margin-bottom: 8px; align-items: center; }
</style>
