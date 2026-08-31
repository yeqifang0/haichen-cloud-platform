<template>
  <div class="page-container">
    <el-card shadow="hover">
      <div class="toolbar">
        <div>
          <el-input v-model="query.keyword" :placeholder="$t('track.trackingNo')" clearable style="width: 220px" @keyup.enter="load">
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
          <el-select v-model="query.status" :placeholder="$t('field.status')" clearable style="width: 130px; margin-left: 8px" @change="load">
            <el-option v-for="s in statusList" :key="s" :label="translateShipStatus(s)" :value="s" />
          </el-select>
          <el-select v-model="query.mode" :placeholder="$t('field.type')" clearable style="width: 130px; margin-left: 8px" @change="load">
            <el-option v-for="m in modeList" :key="m" :label="translateTransport(m)" :value="m" />
          </el-select>
          <el-button type="primary" style="margin-left: 8px" @click="load">
            <el-icon><Search /></el-icon><span style="margin-left:4px">{{ $t('btn.search') }}</span>
          </el-button>
        </div>
      </div>

      <el-table :data="list" v-loading="loading" stripe border @row-click="showTrack">
        <el-table-column prop="trackingNo" :label="$t('track.trackingNo')" width="180" />
        <el-table-column :label="$t('dispatch.fromCity') + ' → ' + $t('dispatch.toCity')" min-width="150">
          <template #default="{ row }"><span class="route">{{ row.fromCity }} → {{ row.toCity }}</span></template>
        </el-table-column>
        <el-table-column prop="mode" :label="$t('field.type')" width="80">
          <template #default="{ row }"><el-tag size="small" :type="modeColor(row.mode)" effect="plain">{{ translateTransport(row.mode) }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="carrier" :label="$t('track.carrier')" min-width="150" show-overflow-tooltip />
        <el-table-column prop="vehicle" :label="$t('track.vehicle')" width="120" />
        <el-table-column :label="$t('track.progress')" width="190">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" :stroke-width="8" :status="row.progress === 100 ? 'success' : ''" />
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('field.status')" width="100">
          <template #default="{ row }"><el-tag :type="statusColor(row.status)" size="small">{{ translateShipStatus(row.status) }}</el-tag></template>
        </el-table-column>
        <el-table-column prop="eta" :label="$t('dashboard.eta')" width="150" />
        <el-table-column :label="$t('btn.track')" width="90" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click.stop="showTrack(row)">{{ $t('btn.track') }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="mt-16" v-model:current-page="query.page" v-model:page-size="query.pageSize" :total="total" :page-sizes="[10,20,50]" layout="total, sizes, prev, pager, next, jumper" background @size-change="load" @current-change="load" />
    </el-card>

    <!-- 物流轨迹抽屉 -->
    <el-drawer v-model="drawerVisible" :title="$t('btn.track') + ' · ' + (current?.trackingNo || '')" size="460px" direction="rtl">
      <div v-if="current" class="track-head">
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item :label="$t('track.trackingNo')">{{ current.trackingNo }}</el-descriptions-item>
          <el-descriptions-item :label="$t('dispatch.fromCity') + ' → ' + $t('dispatch.toCity')">{{ current.fromCity }} → {{ current.toCity }}（{{ translateTransport(current.mode) }}）</el-descriptions-item>
          <el-descriptions-item :label="$t('track.carrier')">{{ current.carrier }}（{{ current.vehicle }}）</el-descriptions-item>
          <el-descriptions-item :label="$t('field.status')">
            <el-tag :type="statusColor(current.status)" size="small">{{ translateShipStatus(current.status) }}</el-tag>
            <span class="progress-text">{{ $t('track.progress') }} {{ current.progress }}%</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div v-loading="trackLoading" class="track-body">
        <el-timeline v-if="trackPoints.length">
          <el-timeline-item v-for="(p, i) in trackPoints" :key="i" :timestamp="p.time" placement="top" :type="pointType(p.status)" :hollow="p.status === 'pending'">
            <div class="track-item" :class="{ active: p.status === 'active' }">
              <div class="track-loc">
                <el-icon class="loc-icon"><LocationInformation /></el-icon>
                <span class="loc-text">{{ p.location }}</span>
              </div>
              <div class="track-desc">{{ p.desc }}</div>
            </div>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else :description="$t('common.noData')" />
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, LocationInformation } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { logisticsApi } from '@/api'

const { t } = useI18n()

const statusList = ['运输中', '已签收', '待发运', '待指派']
const modeList = ['陆运', '空运', '海运']

const SHIP_STATUS_MAP = { '运输中': 'shipmentStatus.inTransit', '已签收': 'shipmentStatus.delivered', '待发运': 'shipmentStatus.pendingShip', '待指派': 'shipmentStatus.pendingAssign' }
function translateShipStatus(s) { return SHIP_STATUS_MAP[s] ? t(SHIP_STATUS_MAP[s]) : s }

const TRANSPORT_MAP = { '陆运': 'transport.road', '空运': 'transport.air', '海运': 'transport.sea' }
function translateTransport(m) { return TRANSPORT_MAP[m] ? t(TRANSPORT_MAP[m]) : m }

const list = ref([])
const total = ref(0)
const loading = ref(false)
const query = reactive({ page: 1, pageSize: 10, keyword: '', status: '', mode: '', customer: '' })

const drawerVisible = ref(false)
const trackLoading = ref(false)
const current = ref(null)
const trackPoints = ref([])

async function load() {
  loading.value = true
  try {
    const res = await logisticsApi.shipments(query)
    if (res.code === 200) { list.value = res.data.list; total.value = res.data.total }
  } finally { loading.value = false }
}

async function showTrack(row) {
  current.value = row
  drawerVisible.value = true
  trackLoading.value = true
  trackPoints.value = []
  try {
    const res = await logisticsApi.track(row.trackingNo)
    if (res.code === 200) trackPoints.value = res.data
    else ElMessage.warning(res.msg || t('common.fail'))
  } finally { trackLoading.value = false }
}

function statusColor(s) {
  return { 运输中: 'primary', 已签收: 'success', 待发运: 'info', 待指派: 'warning' }[s] || 'info'
}
function modeColor(m) {
  return { 陆运: 'primary', 空运: 'success', 海运: 'warning' }[m] || ''
}
function pointType(s) {
  return { done: 'success', active: 'primary', pending: 'info' }[s] || 'info'
}

load()
</script>

<style scoped>
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.mt-16 { margin-top: 16px; }
.route { font-weight: 500; color: #303133; }
.track-head { margin-bottom: 16px; }
.progress-text { margin-left: 8px; color: #909399; font-size: 12px; }
.track-body { padding: 0 4px; }
.track-item { padding: 4px 0; }
.track-item.active {
  background: linear-gradient(90deg, rgba(22,119,255,0.08), rgba(22,119,255,0));
  border-radius: 6px;
  padding: 8px 10px;
}
.track-loc { display: flex; align-items: center; gap: 6px; font-weight: 600; color: #303133; }
.loc-icon { color: #1677ff; }
.loc-text { font-size: 14px; }
.cur-tag { margin-left: 4px; }
.track-desc { margin-top: 4px; padding-left: 22px; font-size: 13px; color: #606266; }
</style>
