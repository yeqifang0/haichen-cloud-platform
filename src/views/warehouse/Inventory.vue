<template>
  <div class="page-container">
    <el-card shadow="hover">
      <div class="toolbar">
        <div>
          <el-input v-model="query.keyword" :placeholder="$t('goods_m.sku') + '/' + $t('goods_m.name')" clearable style="width: 200px" @keyup.enter="load" />
          <el-select v-model="query.warehouseId" :placeholder="$t('inventory.warehouse')" clearable style="width: 160px; margin-left: 8px" @change="load">
            <el-option v-for="w in warehouses" :key="w.id" :label="w.name" :value="w.id" />
          </el-select>
          <el-button type="primary" style="margin-left: 8px" @click="load">{{ $t('btn.search') }}</el-button>
          <el-button @click="reset">{{ $t('btn.reset') }}</el-button>
        </div>
        <el-button type="success" :icon="Download" plain @click="exportData">{{ $t('btn.export') }}Excel</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe border>
        <el-table-column prop="sku" :label="$t('goods_m.sku')" width="140" />
        <el-table-column prop="goodsName" :label="$t('goods_m.name')" min-width="200" show-overflow-tooltip />
        <el-table-column prop="batch" :label="$t('inventory.batch')" width="110" />
        <el-table-column prop="warehouse" :label="$t('inventory.warehouse')" width="130" />
        <el-table-column prop="zone" :label="$t('inventory.zone')" width="110" />
        <el-table-column prop="location" :label="$t('inventory.location')" width="100" />
        <el-table-column prop="stock" :label="$t('inventory.inStock')" width="100" align="right" />
        <el-table-column prop="locked" :label="$t('inventory.locked') + $t('order.itemCount')" width="100" align="right" />
        <el-table-column :label="$t('inventory.available')" width="100" align="right">
          <template #default="{ row }"><span :style="{ color: row.available < 20 ? '#ff4d4f' : '#303133', fontWeight: row.available < 20 ? 600 : 400 }">{{ row.available }}</span></template>
        </el-table-column>
        <el-table-column :label="$t('field.status')" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.available < 20" type="danger" size="small">{{ $t('inventory.noStock') }}</el-tag>
            <el-tag v-else type="success" size="small">{{ $t('sys.enabled') }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" :label="$t('field.updateTime')" width="160" />
      </el-table>
      <el-pagination class="mt-16" v-model:current-page="query.page" v-model:page-size="query.pageSize" :total="total" :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next, jumper" background @size-change="load" @current-change="load" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { warehouseApi } from '@/api'

const { t } = useI18n()

const list = ref([])
const total = ref(0)
const loading = ref(false)
const warehouses = ref([])
const query = reactive({ page: 1, pageSize: 10, keyword: '', warehouseId: '' })

async function load() {
  loading.value = true
  try { const res = await warehouseApi.inventory(query); if (res.code === 200) { list.value = res.data.list; total.value = res.data.total } } finally { loading.value = false }
}
function reset() { query.keyword = ''; query.warehouseId = ''; query.page = 1; load() }
function exportData() { ElMessage.success(t('btn.export')) }

onMounted(async () => {
  const w = await warehouseApi.warehouses.all()
  if (w.code === 200) warehouses.value = w.data
  load()
})
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.mt-16 { margin-top: 16px; }
</style>
