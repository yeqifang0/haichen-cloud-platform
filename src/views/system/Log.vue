<template>
  <div class="page-container">
    <el-card shadow="hover">
      <div class="toolbar">
        <div>
          <el-input v-model="query.username" :placeholder="$t('sys.username')" clearable style="width: 150px" @keyup.enter="onSearch" />
          <el-select v-model="query.module" :placeholder="$t('sys.module')" clearable style="width: 140px; margin-left: 8px" @change="onSearch">
            <el-option v-for="m in modules" :key="m" :label="m" :value="m" />
          </el-select>
          <el-select v-model="query.status" :placeholder="$t('sys.status')" clearable style="width: 120px; margin-left: 8px" @change="onSearch">
            <el-option :label="$t('sys.success')" value="成功" />
            <el-option :label="$t('sys.fail')" value="失败" />
          </el-select>
          <el-input v-model="query.keyword" :placeholder="$t('sys.action')" clearable style="width: 200px; margin-left: 8px" @keyup.enter="onSearch" />
          <el-button type="primary" style="margin-left: 8px" :icon="Search" @click="onSearch">{{ $t('btn.search') }}</el-button>
        </div>
        <el-button type="success" :icon="Download" @click="exportLogs">{{ $t('btn.export') }}</el-button>
      </div>
      <el-table :data="list" v-loading="loading" stripe border>
        <el-table-column prop="username" :label="$t('sys.username')" width="120" />
        <el-table-column prop="module" :label="$t('sys.module')" width="120" />
        <el-table-column prop="action" :label="$t('sys.action')" min-width="240" show-overflow-tooltip />
        <el-table-column prop="ip" :label="$t('sys.ip')" width="140" />
        <el-table-column :label="$t('sys.status')" width="90">
          <template #default="{ row }"><el-tag :type="row.status === '成功' ? 'success' : 'danger'" size="small">{{ row.status === '成功' ? $t('sys.success') : $t('sys.fail') }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="time" :label="$t('sys.time')" width="170" sortable />
        <el-table-column :label="$t('field.remark')" min-width="200" show-overflow-tooltip>
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
import { useI18n } from 'vue-i18n'
import { systemApi } from '@/api'

const { t } = useI18n()

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
function exportLogs() { ElMessage.success(t('common.success')) }

load()
</script>
