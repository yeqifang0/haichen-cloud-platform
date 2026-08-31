<template>
  <div class="page-container">
    <el-card shadow="hover">
      <div class="toolbar">
        <div>
          <el-input v-model="query.keyword" :placeholder="$t('order.no') + '/' + $t('order.customer') + '/' + $t('order.supplier')" clearable style="width: 220px" @keyup.enter="load" />
          <el-select v-model="query.type" :placeholder="$t('order.type')" clearable style="width: 130px; margin-left: 8px" @change="load">
            <el-option v-for="t in orderTypes" :key="t" :label="translateOrderType(t)" :value="t" />
          </el-select>
          <el-select v-model="query.status" :placeholder="$t('order.status')" clearable style="width: 120px; margin-left: 8px" @change="load">
            <el-option v-for="s in statusList" :key="s" :label="translateOrderStatus(s)" :value="s" />
          </el-select>
          <el-button type="primary" style="margin-left: 8px" @click="load">{{ $t('btn.search') }}</el-button>
        </div>
        <div>
          <el-button :icon="Refresh" plain @click="syncMobile">{{ $t('btn.syncMobile') }}</el-button>
          <el-button v-permission="'warehouse:order:add'" type="primary" :icon="Plus" @click="openDialog()">{{ $t('order.add') }}</el-button>
        </div>
      </div>
      <el-table :data="list" v-loading="loading" stripe border>
        <el-table-column prop="orderNo" :label="$t('order.no')" width="190" />
        <el-table-column prop="type" :label="$t('order.type')" width="100">
          <template #default="{ row }">
            <el-tag :type="typeColor(row.type)" size="small">{{ translateOrderType(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('order.partner')" width="160">
          <template #default="{ row }">{{ row.customer || row.supplier || (row.fromWh + '→' + row.toWh) }}</template>
        </el-table-column>
        <el-table-column prop="warehouse" :label="$t('order.warehouse')" width="130" />
        <el-table-column prop="expectDate" :label="$t('order.expectDate')" width="120" />
        <el-table-column prop="itemCount" :label="$t('order.itemCount')" width="80" align="right" />
        <el-table-column :label="$t('order.amount')" width="120" align="right">
          <template #default="{ row }">¥{{ row.amount?.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('order.status')" width="100">
          <template #default="{ row }"><el-tag :type="statusColor(row.status)" size="small">{{ translateOrderStatus(row.status) }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="creator" :label="$t('order.creator')" width="90" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewDetail(row)">{{ $t('btn.detail') }}</el-button>
            <el-button v-if="row.status === '待审核'" v-permission="'warehouse:order:audit'" link type="success" @click="audit(row, 'pass')">{{ $t('order.pass') }}</el-button>
            <el-button v-if="row.status === '待审核'" v-permission="'warehouse:order:audit'" link type="danger" @click="audit(row, 'reject')">{{ $t('order.reject') }}</el-button>
            <el-button v-if="row.type === '销售出库' && (row.status === '已审核' || row.status === '已发运')" link type="warning" @click="goTrack(row)">{{ $t('order.trackLogistics') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="mt-16" v-model:current-page="query.page" v-model:page-size="query.pageSize" :total="total" :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next, jumper" background @size-change="load" @current-change="load" />
    </el-card>

    <!-- 单据详情 -->
    <el-dialog v-model="detailVisible" :title="$t('order.detailTitle')" width="640px">
      <el-descriptions v-if="detail" :column="2" border>
        <el-descriptions-item :label="$t('order.no')">{{ detail.orderNo }}</el-descriptions-item>
        <el-descriptions-item :label="$t('order.type')">{{ translateOrderType(detail.type) }}</el-descriptions-item>
        <el-descriptions-item :label="$t('order.partner')">{{ detail.customer || detail.supplier }}</el-descriptions-item>
        <el-descriptions-item :label="$t('order.warehouse')">{{ detail.warehouse }}</el-descriptions-item>
        <el-descriptions-item :label="$t('order.expectDate')">{{ detail.expectDate }}</el-descriptions-item>
        <el-descriptions-item :label="$t('order.status')">{{ translateOrderStatus(detail.status) }}</el-descriptions-item>
        <el-descriptions-item :label="$t('order.creator')">{{ detail.creator }}</el-descriptions-item>
        <el-descriptions-item :label="$t('order.createTime')">{{ detail.createTime }}</el-descriptions-item>
      </el-descriptions>
      <el-table :data="detail?.items || []" class="mt-16" border size="small">
        <el-table-column prop="sku" :label="$t('goods_m.sku')" width="140" />
        <el-table-column prop="name" :label="$t('goods_m.name')" />
        <el-table-column prop="qty" :label="$t('order.itemCount')" width="80" align="right" />
        <el-table-column :label="$t('goods_m.price')" width="100" align="right"><template #default="{ row }">¥{{ row.price?.toLocaleString() }}</template></el-table-column>
        <el-table-column label="小计" width="120" align="right"><template #default="{ row }">¥{{ (row.qty * row.price)?.toLocaleString() }}</template></el-table-column>
      </el-table>
    </el-dialog>

    <!-- 新增单据 -->
    <el-dialog v-model="dialogVisible" :title="$t('order.add')" width="680px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item :label="$t('order.type')" prop="type"><el-select v-model="form.type" style="width:100%" @change="onTypeChange"><el-option v-for="t in orderTypes" :key="t" :label="translateOrderType(t)" :value="t" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="partnerLabel" prop="partner"><el-input v-model="form.partner" :placeholder="partnerLabel" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('order.warehouse')" prop="warehouse"><el-input v-model="form.warehouse" :placeholder="$t('warehouse_m.name')" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('order.expectDate')" prop="expectDate"><el-date-picker v-model="form.expectDate" type="date" value-format="YYYY-MM-DD" style="width:100%" /></el-form-item></el-col>
        </el-row>
        <el-divider content-position="left">{{ $t('goods_m.name') }}明细</el-divider>
        <div v-for="(item, idx) in form.items" :key="idx" class="item-row">
          <el-input v-model="item.sku" :placeholder="$t('goods_m.sku')" style="width: 140px" />
          <el-input v-model="item.name" :placeholder="$t('goods_m.name')" style="flex:1" />
          <el-input-number v-model="item.qty" :min="1" :placeholder="$t('order.itemCount')" style="width: 120px" />
          <el-input-number v-model="item.price" :min="0" :placeholder="$t('goods_m.price')" style="width: 140px" />
          <el-button link type="danger" :icon="Delete" @click="form.items.splice(idx, 1)" />
        </div>
        <el-button :icon="Plus" plain style="width: 100%; margin-top: 8px" @click="form.items.push({ sku: '', name: '', qty: 1, price: 0 })">{{ $t('btn.add') }}{{ $t('goods_m.name') }}</el-button>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">{{ $t('btn.cancel') }}</el-button><el-button type="primary" @click="submit">{{ $t('btn.submit') }}（{{ $t('order.pendingAudit') }}）</el-button></template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Plus, Delete, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { warehouseApi } from '@/api'

const { t } = useI18n()
const router = useRouter()

const ORDER_TYPE_MAP = { '采购入库': 'order.purchaseIn', '销售出库': 'order.salesOut', '调拨单': 'order.transfer', '退货单': 'order.ret' }
function translateOrderType(v) { return ORDER_TYPE_MAP[v] ? t(ORDER_TYPE_MAP[v]) : v }
const ORDER_STATUS_MAP = { '待审核': 'order.pendingAudit', '已审核': 'order.audited', '拣货完成': 'order.picked', '已发运': 'order.shipped', '已完成': 'order.done', '已驳回': 'order.reject' }
function translateOrderStatus(v) { return ORDER_STATUS_MAP[v] ? t(ORDER_STATUS_MAP[v]) : v }

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
  type: [{ required: true, message: t('order.type') + 'message.select', trigger: 'change' }],
  partner: [{ required: true, message: t('order.partner') + 'message.input', trigger: 'blur' }],
  warehouse: [{ required: true, message: t('order.warehouse') + 'message.input', trigger: 'blur' }],
  expectDate: [{ required: true, message: t('order.expectDate') + 'message.select', trigger: 'change' }]
}
const partnerLabel = computed(() => (form.type === '采购入库' ? t('order.supplier') : (form.type === '销售出库' || form.type === '退货单') ? t('order.customer') : '调出方'))

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
  const txt = action === 'pass' ? t('order.pass') : t('order.reject')
  await ElMessageBox.confirm(`${t('header.tip')}${txt}${t('order.no')}「${row.orderNo}」？`, t('btn.audit'), { type: action === 'pass' ? 'success' : 'warning' })
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
    if (!form.items.length || !form.items[0].sku) { ElMessage.warning('请添加至少一条' + t('goods_m.name')); return }
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
  if (res.code === 200) { ElMessage.success(t('btn.syncMobile') + ' ' + res.data.synced + ' ' + t('order.no')); load() }
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
