<template>
  <div class="page-container" v-loading="loading">
    <!-- 顶部大数字卡片 -->
    <el-row :gutter="16" class="mb-16">
      <el-col :span="6">
        <div class="big-card big-blue">
          <div class="big-head"><el-icon><TrendCharts /></el-icon><span>{{ $t('finance.receivable') }}</span></div>
          <div class="big-value">¥{{ data.arTotal?.toLocaleString() }}</div>
          <div class="big-sub">{{ $t('finance.received') }} ¥{{ data.arReceived?.toLocaleString() }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="big-card big-red">
          <div class="big-head"><el-icon><Coin /></el-icon><span>{{ $t('finance.payable') }}</span></div>
          <div class="big-value">¥{{ data.apTotal?.toLocaleString() }}</div>
          <div class="big-sub">{{ $t('finance.paid') }} ¥{{ data.apPaid?.toLocaleString() }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="big-card big-green">
          <div class="big-head"><el-icon><Wallet /></el-icon><span>{{ $t('finance.summary') }}</span></div>
          <div class="big-value">{{ netCash >= 0 ? '+' : '-' }}¥{{ Math.abs(netCash).toLocaleString() }}</div>
          <div class="big-sub">{{ $t('finance.received') }} - {{ $t('finance.paid') }}</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="big-card big-purple">
          <div class="big-head"><el-icon><DataLine /></el-icon><span>{{ $t('analytics.slaRate') }}</span></div>
          <div class="big-value">{{ recoverRate }}%</div>
          <div class="big-sub">{{ $t('finance.received') }} / {{ $t('finance.receivable') }}</div>
        </div>
      </el-col>
    </el-row>

    <!-- 应收 / 应付结构 -->
    <el-row :gutter="16" class="mb-16">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><div class="card-header">{{ $t('finance.receivable') }}</div></template>
          <div class="struct-line">
            <div class="struct-info"><span>{{ $t('finance.received') }}</span><span class="amt green">¥{{ data.arReceived?.toLocaleString() }}</span></div>
            <el-progress :percentage="arRate" color="#52c41a" :stroke-width="14" />
          </div>
          <div class="struct-line">
            <div class="struct-info"><span>{{ $t('finance.pendingRecv') }}</span><span class="amt orange">¥{{ data.arPending?.toLocaleString() }}</span></div>
            <el-progress :percentage="100 - arRate" color="#faad14" :stroke-width="14" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header><div class="card-header">{{ $t('finance.payable') }}</div></template>
          <div class="struct-line">
            <div class="struct-info"><span>{{ $t('finance.paid') }}</span><span class="amt green">¥{{ data.apPaid?.toLocaleString() }}</span></div>
            <el-progress :percentage="apRate" color="#52c41a" :stroke-width="14" />
          </div>
          <div class="struct-line">
            <div class="struct-info"><span>{{ $t('finance.pendingPay') }}</span><span class="amt orange">¥{{ data.apPending?.toLocaleString() }}</span></div>
            <el-progress :percentage="100 - apRate" color="#faad14" :stroke-width="14" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 说明 -->
    <el-card shadow="hover">
      <div class="note">
        <el-icon><InfoFilled /></el-icon>
        <span>{{ $t('finance.title') }}</span>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { financeApi } from '@/api'

const { t } = useI18n()

const data = ref({})
const loading = ref(false)

const arRate = computed(() => (data.value.arTotal ? +(data.value.arReceived / data.value.arTotal * 100).toFixed(1) : 0))
const apRate = computed(() => (data.value.apTotal ? +(data.value.apPaid / data.value.apTotal * 100).toFixed(1) : 0))
const recoverRate = computed(() => (data.value.arTotal ? +(data.value.arReceived / data.value.arTotal * 100).toFixed(1) : 0))
const netCash = computed(() => data.value.netCash || 0)

async function load() {
  loading.value = true
  try {
    const res = await financeApi.summary()
    if (res.code === 200) {
      data.value = res.data
    }
  } finally {
    loading.value = false
  }
}

load()
</script>

<style scoped>
.big-card {
  border-radius: 8px;
  padding: 20px;
  color: #fff;
  height: 138px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.big-blue {
  background: linear-gradient(135deg, #1677ff 0%, #0052d9 100%);
}
.big-red {
  background: linear-gradient(135deg, #ff7875 0%, #cf1322 100%);
}
.big-green {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
}
.big-purple {
  background: linear-gradient(135deg, #722ed1 0%, #531dab 100%);
}
.big-head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  opacity: 0.92;
}
.big-head .el-icon {
  font-size: 18px;
}
.big-value {
  font-size: 30px;
  font-weight: 700;
  margin-top: 8px;
  line-height: 1.2;
  word-break: break-all;
}
.big-sub {
  font-size: 12px;
  opacity: 0.85;
  margin-top: 6px;
}
.card-header {
  font-weight: 600;
  color: #303133;
}
.struct-line {
  margin-bottom: 20px;
}
.struct-line:last-child {
  margin-bottom: 0;
}
.struct-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;
}
.amt {
  font-weight: 600;
}
.amt.green {
  color: #52c41a;
}
.amt.orange {
  color: #faad14;
}
.note {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
  line-height: 1.6;
}
.note .el-icon {
  color: #1677ff;
  font-size: 18px;
  flex-shrink: 0;
}
</style>
