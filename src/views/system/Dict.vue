<template>
  <div class="page-container">
    <el-row :gutter="16">
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header><span>字典类型</span></template>
          <div v-loading="loading">
            <div v-for="d in dictList" :key="d.id" :class="['dict-item', { active: current && current.id === d.id }]" @click="selectDict(d)">
              <div class="dict-name">{{ d.type }}</div>
              <div class="dict-code">{{ d.code }}</div>
            </div>
            <el-empty v-if="!dictList.length" description="暂无字典" :image-size="60" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="toolbar">
              <span>字典选项{{ current ? ' · ' + current.type : '' }}</span>
              <el-button v-if="current" type="primary" size="small" :icon="Check" @click="save">保存</el-button>
            </div>
          </template>
          <el-empty v-if="!current" description="请选择左侧字典类型" :image-size="80" />
          <template v-else>
            <div class="tag-area">
              <el-tag v-for="item in editItems" :key="item" closable class="dict-tag" @close="removeItem(item)">{{ item }}</el-tag>
              <span v-if="!editItems.length" class="empty-tip">暂无选项，请添加</span>
            </div>
            <div class="add-row">
              <el-input v-model="newItem" placeholder="输入新选项值" style="width: 240px" @keyup.enter="addItem" />
              <el-button type="primary" style="margin-left: 8px" :icon="Plus" @click="addItem">添加</el-button>
            </div>
          </template>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { systemApi } from '@/api'

const dictList = ref([])
const loading = ref(false)
const current = ref(null)
const editItems = ref([])
const newItem = ref('')

async function load() {
  loading.value = true
  try {
    const res = await systemApi.dict()
    if (res.code === 200) {
      dictList.value = res.data
      if (dictList.value.length) selectDict(dictList.value[0])
    }
  } finally { loading.value = false }
}
function selectDict(d) {
  current.value = d
  editItems.value = [...(d.items || [])]
  newItem.value = ''
}
function addItem() {
  const v = newItem.value.trim()
  if (!v) { ElMessage.warning('请输入选项值'); return }
  if (editItems.value.includes(v)) { ElMessage.warning('该选项已存在'); return }
  editItems.value.push(v)
  newItem.value = ''
}
function removeItem(item) {
  const idx = editItems.value.indexOf(item)
  if (idx > -1) editItems.value.splice(idx, 1)
}
async function save() {
  if (!current.value) return
  const res = await systemApi.updateDict({ id: current.value.id, type: current.value.type, code: current.value.code, items: editItems.value })
  if (res.code === 200) { ElMessage.success(res.msg); current.value = { ...current.value, items: [...editItems.value] } }
  else ElMessage.error(res.msg)
}

load()
</script>

<style scoped>
.dict-item { padding: 10px 12px; border-radius: 6px; cursor: pointer; transition: background 0.2s; }
.dict-item:hover { background: #f5f7fa; }
.dict-item.active { background: #e6f4ff; }
.dict-name { font-size: 14px; color: #303133; }
.dict-code { font-size: 12px; color: #909399; margin-top: 2px; }
.tag-area { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; min-height: 44px; padding: 12px; background: #fafafa; border-radius: 6px; }
.dict-tag { margin: 0; }
.empty-tip { font-size: 13px; color: #c0c4cc; }
.add-row { margin-top: 16px; display: flex; align-items: center; }
</style>
