<template>
  <div class="page-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="16">
      <el-col v-for="c in statCards" :key="c.key" :xs="24" :sm="8">
        <div class="stat-card" :class="c.cls">
          <div class="stat-icon"><el-icon :size="26"><component :is="c.icon" /></el-icon></div>
          <div class="stat-info">
            <div class="stat-label">{{ t(c.labelKey) }}</div>
            <div class="stat-value">{{ c.value }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-card shadow="hover" class="mt-16">
      <div class="toolbar">
        <div>
          <el-select v-model="query.level" :placeholder="$t('alert.level')" clearable style="width: 120px" @change="load">
            <el-option v-for="l in levelList" :key="l" :label="translateLevel(l)" :value="l" />
          </el-select>
          <el-select v-model="query.type" :placeholder="$t('alert.type')" clearable style="width: 140px; margin-left: 8px" @change="load">
            <el-option v-for="t in typeList" :key="t" :label="t" :value="t" />
          </el-select>
          <el-select v-model="query.status" :placeholder="$t('alert.status')" clearable style="width: 120px; margin-left: 8px" @change="load">
            <el-option v-for="s in statusList" :key="s" :label="translateAlertStatus(s)" :value="s" />
          </el-select>
          <el-button type="primary" style="margin-left: 8px" @click="load">
            <el-icon><Search /></el-icon><span style="margin-left:4px">{{ $t('btn.search') }}</span>
          </el-button>
        </div>
      </div>

      <el-table ref="tableRef" :data="list" v-loading="loading" stripe border>
        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="expand-detail">
              <div class="detail-row"><span class="d-label">{{ $t('alert.detail') }}：</span>{{ row.content }}</div>
              <el-divider class="d-divider" />
              <div class="detail-row ai-suggest">
                <el-icon class="ai-icon"><MagicStick /></el-icon>
                <div>
                  <div class="suggest-title">{{ $t('alert.suggestion') }}</div>
                  <div class="suggest-text">{{ row.suggestion }}</div>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="level" :label="$t('alert.level')" width="90">
          <template #default="{ row }"><el-tag :type="levelColor(row.level)" size="small" effect="dark">{{ translateLevel(row.level) }}</el-tag></template>
        </el-table-column>
        <el-table-column :label="$t('alert.titleField')" min-width="220">
          <template #default="{ row }">
            <el-button link type="primary" class="title-btn" @click="toggleExpand(row)">{{ row.title }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="type" :label="$t('alert.type')" width="110">
          <template #default="{ row }"><el-tag size="small" effect="plain">{{ row.type }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="shipmentNo" :label="$t('dispatch.shipNo')" width="170" />
        <el-table-column :label="$t('alert.status')" width="100">
          <template #default="{ row }"><el-tag :type="alertStatusColor(row.status)" size="small">{{ translateAlertStatus(row.status) }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="handler" :label="$t('alert.handler')" width="100">
          <template #default="{ row }">{{ row.handler || '-' }}</template>
        </el-table-column>
        <el-table-column prop="createTime" :label="$t('field.createTime')" width="150" />
        <el-table-column :label="$t('btn.handle')" width="130" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === '待处理'" v-permission="'logistics:alert:handle'" link type="primary" @click="openHandle(row)">{{ $t('alert.handle') }}</el-button>
            <el-button v-else-if="row.status === '处理中'" v-permission="'logistics:alert:handle'" link type="success" @click="closeRow(row)">{{ $t('alert.closed') }}</el-button>
            <span v-else class="done-text">{{ $t('alert.closed') }}</span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="mt-16" v-model:current-page="query.page" v-model:page-size="query.pageSize" :total="total" :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next, jumper" background @size-change="load" @current-change="load" />
    </el-card>

    <!-- 派单处理弹窗 -->
    <el-dialog v-model="handleVisible" :title="$t('alert.handle')" width="560px">
      <el-descriptions v-if="current" :column="1" border size="small" class="mb-16">
        <el-descriptions-item :label="$t('alert.titleField')">{{ current.title }}</el-descriptions-item>
        <el-descriptions-item :label="$t('alert.detail')">{{ current.content }}</el-descriptions-item>
      </el-descriptions>
      <el-alert v-if="current" type="warning" :closable="false" class="mb-16">
        <template #title>
          <span class="suggest-title"><el-icon><MagicStick /></el-icon> {{ $t('alert.suggestion') }}</span>
        </template>
        <div class="suggest-text">{{ current.suggestion }}</div>
      </el-alert>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item :label="$t('alert.handler')" prop="handler">
          <el-input v-model="form.handler" :placeholder="$t('alert.handler')" />
        </el-form-item>
        <el-form-item :label="$t('field.remark')" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="3" :placeholder="$t('field.remark')" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="handleVisible = false">{{ $t('btn.cancel') }}</el-button>
        <el-button type="primary" :loading="submitting" @click="submitHandle">{{ $t('btn.submit') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, MagicStick } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { logisticsApi } from '@/api'

const { t } = useI18n()

const levelList = ['严重', '警告', '提示']
const typeList = ['时效异常', '温控异常', '环境预警', '设备异常']
const statusList = ['待处理', '处理中', '已闭环']

const LEVEL_MAP = { '严重': 'alert.severe', '警告': 'alert.warn', '提示': 'alert.tip' }
function translateLevel(l) { return LEVEL_MAP[l] ? t(LEVEL_MAP[l]) : l }

const ALERT_STATUS_MAP = { '待处理': 'alert.pending', '处理中': 'alert.handling', '已闭环': 'alert.closed' }
function translateAlertStatus(s) { return ALERT_STATUS_MAP[s] ? t(ALERT_STATUS_MAP[s]) : s }

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
  handler: [{ required: true, message: t('alert.handler'), trigger: 'blur' }]
}

const statAll = reactive({ pending: 0, handling: 0, closed: 0 })
const statCards = computed(() => [
  { key: 'pending', labelKey: 'alert.pending', value: statAll.pending, icon: 'WarningFilled', cls: 'danger' },
  { key: 'handling', labelKey: 'alert.handling', value: statAll.handling, icon: 'Loading', cls: 'warning' },
  { key: 'closed', labelKey: 'alert.closed', value: statAll.closed, icon: 'CircleCheckFilled', cls: 'success' }
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
        ElMessage.success(res.msg || t('common.success'))
        handleVisible.value = false
        load()
        loadStats()
      } else {
        ElMessage.error(res.msg || t('common.fail'))
      }
    } finally { submitting.value = false }
  })
}

async function closeRow(row) {
  await ElMessageBox.confirm(t('common.confirmDelete'), t('common.confirmTitle'), { type: 'success' })
  const res = await logisticsApi.closeAlert(row.id)
  if (res.code === 200) {
    ElMessage.success(res.msg || t('common.success'))
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
