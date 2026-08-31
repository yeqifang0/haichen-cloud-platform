// 中文语言包
export default {
  // === 系统 ===
  app: {
    name: '海辰智汇云平台',
    fullName: '海辰智汇云平台管理系统',
    subtitle: '上海海辰智储科技有限公司 · 统一管理后台',
    copyright: '© 2026 上海海辰智储科技有限公司 版权所有',
    loginWelcome: '欢迎登录',
    loginTip: '请输入账号密码进入管理后台',
    loginButton: '登 录',
    rememberLogin: '记住登录态',
    forgotPassword: '忘记密码？',
    quickLogin: '快速登录'
  },

  // === 侧边栏菜单 ===
  menu: {
    home: '首页',
    dashboard: '综合运营看板',
    workbench: '个人工作台',
    warehouseCenter: '仓储管理中心',
    warehouseMonitor: '仓库监控',
    warehouseList: '仓库/库区管理',
    goods: '货品管理',
    stock: '库存查询',
    orderList: '单据管理',
    customerSupplier: '客户/供应商',
    customer: '客户管理',
    supplier: '供应商管理',
    logisticsCenter: '物流信息中心',
    tracking: '实时物流追踪',
    alerts: '智能预警中心',
    smartQuery: '智能查询助手',
    dataSource: '多源数据接入',
    dispatchCenter: '车辆调度中心',
    vehicles: '车辆管理',
    drivers: '司机管理',
    dispatch: '调度管理',
    analyticsCenter: '大数据分析中心',
    purchaseAnalysis: '采购入库分析',
    salesAnalysis: '销售出库分析',
    retentionAnalysis: '滞留时长分析',
    logisticsAnalysis: '物流时效分析',
    financeCenter: '财务对账中心',
    receivable: '应收对账',
    payable: '应付对账',
    financeSummary: '财务总览',
    systemCenter: '系统管理',
    userList: '用户管理',
    role: '角色权限',
    logs: '操作日志',
    config: '参数设置',
    dictionary: '数据字典',
    profile: '个人中心'
  },

  // === 头部 ===
  header: {
    refreshCache: '刷新缓存数据',
    confirmRefresh: '将清空本地模拟数据并恢复初始数据，确认继续？',
    cacheTitle: '刷新缓存',
    cacheReset: '数据已重置，即将刷新页面',
    profile: '个人中心',
    changePassword: '修改密码',
    oldPassword: '原密码',
    newPassword: '新密码',
    confirmPassword: '确认密码',
    pwdPlaceholder: '8-20位含大小写+数字',
    pwdMismatch: '两次输入的密码不一致',
    logout: '退出登录',
    confirmLogout: '确定要退出登录吗？',
    tip: '提示',
    user: '用户'
  },

  // === 登录页 ===
  login: {
    welcome: '欢迎登录',
    welcomeTitle: '欢迎登录',
    tip: '请输入账号密码进入管理后台',
    username: '用户名',
    password: '密码',
    captcha: '验证码',
    remember: '记住登录态',
    forgot: '忘记密码？',
    button: '登 录',
    quickLogin: '快速登录',
    captchaError: '验证码错误',
    brand1: '仓储管理中心 · 全链路库存可视',
    brand2: '物流信息中心 · 多源数据实时追踪',
    brand3: '大数据分析中心 · 智能预警与决策',
    brand4: '融合 HC002 · 打通仓储-物流全链路',
    rulesUsername: '请输入用户名',
    rulesPassword: '请输入密码',
    rulesCaptcha: '请输入验证码'
  },

  // === 仪表盘 ===
  dashboard: {
    greetingDawn: '凌晨好',
    greetingMorning: '早上好',
    greetingForenoon: '上午好',
    greetingNoon: '中午好',
    greetingAfternoon: '下午好',
    greetingEvening: '晚上好',
    greeting: '您好',
    welcomeBack: '欢迎回到海辰智汇云平台，今天是 {date}，祝您工作顺利',
    dataVolume: '数据接入量(今日)',
    queryResponse: '查询响应',
    onlineConcurrent: '在线并发',
    // KPI units
    unitItem: '件',
    unitOrder: '单',
    unitRecord: '条',
    unitPercent: '%',
    // 趋势
    trendCompare: '较昨日',
    // 图表
    inOutTrend: '仓储出入库趋势（近7日）',
    inLegend: '入库',
    outLegend: '出库',
    transportMode: '运输方式占比',
    alertTrend: '物流异常趋势（近7日）',
    alertLegend: '异常数',
    topCustomers: '客户交易额 TOP5（万元）',
    tagFinance: '融合销售仓储系统',
    tagHC002: 'HC002 多源',
    tagAlertAccuracy: '预警准确率 92%',
    tagYearTotal: '本年累计',
    // 仓库监控
    warehouseStatus: '仓库库容监控',
    details: '详情',
    temp: '温度',
    humidity: '湿度',
    // 在途运单
    inTransitShipments: '在途运单实时状态',
    track: '物流追踪',
    trackingNo: '运单号',
    route: '线路',
    mode: '方式',
    progress: '进度',
    status: '状态',
    eta: '预计到达',
    admin: '管理员'
  },

  // === 运输方式 ===
  transport: {
    road: '陆运',
    air: '空运',
    sea: '海运'
  },

  // === 运单状态 ===
  shipmentStatus: {
    inTransit: '运输中',
    delivered: '已签收',
    pendingShip: '待发运',
    pendingAssign: '待指派'
  },

  // === 仓库类型 ===
  warehouseType: {
    center: '中心仓',
    region: '区域仓',
    front: '前置仓'
  },

  // === 角色 ===
  role: {
    admin: '管理员',
    adminFull: '超级管理员',
    manager: '管理层',
    warehouse: '仓管',
    logistics: '物流调度',
    finance: '财务'
  },

  // === 登录页演示账号 ===
  demo: {
    admin: '管理员',
    manager: '管理层',
    warehouse: '仓管',
    logistics: '物流调度',
    finance: '财务'
  },

  // === 通用 ===
  common: {
    loading: '加载中...',
    noData: '暂无数据',
    search: '搜索',
    reset: '重置',
    query: '查询',
    add: '新增',
    edit: '编辑',
    delete: '删除',
    save: '保存',
    cancel: '取消',
    confirm: '确认',
    export: '导出',
    import: '导入',
    batchDelete: '批量删除',
    view: '查看',
    success: '操作成功',
    fail: '操作失败',
    confirmTitle: '提示',
    confirmDelete: '确定要删除吗？',
    language: 'English'
  },

  // ===== 完整模块翻译 =====
  order: { title: '单据管理', detailTitle: '单据详情', add: '新增单据', no: '单据号', type: '单据类型', customer: '客户', supplier: '供应商', partner: '往来方', warehouse: '仓库', expectDate: '预计日期', itemCount: '数量', amount: '金额(元)', status: '状态', creator: '创建人', createTime: '创建时间', purchaseIn: '采购入库', salesOut: '销售出库', transfer: '调拨单', ret: '退货单', pendingAudit: '待审核', audited: '已审核', picked: '拣货完成', shipped: '已发运', done: '已完成', pass: '通过', reject: '驳回', trackLogistics: '物流追踪' },
  warehouse_m: { title: '仓库管理', list: '仓库列表', monitor: '仓库监控', addEdit: '编辑仓库', name: '仓库名称', code: '仓库编码', address: '仓库地址', manager: '负责人', phone: '联系电话', type: '仓库类型', center: '中心仓', region: '区域仓', front: '前置仓', zoneTitle: '库区管理', zoneName: '库区名称', zoneCode: '库区编码', zoneType: '库区类型', zoneStorage: '存储区', zonePick: '拣货区', zoneTemp: '暂存区', zoneDefective: '不良品区' },
  goods_m: { title: '货品管理', addEdit: '编辑货品', sku: 'SKU编码', name: '货品名称', spec: '规格型号', category: '品类', storageDevice: '储能设备', powerElec: '电力电子', ctrlDevice: '控制设备', structPart: '结构件', unit: '单位', shelfLife: '保质期(天)', storageCond: '存储条件', manufacturer: '生产厂商', price: '单价', status: '状态', enabled: '启用', disabled: '停用' },
  inventory: { title: '库存查询', batch: '批次号', warehouse: '仓库', zone: '库区', location: '库位', inStock: '在库数量', available: '可用数量', locked: '锁定', updateTime: '更新时间', noStock: '暂无库存' },
  partner: { title: '客户/供应商', type: '类型', customer: '客户', supplier: '供应商', level: '等级', contact: '联系人', phone: '电话', address: '地址', credit: '信用', totalAmount: '累计交易额(元)', lastOrder: '最近交易', visitTitle: '拜访记录', noVisit: '暂无拜访记录', strategic: '战略', levelA: 'A级', levelB: 'B级', levelC: 'C级', excellent: '优秀', good: '良好', avg: '一般' },
  vehicle: { title: '车辆管理', plate: '车牌号', model: '车型', capacity: '载重', driver: '司机', phone: '联系电话', gps: 'GPS状态', status: '车辆状态', lastUpdate: '最后更新', self: '自有', affiliated: '挂靠', online: '在线', offline: '离线', idle: '空闲', repairing: '维修', inTransit: '运输中', addEdit: '编辑车辆' },
  driver_m: { title: '司机管理', license: '驾照', plate: '绑定车牌', age: '年龄', phone: '联系电话', joinDate: '入职日期', trips: '累计趟数', status: '状态', onJob: '在职', onLeave: '休假', addEdit: '编辑司机', name: '姓名' },
  dispatch: { title: '调度管理', no: '调度单号', shipNo: '运单号', fromCity: '起点', toCity: '终点', vehicle: '车辆', driver: '司机', cargo: '货物', weight: '重量', status: '调度状态', pending: '待调度', assigned: '已指派', inTransit: '运输中', done: '已完成', assign: '指派车辆', noIdle: '暂无空闲车辆', selectIdle: '请选择空闲车辆', selectDriver: '请选择司机', add: '新增调度' },
  track: { title: '实时物流追踪', trackingNo: '运单号', fromCity: '起点', toCity: '终点', carrier: '承运商', vehicle: '车牌号', status: '状态', progress: '进度', departed: '已装车发运', inTransit: '运输中', arrived: '抵达', signed: '已签收' },
  alert: { title: '智能预警中心', level: '级别', severe: '严重', warn: '警告', tip: '提示', titleField: '预警标题', type: '类型', abnormalType: '异常类型', content: '内容', status: '状态', pending: '待处理', handling: '处理中', closed: '已闭环', handler: '处理人', suggestion: '处理建议', detail: '异常详情', handle: '处理' },
  dataSource: { title: '多源数据接入', name: '数据源名称', type: '类型', status: '状态', latency: '响应延迟', dailyVolume: '日处理量', accuracy: '数据准确率', sea: '海运', air: '空运', road: '陆运', online: '在线', degraded: '降级' },
  finance: { title: '财务对账中心', receivable: '应收对账', payable: '应付对账', summary: '财务总览', billNo: '账单号', customer: '客户', supplier: '供应商', period: '账期', amount: '金额', pendingRecon: '待对账', reconciled: '已对账', pendingPay: '待付款', paid: '已付款', pendingRecv: '待收款', received: '已收款' },
  sys: { userTitle: '用户管理', roleTitle: '角色权限', logTitle: '操作日志', configTitle: '参数设置', dictTitle: '数据字典', username: '用户名', realName: '姓名', role: '角色', dept: '部门', phone: '电话', status: '状态', enabled: '启用', disabled: '停用', lastLogin: '最近登录', module: '模块', action: '操作', ip: 'IP地址', time: '时间', result: '结果', success: '成功', fail: '失败', warnStock: '库存不足阈值', warnExcess: '库存超限阈值', warnTimeout: '异常超时(分钟)', sessionTimeout: '会话超时(分钟)', dataRetention: '日志保留天数', loginLockCount: '登录失败锁定次数', loginLockMinutes: '账号锁定时长(分钟)' },
  bench: { title: '个人工作台', todo: '待办事项', myAlert: '我的预警', shipTrack: '物流追踪', custVisit: '客户拜访', noTodo: '暂无待办', noAlert: '暂无预警', noTrack: '暂无轨迹数据', noVisit: '暂无拜访记录', noIdle: '暂无空闲车辆', tryMe: '试试问我：', orderTodo: '单据审核提醒', pendingAudit: '待审核' },
  profile: { title: '个人中心', basicInfo: '基本信息', changePwd: '修改密码', oldPwd: '原密码', newPwd: '新密码', confirmPwd: '确认密码', pwdOk: '密码强度合格' },
  analytics: { purchaseTitle: '采购入库分析', salesTitle: '销售出库分析', retentionTitle: '滞留时长分析', logisticsTitle: '物流时效分析', month: '月份', amount: '金额', qty: '数量', avgPrice: '单价均值（元/件）', lastIn: '入库日期', lastOut: '最后出库日期', retentionDays: '滞留天数', retentionDetail: '滞留详情', retentionWarn: '滞留预警天数', avgRate: '平均时效', slaRate: '准时率' },
  smartQuery: { title: '智能查询助手', history: '历史查询', noHistory: '暂无历史', placeholder: '输入您的问题，例如：昨天发往成都的货到哪了？' },
  btn: { search: '查询', reset: '重置', add: '新增', edit: '编辑', delete: '删除', save: '保存', cancel: '取消', confirm: '确认', close: '关闭', submit: '提交', view: '查看', detail: '详情', track: '物流追踪', audit: '审核', pass: '通过', reject: '驳回', import: '导入', export: '导出', assign: '指派车辆', syncMobile: '同步移动端', batchDel: '批量删除', changePwd: '修改密码' },
  field: { no: '编号', name: '名称', code: '编码', type: '类型', status: '状态', createTime: '创建时间', updateTime: '更新时间', creator: '创建人', remark: '备注', description: '描述', phone: '电话', mobile: '手机', address: '地址', temp: '温度', humidity: '湿度', operator: '负责人', gps: 'GPS', ip: 'IP地址' }
}
