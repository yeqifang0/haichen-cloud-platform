<template>
  <div class="page-container">
    <el-card shadow="hover">
      <div class="toolbar">
        <div>
          <el-input v-model="query.keyword" :placeholder="$t('driver_m.name') + ' / ' + $t('driver_m.phone')" clearable style="width: 220px" @keyup.enter="load" />
          <el-select v-model="query.status" :placeholder="$t('driver_m.status')" clearable style="width: 130px; margin-left: 8px" @change="load">
            <el-option :label="$t('driver_m.onJob')" value="在职" />
            <el-option :label="$t('driver_m.onLeave')" value="休假" />
          </el-select>
          <el-button type="primary" style="margin-left: 8px" @click="load">{{ $t('btn.search') }}</el-button>
        </div>
        <el-button v-permission="'dispatch:assign'" type="primary" :icon="Plus" @click="openDialog()">{{ $t('btn.add') }}</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe border>
        <el-table-column prop="name" :label="$t('driver_m.name')" width="110" />
        <el-table-column prop="phone" :label="$t('driver_m.phone')" width="140" />
        <el-table-column prop="license" :label="$t('driver_m.license')" width="100" />
        <el-table-column prop="plate" :label="$t('driver_m.plate')" width="130" />
        <el-table-column prop="age" :label="$t('driver_m.age')" width="80" align="center" />
        <el-table-column prop="joinDate" :label="$t('driver_m.joinDate')" width="120" />
        <el-table-column :label="$t('driver_m.status')" width="90">
          <template #default="{ row }"><el-tag :type="row.status === '在职' ? 'success' : 'info'" size="small">{{ translateDriverStatus(row.status) }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="trips" :label="$t('driver_m.trips')" width="100" align="right" />
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

    <el-dialog v-model="dialogVisible" :title="form.id ? $t('driver_m.addEdit') : $t('btn.add')" width="560px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item :label="$t('driver_m.name')" prop="name"><el-input v-model="form.name" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('driver_m.phone')" prop="phone"><el-input v-model="form.phone" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('driver_m.license')" prop="license"><el-select v-model="form.license" style="width:100%"><el-option v-for="l in ['A1','A2','B1','B2','C1']" :key="l" :label="l" :value="l" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('driver_m.plate')" prop="plate"><el-input v-model="form.plate" :placeholder="$t('driver_m.plate')" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('driver_m.age')" prop="age"><el-input-number v-model="form.age" :min="18" :max="65" style="width:100%" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('driver_m.joinDate')" prop="joinDate"><el-date-picker v-model="form.joinDate" type="date" value-format="YYYY-MM-DD" style="width:100%" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('driver_m.status')" prop="status"><el-select v-model="form.status" style="width:100%"><el-option :label="$t('driver_m.onJob')" value="在职" /><el-option :label="$t('driver_m.onLeave')" value="休假" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('driver_m.trips')"><el-input-number v-model="form.trips" :min="0" style="width:100%" /></el-form-item></el-col>
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
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { dispatchApi } from '@/api'

const { t } = useI18n()

const list = ref([])
const total = ref(0)
const loading = ref(false)
const query = reactive({ page: 1, pageSize: 10, keyword: '', status: '' })
const dialogVisible = ref(false)
const formRef = ref()
const form = reactive({})
const rules = {
  name: [{ required: true, message: t('driver_m.name'), trigger: 'blur' }],
  phone: [{ required: true, message: t('driver_m.phone'), trigger: 'blur' }],
  license: [{ required: true, message: t('driver_m.license'), trigger: 'change' }],
  plate: [{ required: true, message: t('driver_m.plate'), trigger: 'blur' }],
  age: [{ required: true, message: t('driver_m.age'), trigger: 'blur' }],
  joinDate: [{ required: true, message: t('driver_m.joinDate'), trigger: 'change' }],
  status: [{ required: true, message: t('driver_m.status'), trigger: 'change' }]
}

const DRIVER_STATUS_MAP = { '在职': 'driver_m.onJob', '休假': 'driver_m.onLeave' }
function translateDriverStatus(s) { return DRIVER_STATUS_MAP[s] ? t(DRIVER_STATUS_MAP[s]) : s }

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
  await ElMessageBox.confirm(t('common.confirmDelete'), t('common.confirmTitle'), { type: 'warning' })
  const res = await dispatchApi.drivers.remove(row.id)
  if (res.code === 200) { ElMessage.success(res.msg); load() }
}

load()
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.mt-16 { margin-top: 16px; }
</style>
