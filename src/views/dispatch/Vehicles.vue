<template>
  <div class="page-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="16">
      <el-col v-for="card in stats" :key="card.labelKey" :xs="12" :sm="6">
        <div class="stat-card" :style="{ background: card.bg }">
          <div class="stat-icon" :style="{ color: card.color }">
            <el-icon :size="26"><component :is="card.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ card.value }}<small>{{ card.unit }}</small></div>
            <div class="stat-label">{{ t(card.labelKey) }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-card shadow="hover" class="mt-16">
      <div class="toolbar">
        <div>
          <el-input v-model="query.keyword" :placeholder="$t('vehicle.plate') + ' / ' + $t('vehicle.model')" clearable style="width: 200px" @keyup.enter="load" />
          <el-select v-model="query.type" :placeholder="$t('field.type')" clearable style="width: 130px; margin-left: 8px" @change="load">
            <el-option :label="$t('vehicle.self')" value="自有" />
            <el-option :label="$t('vehicle.affiliated')" value="挂靠" />
          </el-select>
          <el-select v-model="query.status" :placeholder="$t('vehicle.status')" clearable style="width: 130px; margin-left: 8px" @change="load">
            <el-option v-for="s in ['运输中','空闲','维修']" :key="s" :label="translateVehicleStatus(s)" :value="s" />
          </el-select>
          <el-button type="primary" style="margin-left: 8px" @click="load">{{ $t('btn.search') }}</el-button>
        </div>
        <el-button v-permission="'dispatch:assign'" type="primary" :icon="Plus" @click="openDialog()">{{ $t('btn.add') }}</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe border>
        <el-table-column prop="plate" :label="$t('vehicle.plate')" width="130" />
        <el-table-column :label="$t('field.type')" width="90">
          <template #default="{ row }"><el-tag :type="row.type === '自有' ? 'primary' : 'warning'" size="small">{{ translateVehicleType(row.type) }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="model" :label="$t('vehicle.model')" min-width="180" show-overflow-tooltip />
        <el-table-column prop="capacity" :label="$t('vehicle.capacity')" width="100" />
        <el-table-column prop="driver" :label="$t('vehicle.driver')" width="100" />
        <el-table-column prop="phone" :label="$t('vehicle.phone')" width="130" />
        <el-table-column :label="$t('vehicle.gps')" width="90">
          <template #default="{ row }"><el-tag :type="row.gps === '在线' ? 'success' : 'info'" size="small" effect="plain">{{ translateGps(row.gps) }}</el-tag></template>
        </el-table-column>
        <el-table-column :label="$t('vehicle.status')" width="100">
          <template #default="{ row }"><el-tag :type="statusType(row.status)" size="small">{{ translateVehicleStatus(row.status) }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="lastUpdate" :label="$t('vehicle.lastUpdate')" width="160" />
        <el-table-column :label="$t('btn.edit')" width="150" fixed="right">
          <template #default="{ row }">
            <el-button v-permission="'dispatch:assign'" link type="primary" @click="openDialog(row)">{{ $t('btn.edit') }}</el-button>
            <el-button v-permission="'dispatch:assign'" link type="danger" @click="remove(row)">{{ $t('btn.delete') }}</el-button>
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

    <el-dialog v-model="dialogVisible" :title="form.id ? $t('vehicle.addEdit') : $t('btn.add')" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item :label="$t('vehicle.plate')" prop="plate"><el-input v-model="form.plate" :placeholder="$t('vehicle.plate')" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('field.type')" prop="type"><el-select v-model="form.type" style="width:100%"><el-option :label="$t('vehicle.self')" value="自有" /><el-option :label="$t('vehicle.affiliated')" value="挂靠" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('vehicle.model')" prop="model"><el-input v-model="form.model" :placeholder="$t('vehicle.model')" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('vehicle.capacity')" prop="capacity"><el-input v-model="form.capacity" :placeholder="$t('vehicle.capacity')" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('vehicle.driver')" prop="driver"><el-input v-model="form.driver" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('vehicle.phone')" prop="phone"><el-input v-model="form.phone" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('vehicle.status')" prop="status"><el-select v-model="form.status" style="width:100%"><el-option v-for="s in ['运输中','空闲','维修']" :key="s" :label="translateVehicleStatus(s)" :value="s" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('vehicle.gps')" prop="gps"><el-select v-model="form.gps" style="width:100%"><el-option :label="$t('vehicle.online')" value="在线" /><el-option :label="$t('vehicle.offline')" value="离线" /></el-select></el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" @click="submit">{{ $t('btn.save') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { dispatchApi } from '@/api'

const { t } = useI18n()

const list = ref([])
const total = ref(0)
const loading = ref(false)
const allVehicles = ref([])
const query = reactive({ page: 1, pageSize: 10, keyword: '', type: '', status: '' })
const dialogVisible = ref(false)
const formRef = ref()
const form = reactive({})
const rules = {
  plate: [{ required: true, message: t('vehicle.plate'), trigger: 'blur' }],
  type: [{ required: true, message: t('field.type'), trigger: 'change' }],
  model: [{ required: true, message: t('vehicle.model'), trigger: 'blur' }],
  capacity: [{ required: true, message: t('vehicle.capacity'), trigger: 'blur' }],
  driver: [{ required: true, message: t('vehicle.driver'), trigger: 'blur' }],
  phone: [{ required: true, message: t('vehicle.phone'), trigger: 'blur' }],
  status: [{ required: true, message: t('vehicle.status'), trigger: 'change' }],
  gps: [{ required: true, message: t('vehicle.gps'), trigger: 'change' }]
}

const stats = computed(() => [
  { labelKey: 'vehicle.title', value: allVehicles.value.length, unit: '', icon: 'Van', color: '#1677ff', bg: 'linear-gradient(135deg,#e6f4ff,#bae0ff)' },
  { labelKey: 'vehicle.self', value: allVehicles.value.filter((v) => v.type === '自有').length, unit: '', icon: 'OfficeBuilding', color: '#52c41a', bg: 'linear-gradient(135deg,#f6ffed,#d9f7be)' },
  { labelKey: 'vehicle.affiliated', value: allVehicles.value.filter((v) => v.type === '挂靠').length, unit: '', icon: 'Connection', color: '#faad14', bg: 'linear-gradient(135deg,#fffbe6,#fff1b8)' },
  { labelKey: 'vehicle.inTransit', value: allVehicles.value.filter((v) => v.status === '运输中').length, unit: '', icon: 'Position', color: '#722ed1', bg: 'linear-gradient(135deg,#f9f0ff,#efdbff)' }
])

const VEHICLE_TYPE_MAP = { '自有': 'vehicle.self', '挂靠': 'vehicle.affiliated' }
function translateVehicleType(s) { return VEHICLE_TYPE_MAP[s] ? t(VEHICLE_TYPE_MAP[s]) : s }

const VEHICLE_STATUS_MAP = { '运输中': 'vehicle.inTransit', '空闲': 'vehicle.idle', '维修': 'vehicle.repairing' }
function translateVehicleStatus(s) { return VEHICLE_STATUS_MAP[s] ? t(VEHICLE_STATUS_MAP[s]) : s }

const GPS_MAP = { '在线': 'vehicle.online', '离线': 'vehicle.offline' }
function translateGps(s) { return GPS_MAP[s] ? t(GPS_MAP[s]) : s }

function statusType(s) {
  return { 运输中: 'primary', 空闲: 'success', 维修: 'danger' }[s] || 'info'
}

async function loadStats() {
  const res = await dispatchApi.vehicles.all()
  if (res.code === 200) allVehicles.value = res.data
}

async function load() {
  loading.value = true
  try {
    const res = await dispatchApi.vehicles.list(query)
    if (res.code === 200) { list.value = res.data.list; total.value = res.data.total }
  } finally { loading.value = false }
  loadStats()
}

function openDialog(row) {
  Object.keys(form).forEach((k) => delete form[k])
  if (row) Object.assign(form, JSON.parse(JSON.stringify(row)))
  else Object.assign(form, { plate: '', type: '自有', model: '', capacity: '', driver: '', phone: '', status: '空闲', gps: '在线', lastUpdate: '' })
  dialogVisible.value = true
}

async function submit() {
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    if (!form.lastUpdate) form.lastUpdate = now()
    const res = form.id ? await dispatchApi.vehicles.update(form) : await dispatchApi.vehicles.create(form)
    if (res.code === 200) { ElMessage.success(res.msg); dialogVisible.value = false; load() }
    else ElMessage.error(res.msg)
  })
}

async function remove(row) {
  await ElMessageBox.confirm(t('common.confirmDelete'), t('common.confirmTitle'), { type: 'warning' })
  const res = await dispatchApi.vehicles.remove(row.id)
  if (res.code === 200) { ElMessage.success(res.msg); load() }
}

function now() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

load()
</script>

<style scoped>
.stat-card {
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}
.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: #303133;
  line-height: 1.3;
}
.stat-value small {
  font-size: 13px;
  font-weight: normal;
  color: #909399;
  margin-left: 2px;
}
.stat-label {
  font-size: 13px;
  color: #606266;
}
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.mt-16 { margin-top: 16px; }
</style>
