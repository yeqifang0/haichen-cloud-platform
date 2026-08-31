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
  }
}
