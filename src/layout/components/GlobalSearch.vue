<template>
  <el-tooltip content="全局智能搜索" placement="bottom">
    <el-popover placement="bottom" :width="420" trigger="click" @show="onShow">
      <template #reference>
        <el-icon class="header-icon"><Search /></el-icon>
      </template>
      <div class="search-panel">
        <el-input
          v-model="keyword"
          placeholder="搜索货品/单据/运单/客户，或输入自然语言查询物流"
          clearable
          @keyup.enter="doSearch"
        >
          <template #append>
            <el-button @click="doSearch">搜索</el-button>
          </template>
        </el-input>
        <div class="search-results">
          <div v-if="smartResult" class="smart-result">
            <el-icon color="#1677ff"><ChatDotRound /></el-icon>
            <span>{{ smartResult }}</span>
          </div>
          <div v-for="r in results" :key="r.type + r.id" class="result-item" @click="goTo(r)">
            <el-tag size="small" effect="plain" :type="typeColor(r.type)">{{ typeLabel(r.type) }}</el-tag>
            <span class="result-text">{{ r.text }}</span>
          </div>
          <el-empty v-if="!results.length && !smartResult && searched" description="无匹配结果" :image-size="50" />
          <div v-if="!searched" class="quick-tip">
            <p>快捷示例：</p>
            <el-tag
              v-for="q in quickQueries"
              :key="q"
              size="small"
              class="quick-tag"
              @click="runQuick(q)"
            >{{ q }}</el-tag>
          </div>
        </div>
      </div>
    </el-popover>
  </el-tooltip>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { logisticsApi, warehouseApi } from '@/api'

const router = useRouter()
const keyword = ref('')
const results = ref([])
const smartResult = ref('')
const searched = ref(false)
const quickQueries = ['昨天发往成都的货到哪了？', '当前有哪些待处理异常？', '库存不足预警']

function onShow() {
  if (!searched.value) {
    keyword.value = ''
    results.value = []
    smartResult.value = ''
  }
}

async function doSearch() {
  const kw = keyword.value.trim()
  if (!kw) return
  searched.value = true
  results.value = []
  smartResult.value = ''

  // 自然语言（包含中文问号或疑问词）走智能查询
  if (/[?？]/.test(kw) || /(哪|哪些|怎么|多少|是否|当前|今天|昨天)/.test(kw)) {
    const res = await logisticsApi.smartQuery(kw)
    if (res.code === 200) smartResult.value = res.data.result
    return
  }

  // 关键词模糊搜索
  const all = []
  const goods = await warehouseApi.goods.list({ keyword: kw, pageSize: 50 })
  goods.data.list.forEach((g) => all.push({ type: 'goods', id: g.id, text: `${g.sku} ${g.name}`, path: '/warehouse/goods' }))
  const orders = await warehouseApi.orders.list({ keyword: kw, pageSize: 50 })
  orders.data.list.forEach((o) => all.push({ type: 'order', id: o.id, text: `${o.orderNo} ${o.type} ${o.customer || o.supplier || ''}`, path: '/warehouse/orders' }))
  const ships = await logisticsApi.shipments({ keyword: kw, pageSize: 50 })
  ships.data.list.forEach((s) => all.push({ type: 'shipment', id: s.id, text: `${s.trackingNo} ${s.fromCity}→${s.toCity}`, path: '/logistics/track' }))
  const custs = await warehouseApi.customers.list({ keyword: kw, pageSize: 50 })
  custs.data.list.forEach((c) => all.push({ type: 'customer', id: c.id, text: `${c.name} (${c.type})`, path: '/warehouse/customers' }))
  results.value = all.slice(0, 20)
}

function runQuick(q) {
  keyword.value = q
  doSearch()
}

function goTo(r) {
  if (r.path) router.push(r.path)
}

function typeLabel(t) {
  return { goods: '货品', order: '单据', shipment: '运单', customer: '客户' }[t] || t
}
function typeColor(t) {
  return { goods: 'success', order: 'warning', shipment: 'primary', customer: 'info' }[t] || ''
}
</script>

<style scoped>
.header-icon {
  font-size: 18px;
  cursor: pointer;
  color: #595959;
}
.search-panel {
  margin: -8px -4px;
}
.search-results {
  margin-top: 10px;
  max-height: 320px;
  overflow-y: auto;
}
.smart-result {
  display: flex;
  gap: 8px;
  padding: 10px;
  background: #f0f7ff;
  border-radius: 6px;
  font-size: 13px;
  color: #303133;
  margin-bottom: 8px;
}
.result-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 4px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  font-size: 13px;
}
.result-item:hover {
  background: #fafafa;
}
.result-text {
  flex: 1;
}
.quick-tip p {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}
.quick-tag {
  cursor: pointer;
  margin: 0 6px 6px 0;
}
</style>
