<template>
  <div class="page-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">调度管理 · 车货匹配</span>
          <el-tag type="primary" size="small" effect="plain">销售出库审核后自动生成运输任务，在此完成车货匹配指派</el-tag>
        </div>
      </template>
      <div class="toolbar">
        <div>
          <el-select v-model="query.status" placeholder="调度状态" clearable style="width: 150px" @change="load">
            <el-option v-for="s in ['待调度','已指派','运输中','已完成']" :key="s" :label="s" :value="s" />
          </el-select>
          <el-button type="primary" style="margin-left: 8px" @click="load">查询</el-button>
        </div>
        <el-button type="primary" :icon="Refresh" @click="load">刷新</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe border>
        <el-table-column prop="dispatchNo" label="调度单号" width="170" />
        <el-table-column prop="shipmentNo" label="关联运单" width="170" />
        <el-table-column label="运输线路" width="160">
          <template #default="{ row }">
            <span class="route-line">{{ row.fromCity }} <el-icon><ArrowRight /></el-icon> {{ row.toCity }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="vehicle" label="车辆" width="130" />
        <el-table-column prop="driver" label="司机" width="100" />
        <el-table-column prop="cargo" label="货物" min-width="150" show-overflow-tooltip />
        <el-table-column prop="weight" label="重量" width="90" align="right" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }"><el-tag :type="statusType(row.status)" size="small">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="130" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === '待调度'" v-permission="'dispatch:assign'" link type="primary" @click="openAssign(row)">指派车辆</el-button>
            <span v-else class="text-muted">—</span>
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

    <el-dialog v-model="assignVisible" :title="`指派车辆 - ${current.dispatchNo}`" width="540px">
      <el-descriptions :column="2" border size="small" class="mb-16">
        <el-descriptions-item label="调度单号">{{ current.dispatchNo }}</el-descriptions-item>
        <el-descriptions-item label="关联运单">{{ current.shipmentNo }}</el-descriptions-item>
        <el-descriptions-item label="运输线路">{{ current.fromCity }} → {{ current.toCity }}</el-descriptions-item>
        <el-descriptions-item label="货物">{{ current.cargo }}</el-descriptions-item>
        <el-descriptions-item label="重量">{{ current.weight }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="statusType(current.status)" size="small">{{ current.status }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <el-form ref="assignFormRef" :model="assignForm" :rules="assignRules" label-width="90px">
        <el-form-item label="选择车辆" prop="vehicle">
          <el-select v-model="assignForm.vehicle" placeholder="请选择空闲车辆" style="width:100%" filterable>
            <el-option
              v-for="v in idleVehicles"
              :key="v.id"
              :label="`${v.plate} · ${v.model} · ${v.capacity}`"
              :value="v.plate"
            />
            <template #empty><el-empty description="暂无空闲车辆" :image-size="40" /></template>
          </el-select>
        </el-form-item>
        <el-form-item label="选择司机" prop="driver">
          <el-select v-model="assignForm.driver" placeholder="请选择司机" style="width:100%" filterable>
            <el-option
              v-for="d in drivers"
              :key="d.id"
              :label="`${d.name} · ${d.license} · ${d.phone}`"
              :value="d.name"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignVisible = false">取消</el-button>
        <el-button type="primary" :loading="assigning" @click="confirmAssign">确认指派</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Refresh, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { dispatchApi } from '@/api'

const list = ref([])
const total = ref(0)
const loading = ref(false)
const query = reactive({ page: 1, pageSize: 10, status: '' })
const assignVisible = ref(false)
const assigning = ref(false)
const assignFormRef = ref()
const assignForm = reactive({ vehicle: '', driver: '' })
const assignRules = {
  vehicle: [{ required: true, message: '请选择车辆', trigger: 'change' }],
  driver: [{ required: true, message: '请选择司机', trigger: 'change' }]
}
const current = reactive({})
const idleVehicles = ref([])
const drivers = ref([])

function statusType(s) {
  return { 待调度: 'warning', 已指派: 'primary', 运输中: 'primary', 已完成: 'success' }[s] || 'info'
}

async function load() {
  loading.value = true
  try {
    const res = await dispatchApi.dispatches(query)
    if (res.code === 200) { list.value = res.data.list; total.value = res.data.total }
  } finally { loading.value = false }
}

async function openAssign(row) {
  Object.keys(current).forEach((k) => delete current[k])
  Object.assign(current, JSON.parse(JSON.stringify(row)))
  assignForm.vehicle = ''
  assignForm.driver = ''
  const [v, d] = await Promise.all([dispatchApi.vehicles.all(), dispatchApi.drivers.all()])
  if (v.code === 200) idleVehicles.value = v.data.filter((x) => x.status === '空闲')
  if (d.code === 200) drivers.value = d.data
  assignVisible.value = true
}

async function confirmAssign() {
  await assignFormRef.value.validate(async (valid) => {
    if (!valid) return
    assigning.value = true
    try {
      const res = await dispatchApi.assign({ id: current.id, vehicle: assignForm.vehicle, driver: assignForm.driver })
      if (res.code === 200) { ElMessage.success(res.msg); assignVisible.value = false; load() }
      else ElMessage.error(res.msg)
    } finally { assigning.value = false }
  })
}

load()
</script>

<style scoped>
.card-header { display: flex; justify-content: space-between; align-items: center; }
.card-title { font-weight: 600; color: #303133; }
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.mt-16 { margin-top: 16px; }
.mb-16 { margin-bottom: 16px; }
.route-line { display: inline-flex; align-items: center; gap: 4px; color: #303133; font-weight: 500; }
.route-line .el-icon { color: #1677ff; }
.text-muted { color: #c0c4cc; }
</style>
