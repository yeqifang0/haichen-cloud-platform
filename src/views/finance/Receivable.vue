<template>
  <div class="page-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="16" class="mb-16">
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card stat-blue">
          <div class="stat-icon"><el-icon><Money /></el-icon></div>
          <div class="stat-body">
            <div class="stat-label">应收总额</div>
            <div class="stat-value">¥{{ stats.total.toLocaleString() }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card stat-green">
          <div class="stat-icon"><el-icon><Wallet /></el-icon></div>
          <div class="stat-body">
            <div class="stat-label">已收款</div>
            <div class="stat-value">¥{{ stats.received.toLocaleString() }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="stat-card stat-orange">
          <div class="stat-icon"><el-icon><Timer /></el-icon></div>
          <div class="stat-body">
            <div class="stat-label">待对账金额</div>
            <div class="stat-value">¥{{ stats.pending.toLocaleString() }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover">
      <div class="toolbar">
        <div>
          <el-input v-model="query.keyword" placeholder="客户/单号" clearable style="width: 220px" @keyup.enter="search" />
          <el-select v-model="query.status" placeholder="状态" clearable style="width: 140px; margin-left: 8px" @change="search">
            <el-option v-for="s in statusList" :key="s" :label="s" :value="s" />
          </el-select>
          <el-date-picker v-model="query.period" type="month" placeholder="账期" value-format="YYYY-MM" clearable style="width: 160px; margin-left: 8px" @change="search" />
          <el-button type="primary" style="margin-left: 8px" @click="search">查询</el-button>
        </div>
      </div>

      <el-table :data="list" v-loading="loading" stripe border>
        <el-table-column prop="billNo" label="单号" width="180" />
        <el-table-column prop="customer" label="客户" min-width="160" show-overflow-tooltip />
        <el-table-column prop="orderNo" label="关联订单" width="190" />
        <el-table-column label="金额" width="140" align="right">
          <template #default="{ row }"><span class="amount">¥{{ row.amount?.toLocaleString() }}</span></template>
        </el-table-column>
        <el-table-column prop="period" label="账期" width="110" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }"><el-tag :type="statusColor(row.status)" size="small">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="170" />
        <el-table-column label="操作" width="130" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === '待对账'" link type="primary" @click="doReconcile(row)">对账确认</el-button>
            <el-button v-else-if="row.status === '已对账'" link type="success" @click="doSettle(row)">确认收款</el-button>
            <span v-else class="text-muted">已完成</span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="mt-16" v-model:current-page="query.page" v-model:page-size="query.pageSize" :total="total" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" background @size-change="load" @current-change="load" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { financeApi } from '@/api'

const statusList = ['待对账', '已对账', '已收款']
const list = ref([])
const total = ref(0)
const loading = ref(false)
const query = reactive({ page: 1, pageSize: 10, keyword: '', status: '', period: '' })

// 统计卡片：基于当前列表数据计算
const stats = computed(() => {
  const total = list.value.reduce((s, i) => s + (i.amount || 0), 0)
  const received = list.value.filter((i) => i.status === '已收款').reduce((s, i) => s + (i.amount || 0), 0)
  const pending = list.value.filter((i) => i.status === '待对账').reduce((s, i) => s + (i.amount || 0), 0)
  return { total, received, pending }
})

async function load() {
  loading.value = true
  try {
    const res = await financeApi.receivables.list(query)
    if (res.code === 200) {
      list.value = res.data.list
      total.value = res.data.total
    }
  } finally {
    loading.value = false
  }
}

function search() {
  query.page = 1
  load()
}

async function doReconcile(row) {
  try {
    await ElMessageBox.confirm(`确认对账单据「${row.billNo}」？对账后状态将变更为「已对账」。`, '对账确认', { type: 'warning' })
  } catch {
    return
  }
  const res = await financeApi.reconcile(row.id, 'ar')
  if (res.code === 200) {
    ElMessage.success(res.msg)
    load()
  }
}

async function doSettle(row) {
  try {
    await ElMessageBox.confirm(`确认已收到单据「${row.billNo}」的款项？`, '确认收款', { type: 'success' })
  } catch {
    return
  }
  const res = await financeApi.settle(row.id, 'ar')
  if (res.code === 200) {
    ElMessage.success(res.msg)
    load()
  }
}

function statusColor(s) {
  return { '待对账': 'warning', '已对账': 'primary', '已收款': 'success' }[s] || ''
}

load()
</script>

<style scoped>
.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 16px;
}
.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: #fff;
  flex-shrink: 0;
}
.stat-blue .stat-icon {
  background: linear-gradient(135deg, #1677ff, #0052d9);
}
.stat-green .stat-icon {
  background: linear-gradient(135deg, #52c41a, #389e0d);
}
.stat-orange .stat-icon {
  background: linear-gradient(135deg, #faad14, #d48806);
}
.stat-body {
  flex: 1;
  min-width: 0;
}
.stat-label {
  color: #909399;
  font-size: 13px;
}
.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-top: 4px;
}
.amount {
  font-weight: 600;
  color: #1677ff;
}
.text-muted {
  color: #909399;
  font-size: 13px;
}
</style>
