<template>
  <div class="page-container">
    <el-card shadow="hover">
      <div class="toolbar">
        <div>
          <el-input v-model="query.username" placeholder="操作用户" clearable style="width: 150px" @keyup.enter="onSearch" />
          <el-select v-model="query.module" placeholder="模块" clearable style="width: 140px; margin-left: 8px" @change="onSearch">
            <el-option v-for="m in modules" :key="m" :label="m" :value="m" />
          </el-select>
          <el-select v-model="query.status" placeholder="状态" clearable style="width: 120px; margin-left: 8px" @change="onSearch">
            <el-option label="成功" value="成功" />
            <el-option label="失败" value="失败" />
          </el-select>
          <el-input v-model="query.keyword" placeholder="操作内容关键词" clearable style="width: 200px; margin-left: 8px" @keyup.enter="onSearch" />
          <el-button type="primary" style="margin-left: 8px" :icon="Search" @click="onSearch">查询</el-button>
        </div>
        <el-button type="success" :icon="Download" @click="exportLogs">导出</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe border>
        <el-table-column prop="username" label="操作用户" width="120" />
        <el-table-column prop="module" label="模块" width="120" />
        <el-table-column prop="action" label="操作内容" min-width="240" show-overflow-tooltip />
        <el-table-column prop="ip" label="IP地址" width="140" />
        <el-table-column label="状态" width="90">
          <template #default="{ row }"><el-tag :type="row.status === '成功' ? 'success' : 'danger'" size="small">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="time" label="操作时间" width="170" sortable />
        <el-table-column label="备注" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">{{ row.remark || '—' }}</template>
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
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Search, Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { systemApi } from '@/api'

const modules = ['系统管理', '仓储管理', '物流管理', '财务对账', '车辆调度']
const list = ref([])
const total = ref(0)
const loading = ref(false)
const query = reactive({ page: 1, pageSize: 10, username: '', module: '', status: '', keyword: '' })

async function load() {
  loading.value = true
  try {
    const res = await systemApi.logs(query)
    if (res.code === 200) {
      const arr = (res.data.list || []).slice()
      arr.sort((a, b) => (b.time > a.time ? 1 : b.time < a.time ? -1 : 0))
      list.value = arr
      total.value = res.data.total
    }
  } finally { loading.value = false }
}
function onSearch() { query.page = 1; load() }
function exportLogs() { ElMessage.success('日志导出成功（演示功能）') }

load()
</script>
