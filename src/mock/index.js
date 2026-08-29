/**
 * Mock API 引擎 - 模拟后端 RESTful API
 * 支持 localStorage 持久化、分页、筛选、延迟模拟
 */
import * as db from './data'

const STORAGE_KEY = 'haichen_db_v1'
const LATENCY = 200

// 初始化/加载持久化数据
// 注意：loadDB 内部不能调用 saveDB，否则在 `let data = loadDB()` 求值期间
// 触发 TDZ（saveDB 会写 data，而 data 尚未完成初始化），抛出
// "Cannot access 'data' before initialization" 导致整个应用白屏。
function loadDB() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      // fallthrough
    }
  }
  // 深拷贝种子数据，避免引用污染
  const fresh = {}
  for (const [k, v] of Object.entries(db)) {
    fresh[k] = Array.isArray(v) ? JSON.parse(JSON.stringify(v)) : JSON.parse(JSON.stringify(v))
  }
  // 首次初始化时直接写入 localStorage（不走 saveDB，避免 TDZ）
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
  return fresh
}

let data = loadDB()

function saveDB(d) {
  data = d
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d))
}

export function resetDB() {
  localStorage.removeItem(STORAGE_KEY)
  data = loadDB()
}

function delay(ms = LATENCY) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function ok(data, msg = '操作成功') {
  return { code: 200, data, msg }
}

function fail(msg = '操作失败') {
  return { code: 500, data: null, msg }
}

function nextId(arr) {
  return arr.reduce((max, item) => Math.max(max, item.id || 0), 0) + 1
}

function paginate(arr, page = 1, pageSize = 10) {
  const total = arr.length
  const list = arr.slice((page - 1) * pageSize, page * pageSize)
  return { list, total, page: Number(page), pageSize: Number(pageSize) }
}

function filterBy(arr, params, fields) {
  return arr.filter((item) => {
    return fields.every((f) => {
      const v = params[f]
      if (v === undefined || v === null || v === '') return true
      if (typeof item[f] === 'string') return item[f].includes(String(v))
      return String(item[f]) === String(v)
    })
  })
}

// ============ 通用 CRUD 工厂 ============
function crud(collection, idField = 'id') {
  return {
    list: async (params = {}) => {
      await delay()
      let arr = [...data[collection]]
      // 简单模糊搜索
      if (params.keyword) {
        const kw = String(params.keyword).toLowerCase()
        arr = arr.filter((item) =>
          Object.values(item).some((val) => String(val).toLowerCase().includes(kw))
        )
      }
      // 精确字段筛选
      Object.keys(params).forEach((k) => {
        if (k === 'keyword' || k === 'page' || k === 'pageSize') return
        if (params[k] !== undefined && params[k] !== '' && params[k] !== null) {
          arr = arr.filter((item) => String(item[k]) === String(params[k]))
        }
      })
      const { page = 1, pageSize = 10 } = params
      return ok(paginate(arr, page, pageSize))
    },
    all: async () => {
      await delay()
      return ok(data[collection])
    },
    detail: async (id) => {
      await delay()
      const item = data[collection].find((i) => String(i[idField]) === String(id))
      return item ? ok(item) : fail('记录不存在')
    },
    create: async (payload) => {
      await delay()
      payload[idField] = nextId(data[collection])
      if (!payload.createTime) payload.createTime = now()
      data[collection].unshift(payload)
      saveDB(data)
      return ok(payload, '新增成功')
    },
    update: async (payload) => {
      await delay()
      const idx = data[collection].findIndex((i) => String(i[idField]) === String(payload[idField]))
      if (idx === -1) return fail('记录不存在')
      data[collection][idx] = { ...data[collection][idx], ...payload }
      saveDB(data)
      return ok(data[collection][idx], '更新成功')
    },
    remove: async (id) => {
      await delay()
      const idx = data[collection].findIndex((i) => String(i[idField]) === String(id))
      if (idx === -1) return fail('记录不存在')
      data[collection].splice(idx, 1)
      saveDB(data)
      return ok(null, '删除成功')
    }
  }
}

function now() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

// ============ Auth ============
const authAPI = {
  login: async ({ username, password }) => {
    await delay()
    const user = data.users.find((u) => u.username === username && u.password === password)
    if (!user) return fail('账号或密码错误')
    if (user.status === 0) return fail('账号已被禁用，请联系管理员')
    const perms = new Set()
    user.roleIds.forEach((rid) => {
      const rp = data.rolePermissions[rid]
      if (rp === '*') perms.add('*')
      else (rp || []).forEach((p) => perms.add(p))
    })
    user.lastLogin = now()
    saveDB(data)
    const { password: _, ...userInfo } = user
    return ok({
      token: 'mock-token-' + user.id + '-' + Date.now(),
      userInfo,
      roles: user.roleIds.map((rid) => data.roles.find((r) => r.id === rid)?.name).filter(Boolean),
      permissions: [...perms]
    }, '登录成功')
  },
  profile: async () => {
    await delay(50)
    return ok({ userInfo: data.users[0], menus: [], permissions: ['*'] })
  },
  changePassword: async ({ oldPassword, newPassword }) => {
    await delay()
    return ok(null, '密码修改成功')
  }
}

// ============ Dashboard ============
const dashboardAPI = {
  overview: async () => {
    await delay()
    return ok(data.dashboardData)
  },
  warehouseOverview: async () => {
    await delay()
    const activeWh = data.warehouses.filter((w) => w.status === 1)
    return ok({
      todayIn: data.dashboardData.kpis[0].value,
      todayOut: data.dashboardData.kpis[1].value,
      insufficient: data.inventory.filter((i) => i.available < 20).length,
      excess: activeWh.filter((w) => w.usage > 90).length
    })
  }
}

// ============ Analytics ============
const analyticsAPI = {
  purchase: async () => ok(data.purchaseAnalysis),
  sales: async () => ok(data.salesAnalysis),
  retention: async (params = {}) => {
    let arr = [...data.retentionAnalysis]
    if (params.sort === 'time') arr.sort((a, b) => b.days - a.days)
    if (params.sort === 'stock') arr.sort((a, b) => b.stock - a.stock)
    return ok(arr)
  },
  expiry: async () => ok(data.retentionAnalysis.filter((r) => r.status !== '正常')),
  logisticsKpi: async () =>
    ok({
      avgResponseTime: 142,
      accuracy: 92,
      warningRate: 3.2,
      predictionAccuracy: 87,
      dailyVolume: '5.2TB',
      concurrency: 8620
    }),
  dataSources: async () => ok(data.dataSources)
}

// ============ Logistics ============
const logisticsAPI = {
  shipments: async (params = {}) => {
    await delay()
    let arr = filterBy([...data.shipments], params, ['status', 'mode', 'customer', 'trackingNo'])
    if (params.keyword) {
      const kw = params.keyword.toLowerCase()
      arr = arr.filter((s) => JSON.stringify(s).toLowerCase().includes(kw))
    }
    const { page = 1, pageSize = 10 } = params
    return ok(paginate(arr, page, pageSize))
  },
  track: async (trackingNo) => {
    await delay()
    return ok(data.trackPoints[trackingNo] || [
      { time: now(), location: '查询中', desc: '暂无轨迹数据', status: 'active' }
    ])
  },
  alerts: async (params = {}) => {
    await delay()
    let arr = filterBy([...data.alerts], params, ['status', 'level', 'type'])
    const { page = 1, pageSize = 10 } = params
    return ok(paginate(arr, page, pageSize))
  },
  handleAlert: async ({ id, handler, remark }) => {
    await delay()
    const alert = data.alerts.find((a) => a.id === id)
    if (!alert) return fail('预警不存在')
    alert.status = '处理中'
    alert.handler = handler
    if (remark) alert.content += `【处理备注】${remark}`
    saveDB(data)
    return ok(alert, '已派单处理')
  },
  closeAlert: async (id) => {
    await delay()
    const alert = data.alerts.find((a) => a.id === id)
    if (!alert) return fail('预警不存在')
    alert.status = '已闭环'
    saveDB(data)
    return ok(alert, '已闭环')
  },
  smartQuery: async (queryText) => {
    await delay(400)
    const q = (queryText || '').trim()
    let result = ''
    if (q.includes('成都')) {
      const cd = data.shipments.filter((s) => s.toCity === '成都')
      const done = cd.find((s) => s.status === '已签收')
      result = done
        ? `运单${done.trackingNo}已于${done.eta}抵达${done.toCity}并由客户签收。`
        : `共查询到${cd.length}条发往成都的运单，其中${cd.filter((s) => s.status === '运输中').length}条运输中。`
    } else if (q.includes('异常') || q.includes('预警')) {
      const pending = data.alerts.filter((a) => a.status === '待处理')
      result = `共${pending.length}条待处理异常：${pending.map((a) => a.title).join('；')}。`
    } else if (q.includes('库存') || q.includes('不足')) {
      const low = data.inventory.filter((i) => i.available < 20)
      result = `库存不足预警共${low.length}项：${low.map((i) => i.goodsName).join('、')}。`
    } else if (q.includes('在途') || q.includes('运输中')) {
      const active = data.shipments.filter((s) => s.status === '运输中')
      result = `当前${active.length}条运单运输中：${active.map((s) => `${s.trackingNo}(${s.fromCity}→${s.toCity})`).join('、')}。`
    } else {
      result = `已理解您的查询「${q}」。当前平台在途运单${data.shipments.filter((s) => s.status === '运输中').length}单，待处理异常${data.alerts.filter((a) => a.status === '待处理').length}条，今日入库${data.dashboardData.kpis[0].value}件/出库${data.dashboardData.kpis[1].value}件。`
    }
    data.smartQueryHistory.unshift({
      id: nextId(data.smartQueryHistory),
      query: q,
      result,
      time: now()
    })
    saveDB(data)
    return ok({ query: q, result })
  },
  queryHistory: async () => ok(data.smartQueryHistory)
}

// ============ Dispatch ============
const dispatchAPI = {
  vehicles: crud('vehicles'),
  drivers: crud('drivers'),
  dispatches: async (params = {}) => {
    await delay()
    let arr = filterBy([...data.dispatches], params, ['status'])
    const { page = 1, pageSize = 10 } = params
    return ok(paginate(arr, page, pageSize))
  },
  assign: async ({ id, vehicle, driver }) => {
    await delay()
    const d = data.dispatches.find((x) => x.id === id)
    if (!d) return fail('调度单不存在')
    d.vehicle = vehicle
    d.driver = driver
    d.status = '已指派'
    // 同步更新运单
    const s = data.shipments.find((x) => x.trackingNo === d.shipmentNo)
    if (s) {
      s.vehicle = vehicle
      s.status = '待发运'
    }
    saveDB(data)
    return ok(d, '调度指派成功')
  }
}

// ============ Finance ============
const financeAPI = {
  receivables: crud('receivables'),
  payables: crud('payables'),
  reconcile: async (id, type) => {
    await delay()
    const arr = type === 'ar' ? data.receivables : data.payables
    const item = arr.find((x) => x.id === id)
    if (!item) return fail('单据不存在')
    item.status = '已对账'
    saveDB(data)
    return ok(item, '对账成功')
  },
  settle: async (id, type) => {
    await delay()
    const arr = type === 'ar' ? data.receivables : data.payables
    const item = arr.find((x) => x.id === id)
    if (!item) return fail('单据不存在')
    item.status = type === 'ar' ? '已收款' : '已付款'
    saveDB(data)
    return ok(item, type === 'ar' ? '确认收款成功' : '付款成功')
  },
  summary: async () => {
    await delay()
    const arTotal = data.receivables.reduce((s, x) => s + x.amount, 0)
    const arReceived = data.receivables.filter((x) => x.status === '已收款').reduce((s, x) => s + x.amount, 0)
    const apTotal = data.payables.reduce((s, x) => s + x.amount, 0)
    const apPaid = data.payables.filter((x) => x.status === '已付款').reduce((s, x) => s + x.amount, 0)
    return ok({
      arTotal,
      arReceived,
      arPending: arTotal - arReceived,
      apTotal,
      apPaid,
      apPending: apTotal - apPaid,
      netCash: arReceived - apPaid
    })
  }
}

// ============ System ============
const systemAPI = {
  users: crud('users'),
  roles: crud('roles'),
  permissions: async () => ok(data.permissions),
  rolePermissions: async (roleId) => ok(data.rolePermissions[roleId] || []),
  updateRolePermissions: async ({ roleId, perms }) => {
    await delay()
    data.rolePermissions[roleId] = perms
    saveDB(data)
    return ok(null, '权限更新成功')
  },
  logs: async (params = {}) => {
    await delay()
    let arr = filterBy([...data.operationLogs], params, ['username', 'module', 'status'])
    if (params.keyword) {
      const kw = params.keyword.toLowerCase()
      arr = arr.filter((l) => JSON.stringify(l).toLowerCase().includes(kw))
    }
    const { page = 1, pageSize = 10 } = params
    return ok(paginate(arr, page, pageSize))
  },
  config: async () => ok(data.systemConfig),
  updateConfig: async (payload) => {
    await delay()
    Object.assign(data.systemConfig, payload)
    saveDB(data)
    return ok(data.systemConfig, '参数保存成功')
  },
  dict: async () => ok(data.dataDict),
  updateDict: async (payload) => {
    await delay()
    const idx = data.dataDict.findIndex((d) => d.id === payload.id)
    if (idx > -1) data.dataDict[idx] = { ...data.dataDict[idx], ...payload }
    saveDB(data)
    return ok(null, '字典更新成功')
  },
  notifications: async () => ok(data.notifications),
  readNotification: async (id) => {
    await delay(50)
    const n = data.notifications.find((x) => x.id === id)
    if (n) n.read = true
    saveDB(data)
    return ok(null)
  }
}

// ============ Warehouse ============
const warehouseAPI = {
  warehouses: crud('warehouses'),
  zones: async (warehouseId) => ok(data.zones.filter((z) => !warehouseId || z.warehouseId === Number(warehouseId))),
  goods: crud('goods'),
  inventory: async (params = {}) => {
    await delay()
    let arr = filterBy([...data.inventory], params, ['warehouseId', 'sku'])
    if (params.keyword) {
      const kw = params.keyword.toLowerCase()
      arr = arr.filter((i) => i.goodsName.toLowerCase().includes(kw) || i.sku.toLowerCase().includes(kw))
    }
    const { page = 1, pageSize = 10 } = params
    return ok(paginate(arr, page, pageSize))
  },
  orders: async (params = {}) => {
    await delay()
    let arr = filterBy([...data.orders], params, ['type', 'status'])
    if (params.keyword) {
      const kw = params.keyword.toLowerCase()
      arr = arr.filter((o) => o.orderNo.toLowerCase().includes(kw) || (o.customer || o.supplier || '').toLowerCase().includes(kw))
    }
    const { page = 1, pageSize = 10 } = params
    return ok(paginate(arr, page, pageSize))
  },
  orderDetail: async (id) => {
    await delay()
    const o = data.orders.find((x) => x.id === Number(id))
    return o ? ok(o) : fail('单据不存在')
  },
  auditOrder: async ({ id, action }) => {
    await delay()
    const o = data.orders.find((x) => x.id === Number(id))
    if (!o) return fail('单据不存在')
    if (action === 'pass') {
      o.status = o.type === '采购入库' ? '已审核' : '已审核'
      // 销售出库审核通过后自动生成运输任务（融合创新）
      if (o.type === '销售出库') {
        const exist = data.shipments.find((s) => s.orderNo === o.orderNo)
        if (!exist) {
          data.shipments.unshift({
            id: nextId(data.shipments),
            trackingNo: 'YT' + now().slice(0, 10).replace(/-/g, '') + 'NEW',
            orderNo: o.orderNo,
            customer: o.customer,
            fromCity: o.warehouse.includes('上海') ? '上海' : o.warehouse.includes('成都') ? '成都' : '上海',
            toCity: '待确认',
            mode: '陆运',
            carrier: '海辰自有车队',
            vehicle: '待指派',
            status: '待发运',
            departTime: '-',
            eta: '-',
            progress: 0
          })
        }
      }
      saveDB(data)
      return ok(o, '审核通过，已触发后续业务流程')
    } else {
      o.status = '已驳回'
      saveDB(data)
      return ok(o, '已驳回')
    }
  },
  customers: crud('customers'),
  visits: crud('visits'),
  syncMobile: async () => {
    await delay(500)
    return ok({ synced: Math.floor(Math.random() * 5) + 1 }, '移动端数据同步完成')
  }
}

export default {
  auth: authAPI,
  dashboard: dashboardAPI,
  analytics: analyticsAPI,
  logistics: logisticsAPI,
  dispatch: dispatchAPI,
  finance: financeAPI,
  system: systemAPI,
  warehouse: warehouseAPI
}
