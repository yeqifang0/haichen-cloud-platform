<template>
  <div class="page-container">
    <el-card shadow="hover">
      <div class="toolbar">
        <div>
          <el-input v-model="query.keyword" :placeholder="$t('warehouse_m.name') + '/' + $t('warehouse_m.code')" clearable style="width: 200px" @keyup.enter="load" />
          <el-select v-model="query.type" :placeholder="$t('warehouse_m.type')" clearable style="width: 140px; margin-left: 8px" @change="load">
            <el-option v-for="t in whTypes" :key="t" :label="translateWhType(t)" :value="t" />
          </el-select>
          <el-button type="primary" style="margin-left: 8px" @click="load">{{ $t('btn.search') }}</el-button>
        </div>
        <el-button v-permission="'warehouse:goods:add'" type="primary" :icon="Plus" @click="openDialog()">{{ $t('btn.add') }}{{ $t('warehouse_m.title') }}</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe border>
        <el-table-column prop="code" :label="$t('warehouse_m.code')" width="140" />
        <el-table-column prop="name" :label="$t('warehouse_m.name')" width="160" />
        <el-table-column prop="type" :label="$t('warehouse_m.type')" width="100">
          <template #default="{ row }">{{ translateWhType(row.type) }}</template>
        </el-table-column>
        <el-table-column prop="address" :label="$t('warehouse_m.address')" show-overflow-tooltip />
        <el-table-column prop="area" label="面积(㎡)" width="100" />
        <el-table-column prop="manager" :label="$t('warehouse_m.manager')" width="100" />
        <el-table-column prop="phone" :label="$t('warehouse_m.phone')" width="130" />
        <el-table-column :label="$t('field.status')" width="90">
          <template #default="{ row }"><el-tag :type="row.status ? 'success' : 'info'" size="small">{{ row.status ? $t('goods_m.enabled') : $t('goods_m.disabled') }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button v-permission="'warehouse:goods:edit'" link type="primary" @click="openDialog(row)">{{ $t('btn.edit') }}</el-button>
            <el-button v-permission="'warehouse:goods:del'" link type="danger" @click="remove(row)">{{ $t('btn.delete') }}</el-button>
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

    <el-dialog v-model="dialogVisible" :title="form.id ? $t('warehouse_m.addEdit') : $t('btn.add') + $t('warehouse_m.title')" width="560px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item :label="$t('warehouse_m.code')" prop="code"><el-input v-model="form.code" placeholder="WH-XXX" /></el-form-item>
        <el-form-item :label="$t('warehouse_m.name')" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item :label="$t('warehouse_m.type')" prop="type">
          <el-select v-model="form.type" style="width: 100%">
            <el-option v-for="t in whTypes" :key="t" :label="translateWhType(t)" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('warehouse_m.address')" prop="address"><el-input v-model="form.address" /></el-form-item>
        <el-form-item label="面积(㎡)" prop="area"><el-input-number v-model="form.area" :min="0" style="width: 100%" /></el-form-item>
        <el-form-item :label="$t('warehouse_m.manager')" prop="manager"><el-input v-model="form.manager" /></el-form-item>
        <el-form-item :label="$t('warehouse_m.phone')" prop="phone"><el-input v-model="form.phone" /></el-form-item>
        <el-form-item :label="$t('field.status')">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" :active-text="$t('goods_m.enabled')" :inactive-text="$t('goods_m.disabled')" />
        </el-form-item>
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
import { useI18n } from 'vue-i18n'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { warehouseApi } from '@/api'

const { t } = useI18n()

const WH_TYPE_MAP = { '中心仓': 'warehouse_m.center', '区域仓': 'warehouse_m.region', '前置仓': 'warehouse_m.front' }
function translateWhType(v) { return WH_TYPE_MAP[v] ? t(WH_TYPE_MAP[v]) : v }

const whTypes = ['中心仓', '区域仓', '前置仓']
const list = ref([])
const total = ref(0)
const loading = ref(false)
const query = reactive({ page: 1, pageSize: 10, keyword: '', type: '' })
const dialogVisible = ref(false)
const formRef = ref()
const form = reactive({})
const rules = {
  code: [{ required: true, message: t('warehouse_m.code') + 'message.input', trigger: 'blur' }],
  name: [{ required: true, message: t('warehouse_m.name') + 'message.input', trigger: 'blur' }],
  type: [{ required: true, message: t('warehouse_m.type') + 'message.select', trigger: 'change' }],
  address: [{ required: true, message: t('warehouse_m.address') + 'message.input', trigger: 'blur' }],
  area: [{ required: true, message: 'area.message.input', trigger: 'blur' }],
  manager: [{ required: true, message: t('warehouse_m.manager') + 'message.input', trigger: 'blur' }]
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
  await ElMessageBox.confirm(`${t('header.tip')}？`, t('header.tip'), { type: 'warning' })
  const res = await warehouseApi.warehouses.remove(row.id)
  if (res.code === 200) { ElMessage.success(res.msg); load() }
}

load()
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.mt-16 { margin-top: 16px; }
</style>
