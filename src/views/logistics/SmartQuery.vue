<template>
  <div class="page-container smart-query">
    <el-card shadow="hover" class="chat-card">
      <template #header>
        <div class="card-header">
          <div class="header-title">
            <el-icon class="header-icon"><ChatDotRound /></el-icon>
            <span>{{ $t('smartQuery.title') }}</span>
          </div>
          <el-button text type="primary" size="small" @click="loadHistory">
            <el-icon><Refresh /></el-icon><span style="margin-left:4px">{{ $t('btn.reset') }}</span>
          </el-button>
        </div>
      </template>

      <div class="chat-layout">
        <!-- 左侧：历史 + 快捷提问 -->
        <div class="chat-side">
          <div class="side-section">
            <div class="side-title"><el-icon><Clock /></el-icon> {{ $t('bench.tryMe') }}</div>
            <div class="quick-list">
              <el-button v-for="(q, i) in quickQuestions" :key="i" class="quick-btn" @click="sendQuery(q)">
                {{ q }}
              </el-button>
            </div>
          </div>
          <div class="side-section">
            <div class="side-title"><el-icon><Document /></el-icon> {{ $t('smartQuery.history') }}</div>
            <div v-loading="historyLoading" class="history-list">
              <div v-for="h in history" :key="h.id" class="history-item" @click="sendQuery(h.query)">
                <div class="history-q">{{ h.query }}</div>
                <div class="history-t">{{ h.time }}</div>
              </div>
              <el-empty v-if="!history.length && !historyLoading" :description="$t('smartQuery.noHistory')" :image-size="60" />
            </div>
          </div>
        </div>

        <!-- 右侧：对话区 -->
        <div class="chat-main">
          <div ref="chatBody" class="chat-body">
            <div v-if="!messages.length" class="empty-tip">
              <el-icon class="empty-icon"><ChatLineSquare /></el-icon>
              <p>{{ $t('smartQuery.title') }}</p>
              <p class="sub">{{ $t('smartQuery.placeholder') }}</p>
            </div>
            <div v-for="(m, i) in messages" :key="i" class="msg-row" :class="m.role">
              <div v-if="m.role === 'ai'" class="avatar ai-avatar"><el-icon><Robot /></el-icon></div>
              <div class="bubble" :class="m.role">
                <div v-if="m.role === 'ai'" class="bubble-label">{{ $t('smartQuery.title') }}</div>
                <div class="bubble-text">{{ m.text }}</div>
              </div>
              <div v-if="m.role === 'user'" class="avatar user-avatar"><el-icon><User /></el-icon></div>
            </div>
            <div v-if="loading" class="msg-row ai">
              <div class="avatar ai-avatar"><el-icon><Robot /></el-icon></div>
              <div class="bubble ai typing">
                <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              </div>
            </div>
          </div>

          <div class="chat-input">
            <el-input
              v-model="inputText"
              :placeholder="$t('smartQuery.placeholder')"
              clearable
              size="large"
              @keyup.enter="sendQuery()"
            >
              <template #prefix><el-icon><EditPen /></el-icon></template>
            </el-input>
            <el-button type="primary" size="large" :loading="loading" @click="sendQuery()">
              <el-icon><Promotion /></el-icon><span style="margin-left:4px">{{ $t('btn.submit') }}</span>
            </el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { logisticsApi } from '@/api'

const { t } = useI18n()

const quickQuestions = [
  '昨天发往成都的货到哪了？',
  '当前有哪些待处理异常？',
  '库存不足预警',
  '在途运单有哪些'
]

const messages = ref([])
const inputText = ref('')
const loading = ref(false)
const history = ref([])
const historyLoading = ref(false)
const chatBody = ref(null)

async function sendQuery(text) {
  const q = (text ?? inputText.value ?? '').trim()
  if (!q) { ElMessage.warning(t('common.noData')); return }
  if (loading.value) return
  messages.value.push({ role: 'user', text: q })
  inputText.value = ''
  loading.value = true
  await scrollToBottom()
  try {
    const res = await logisticsApi.smartQuery(q)
    if (res.code === 200) {
      messages.value.push({ role: 'ai', text: res.data.result })
    } else {
      messages.value.push({ role: 'ai', text: t('common.fail') + '：' + (res.msg || '') })
    }
  } catch (e) {
    messages.value.push({ role: 'ai', text: t('common.fail') })
  } finally {
    loading.value = false
    await scrollToBottom()
    loadHistory()
  }
}

async function loadHistory() {
  historyLoading.value = true
  try {
    const res = await logisticsApi.queryHistory()
    if (res.code === 200) history.value = res.data
  } finally { historyLoading.value = false }
}

async function scrollToBottom() {
  await nextTick()
  if (chatBody.value) chatBody.value.scrollTop = chatBody.value.scrollHeight
}

onMounted(loadHistory)
</script>

<style scoped>
.smart-query { height: calc(100vh - 110px); }
.chat-card { height: 100%; display: flex; flex-direction: column; }
.chat-card :deep(.el-card__body) { flex: 1; overflow: hidden; padding: 0; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.header-title { display: flex; align-items: center; gap: 8px; font-weight: 600; color: #303133; }
.header-icon { color: #1677ff; font-size: 18px; }

.chat-layout { display: flex; height: 100%; }
.chat-side { width: 280px; border-right: 1px solid #ebeef5; padding: 16px; overflow-y: auto; flex-shrink: 0; }
.side-section { margin-bottom: 20px; }
.side-title { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #303133; margin-bottom: 12px; }
.side-title .el-icon { color: #1677ff; }
.quick-list { display: flex; flex-direction: column; gap: 8px; }
.quick-btn { justify-content: flex-start; text-align: left; white-space: normal; height: auto; line-height: 1.5; padding: 8px 12px; }
.history-list { display: flex; flex-direction: column; gap: 8px; }
.history-item { background: #f5f7fa; border-radius: 6px; padding: 8px 10px; cursor: pointer; transition: background 0.2s; }
.history-item:hover { background: #ecf5ff; }
.history-q { font-size: 13px; color: #303133; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.history-t { font-size: 12px; color: #c0c4cc; margin-top: 4px; }

.chat-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.chat-body { flex: 1; overflow-y: auto; padding: 20px; background: #f7f8fa; }
.empty-tip { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #909399; }
.empty-icon { font-size: 48px; color: #1677ff; margin-bottom: 12px; }
.empty-tip p { font-size: 15px; }
.empty-tip .sub { font-size: 13px; color: #c0c4cc; margin-top: 6px; }

.msg-row { display: flex; margin-bottom: 16px; align-items: flex-start; }
.msg-row.user { justify-content: flex-end; }
.avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px; color: #fff; }
.ai-avatar { background: #1677ff; margin-right: 10px; }
.user-avatar { background: #52c41a; margin-left: 10px; }
.bubble { max-width: 70%; padding: 10px 14px; border-radius: 10px; font-size: 14px; line-height: 1.7; word-break: break-word; }
.bubble.user { background: #1677ff; color: #fff; border-top-right-radius: 2px; }
.bubble.ai { background: #fff; color: #303133; border: 1px solid #ebeef5; border-top-left-radius: 2px; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
.bubble-label { font-size: 12px; color: #1677ff; font-weight: 600; margin-bottom: 4px; }
.bubble.typing { display: flex; gap: 4px; align-items: center; padding: 14px; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: #c0c4cc; animation: blink 1.2s infinite ease-in-out both; }
.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes blink { 0%, 80%, 100% { opacity: 0.3; } 40% { opacity: 1; } }

.chat-input { display: flex; gap: 10px; padding: 14px 16px; border-top: 1px solid #ebeef5; background: #fff; }
</style>
