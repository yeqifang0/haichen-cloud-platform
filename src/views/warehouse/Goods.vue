<template>
  <div class="page-container">
    <el-card shadow="hover">
      <div class="toolbar">
        <div>
          <el-input v-model="query.keyword" :placeholder="$t('goods_m.sku') + '/' + $t('goods_m.name')" clearable style="width: 200px" @keyup.enter="load" />
          <el-select v-model="query.category" :placeholder="$t('goods_m.category')" clearable style="width: 140px; margin-left: 8px" @change="load">
            <el-option v-for="c in categories" :key="c" :label="translateCategory(c)" :value="c" />
          </el-select>
          <el-button type="primary" style="margin-left: 8px" @click="load">{{ $t('btn.search') }}</el-button>
        </div>
        <el-button v-permission="'warehouse:goods:add'" type="primary" :icon="Plus" @click="openDialog()">{{ $t('btn.add') }}{{ $t('goods_m.title') }}</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe border>
        <el-table-column prop="sku" :label="$t('goods_m.sku')" width="140" />
        <el-table-column prop="name" :label="$t('goods_m.name')" min-width="200" show-overflow-tooltip />
        <el-table-column prop="spec" :label="$t('goods_m.spec')" width="140" />
        <el-table-column prop="category" :label="$t('goods_m.category')" width="100">
          <template #default="{ row }">{{ translateCategory(row.category) }}</template>
        </el-table-column>
        <el-table-column prop="unit" :label="$t('goods_m.unit')" width="70">
          <template #default="{ row }">{{ translateUnit(row.unit) }}</template>
        </el-table-column>
        <el-table-column prop="manufacturer" :label="$t('goods_m.manufacturer')" width="120" />
        <el-table-column :label="$t('goods_m.price')" width="110" align="right">
          <template #default="{ row }">¥{{ row.price?.toLocaleString() }}</template>
        </el-table-column>
        <el-table-column :label="$t('field.status')" width="90">
          <template #default="{ row }"><el-tag :type="row.status ? 'success' : 'info'" size="small">{{ row.status ? $t('goods_m.enabled') : $t('goods_m.disabled') }}</el-tag></template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button v-permission="'warehouse:goods:edit'" link type="primary" @click="openDialog(row)">{{ $t('btn.edit') }}</el-button>
            <el-button v-permission="'warehouse:goods:del'" link type="danger" @click="remove(row)">{{ $t('goods_m.disabled') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="mt-16" v-model:current-page="query.page" v-model:page-size="query.pageSize" :total="total" :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next, jumper" background @size-change="load" @current-change="load" />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="form.id ? $t('goods_m.addEdit') : $t('btn.add') + $t('goods_m.title')" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item :label="$t('goods_m.sku')" prop="sku"><el-input v-model="form.sku" placeholder="留空自动生成" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('goods_m.name')" prop="name"><el-input v-model="form.name" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('goods_m.spec')"><el-input v-model="form.spec" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('goods_m.category')" prop="category"><el-select v-model="form.category" style="width:100%"><el-option v-for="c in categories" :key="c" :label="translateCategory(c)" :value="c" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('goods_m.unit')" prop="unit"><el-select v-model="form.unit" style="width:100%"><el-option v-for="u in units" :key="u" :label="translateUnit(u)" :value="u" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('goods_m.manufacturer')"><el-input v-model="form.manufacturer" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('goods_m.price')"><el-input-number v-model="form.price" :min="0" style="width:100%" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item :label="$t('goods_m.storageCond')"><el-input v-model="form.storageCond" /></el-form-item></el-col>
          <el-col :span="24"><el-form-item :label="$t('field.status')"><el-switch v-model="form.status" :active-value="1" :inactive-value="0" :active-text="$t('goods_m.enabled')" :inactive-text="$t('goods_m.disabled')" /></el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer><el-button @click="dialogVisible = false">{{ $t('btn.cancel') }}</el-button><el-button type="primary" @click="submit">{{ $t('btn.save') }}</el-button></template>
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

const CATEGORY_MAP = { '储能设备': 'goods_m.storageDevice', '电力电子': 'goods_m.powerElec', '控制设备': 'goods_m.ctrlDevice', '结构件': 'goods_m.structPart' }
function translateCategory(v) { return CATEGORY_MAP[v] ? t(CATEGORY_MAP[v]) : v }

const UNIT_MAP = { '台': 'goods_m.unit', '套': 'goods_m.unit', '件': 'goods_m.unit', '箱': 'goods_m.unit', '托': 'goods_m.unit' }
function translateUnit(v) { return v }

const categories = ['储能设备', '电力电子', '控制设备', '结构件']
const units = ['台', '套', '件', '箱', '托']
const list = ref([])
const total = ref(0)
const loading = ref(false)
const query = reactive({ page: 1, pageSize: 10, keyword: '', category: '' })
const dialogVisible = ref(false)
const formRef = ref()
const form = reactive({})
const rules = {
  name: [{ required: true, message: t('goods_m.name') + 'message.input', trigger: 'blur' }],
  category: [{ required: true, message: t('goods_m.category') + 'message.select', trigger: 'change' }],
  unit: [{ required: true, message: t('goods_m.unit') + 'message.select', trigger: 'change' }]
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
  await ElMessageBox.confirm(`${t('header.tip')}？`, t('header.tip'), { type: 'warning' })
  const res = await warehouseApi.goods.update({ id: row.id, status: 0 })
  if (res.code === 200) { ElMessage.success(res.msg); load() }
}
load()
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.mt-16 { margin-top: 16px; }
</style>
