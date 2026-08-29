<template>
  <div class="page-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="16">
      <el-col v-for="c in statCards" :key="c.key" :xs="24" :sm="8">
        <div class="stat-card" :class="c.cls">
          <div class="stat-icon"><el-icon :size="26"><component :is="c.icon" /></el-icon></div>
          <div class="stat-info">
            <div class="stat-label">{{ c.label }}</div>
            <div class="stat-value">{{ c.value }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-card shadow="hover" class="mt-16">
      <div class="toolbar">
        <div>
          <el-select v-model="query.level" placeholder="级别" clearable style="width: 120px" @change="load">
            <el-option v-for="l in levelList" :key="l" :label="l" :value="l" />
          </el-select>
          <el-select v-model="query.type" placeholder="类型" clearable style="width: 140px; margin-left: 8px" @change="load">
            <el-option v-for="t in typeList" :key="t" :label="t" :value="t" />
          </el-select>
          <el-select v-model="query.status" placeholder="状态" clearable style="width: 120px; margin-left: 8px" @change="load">
            <el-option v-for="s in statusList" :key="s" :label="s" :value="s" />
          </el-select>
          <el-button type="primary" style="margin-left: 8px" @click="load">
            <el-icon><Search /></el-icon><span style="margin-left:4px">查询</span>
          </el-button>
        </div>
        <el-tag type="warning" effect="plain" size="small">HC002 智能预警模型融合</el-tag>
      </div>

      <el-table ref="tableRef" :data="list" v-loading="loading" stripe border>
        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="expand-detail">
              <div class="detail-row"><span class="d-label">异常详情：</span>{{ row.content }}</div>
              <el-divider class="d-divider" />
              <div class="detail-row ai-suggest">
                <el-icon class="ai-icon"><MagicStick /></el-icon>
                <div>
                  <div class="suggest-title">HC002智能预警模型推荐方案</div>
                  <div class="suggest-text">{{ row.suggestion }}</div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="级别" width="90">
          <template #default="{ row }"><el-tag :type="levelColor(row.level)" size="small" effect="dark">{{ row.level }}</el-tag></template>
        </el-table-column>
        <el-table-column label="标题" min-width="220">
          <template #default="{ row }">
            <el-button link type="primary" class="title-btn" @click="toggleExpand(row)">{{ row.title }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="110">
          <template #default="{ row }"><el-tag size="small" effect="plain">{{ row.type }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="shipmentNo" label="关联运单" width="170" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }"><el-tag :type="alertStatusColor(row.status)" size="small">{{ row.status }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="handler" label="处理人" width="100">
          <template #default="{ row }">{{ row.handler || '-' }}</template>
        </el-table-column>
        <el-table-column prop="createTime" label="时间" width="150" />
        <el-table-column label="操作" width="130" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === '待处理'" v-permission="'logistics:alert:handle'" link type="primary" @click="openHandle(row)">派单处理</el-button>
            <el-button v-else-if="row.status === '处理中'" v-permission="'logistics:alert:handle'" link type="success" @click="closeRow(row)">闭环</el-button>
            <span v-else class="done-text">已处理</span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="mt-16" v-model:current-page="query.page" v-model:page-size="query.pageSize" :total="total" :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next, jumper" background @size-change="load" @current-change="load" />
    </el-card>

    <!-- 派单处理弹窗 -->
    <el-dialog v-model="handleVisible" title="派单处理" width="560px">
      <el-descriptions v-if="current" :column="1" border size="small" class="mb-16">
        <el-descriptions-item label="预警标题">{{ current.title }}</el-descriptions-item>
        <el-descriptions-item label="异常详情">{{ current.content }}</el-descriptions-item>
      </el-descriptions>
      <el-alert v-if="current" type="warning" :closable="false" class="mb-16">
        <template #title>
          <span class="suggest-title"><el-icon><MagicStick /></el-icon> HC002智能预警模型推荐方案</span>
        </template>
        <div class="suggest-text">{{ current.suggestion }}</div>
      </el-alert>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="处理人" prop="handler">
          <el-input v-model="form.handler" placeholder="请输入处理人姓名" />
        </el-form-item>
        <el-form-item label="处理备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入处理措施/备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitHandle">确认派单</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { logisticsApi } from '@/api'

const levelList = ['严重', '警告', '提示']
const typeList = ['时效异常', '温控异常', '环境预警', '设备异常']
const statusList = ['待处理', '处理中', '已闭环']

const list = ref([])
const total = ref(0)
const loading = ref(false)
const query = reactive({ page: 1, pageSize: 10, status: '', level: '', type: '' })

const tableRef = ref()
const handleVisible = ref(false)
const submitting = ref(false)
const formRef = ref()
const current = ref(null)
const form = reactive({ handler: '', remark: '' })
const rules = {
  handler: [{ required: true, message: '请输入处理人', trigger: 'blur' }]
}

// 全量统计计数（独立于分页列表）
const statAll = reactive({ pending: 0, handling: 0, closed: 0 })
const statCards = computed(() => [
  { key: 'pending', label: '待处理', value: statAll.pending, icon: 'WarningFilled', cls: 'danger' },
  { key: 'handling', label: '处理中', value: statAll.handling, icon: 'Loading', cls: 'warning' },
  { key: 'closed', label: '已闭环', value: statAll.closed, icon: 'CircleCheckFilled', cls: 'success' }
])

async function load() {
  loading.value = true
  try {
    const res = await logisticsApi.alerts(query)
    if (res.code === 200) { list.value = res.data.list; total.value = res.data.total }
  } finally { loading.value = false }
}

async function loadStats() {
  const res = await logisticsApi.alerts({ page: 1, pageSize: 999, status: '', level: '', type: '' })
  if (res.code === 200) {
    const all = res.data.list
    statAll.pending = all.filter((a) => a.status === '待处理').length
    statAll.handling = all.filter((a) => a.status === '处理中').length
    statAll.closed = all.filter((a) => a.status === '已闭环').length
  }
}

function toggleExpand(row) {
  tableRef.value?.toggleRowExpansion(row, undefined)
}

function openHandle(row) {
  current.value = row
  form.handler = ''
  form.remark = ''
  handleVisible.value = true
}

async function submitHandle() {
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    submitting.value = true
    try {
      const res = await logisticsApi.handleAlert({ id: current.value.id, handler: form.handler, remark: form.remark })
      if (res.code === 200) {
        ElMessage.success(res.msg || '已派单处理')
        handleVisible.value = false
        load()
        loadStats()
      } else {
        ElMessage.error(res.msg || '操作失败')
      }
    } finally { submitting.value = false }
  })
}

async function closeRow(row) {
  await ElMessageBox.confirm(`确认将预警「${row.title}」闭环？`, '闭环确认', { type: 'success' })
  const res = await logisticsApi.closeAlert(row.id)
  if (res.code === 200) {
    ElMessage.success(res.msg || '已闭环')
    load()
    loadStats()
  }
}

function levelColor(l) {
  return { 严重: 'danger', 警告: 'warning', 提示: 'info' }[l] || ''
}
function alertStatusColor(s) {
  return { 待处理: 'danger', 处理中: 'warning', 已闭环: 'success' }[s] || ''
}

load()
loadStats()
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.mt-16 { margin-top: 16px; }
.mb-16 { margin-bottom: 16px; }
.stat-card {
  display: flex; align-items: center; gap: 14px;
  background: #fff; border-radius: 10px; padding: 18px 20px;
  box-shadow: 0 1px 4px rgba(0,21,41,0.06); margin-bottom: 16px;
  border-left: 4px solid #dcdfe6; transition: transform 0.2s, box-shadow 0.2s;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,21,41,0.1); }
.stat-card.danger { border-left-color: #ff4d4f; }
.stat-card.warning { border-left-color: #faad14; }
.stat-card.success { border-left-color: #52c41a; }
.stat-icon { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.stat-card.danger .stat-icon { background: rgba(255,77,79,0.1); color: #ff4d4f; }
.stat-card.warning .stat-icon { background: rgba(250,173,20,0.1); color: #faad14; }
.stat-card.success .stat-icon { background: rgba(82,196,26,0.1); color: #52c41a; }
.stat-label { font-size: 13px; color: #909399; }
.stat-value { font-size: 28px; font-weight: 700; color: #303133; line-height: 1.2; }
.title-btn { padding: 0; height: auto; line-height: 1.6; white-space: normal; text-align: left; }
.done-text { color: #c0c4cc; font-size: 13px; }
.expand-detail { padding: 8px 16px 8px 48px; }
.detail-row { font-size: 13px; color: #606266; line-height: 1.8; }
.d-label { color: #909399; }
.d-divider { margin: 10px 0; }
.ai-suggest { display: flex; gap: 8px; align-items: flex-start; background: rgba(250,173,20,0.06); padding: 10px 12px; border-radius: 6px; }
.ai-icon { color: #faad14; font-size: 18px; margin-top: 2px; }
.suggest-title { font-size: 13px; font-weight: 600; color: #d48806; display: flex; align-items: center; gap: 4px; }
.suggest-text { margin-top: 4px; font-size: 13px; color: #606266; }
</style>
