<template>
  <div class="page-container">
    <el-card shadow="hover">
      <div class="toolbar">
        <div>
          <el-input v-model="query.keyword" placeholder="SKU/货品名称" clearable style="width: 200px" @keyup.enter="load" />
          <el-select v-model="query.warehouseId" placeholder="仓库" clearable style="width: 160px; margin-left: 8px" @change="load">
            <el-option v-for="w in warehouses" :key="w.id" :label="w.name" :value="w.id" />
          </el-select>
          <el-button type="primary" style="margin-left: 8px" @click="load">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
        <el-button type="success" :icon="Download" plain @click="exportData">导出Excel</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe border>
        <el-table-column prop="sku" label="SKU编码" width="140" />
        <el-table-column prop="goodsName" label="货品名称" min-width="200" show-overflow-tooltip />
        <el-table-column prop="batch" label="批次号" width="110" />
        <el-table-column prop="warehouse" label="仓库" width="130" />
        <el-table-column prop="zone" label="库区" width="110" />
        <el-table-column prop="location" label="库位" width="100" />
        <el-table-column prop="stock" label="在库数量" width="100" align="right" />
        <el-table-column prop="locked" label="锁定数量" width="100" align="right" />
        <el-table-column label="可用数量" width="100" align="right">
          <template #default="{ row }"><span :style="{ color: row.available < 20 ? '#ff4d4f' : '#303133', fontWeight: row.available < 20 ? 600 : 400 }">{{ row.available }}</span></template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.available < 20" type="danger" size="small">库存不足</el-tag>
            <el-tag v-else type="success" size="small">正常</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="最后更新" width="160" />
      </el-table>
      <el-pagination class="mt-16" v-model:current-page="query.page" v-model:page-size="query.pageSize" :total="total" :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next, jumper" background @size-change="load" @current-change="load" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { warehouseApi } from '@/api'

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
function exportData() { ElMessage.success('已导出当前库存列表为 Excel（演示）') }

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
