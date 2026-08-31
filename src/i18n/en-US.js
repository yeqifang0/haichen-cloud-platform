// English language pack
export default {
  // === App ===
  app: {
    name: 'Haichen Cloud Platform',
    fullName: 'Haichen Cloud Platform Management System',
    subtitle: 'Shanghai Haichen Zhichu Technology Co., Ltd. · Unified Management Console',
    copyright: '© 2026 Shanghai Haichen Zhichu Technology Co., Ltd. All Rights Reserved',
    loginWelcome: 'Welcome',
    loginTip: 'Sign in to access the management console',
    loginButton: 'SIGN IN',
    rememberLogin: 'Remember me',
    forgotPassword: 'Forgot password?',
    quickLogin: 'Quick login'
  },

  // === Sidebar menu ===
  menu: {
    home: 'Home',
    dashboard: 'Overview',
    workbench: 'My Workspace',
    warehouseCenter: 'Warehouse',
    warehouseMonitor: 'Monitor',
    warehouseList: 'Warehouse / Zone',
    goods: 'Goods',
    stock: 'Stock Query',
    orderList: 'Orders',
    customerSupplier: 'Customers / Suppliers',
    customer: 'Customers',
    supplier: 'Suppliers',
    logisticsCenter: 'Logistics',
    tracking: 'Real-time Tracking',
    alerts: 'Smart Alerts',
    smartQuery: 'NLP Query',
    dataSource: 'Data Sources',
    dispatchCenter: 'Dispatch',
    vehicles: 'Vehicles',
    drivers: 'Drivers',
    dispatch: 'Dispatch',
    analyticsCenter: 'Analytics',
    purchaseAnalysis: 'Purchase Analysis',
    salesAnalysis: 'Sales Analysis',
    retentionAnalysis: 'Retention Analysis',
    logisticsAnalysis: 'Logistics SLA',
    financeCenter: 'Finance',
    receivable: 'Receivables',
    payable: 'Payables',
    financeSummary: 'Overview',
    systemCenter: 'System',
    userList: 'Users',
    role: 'Roles',
    logs: 'Audit Logs',
    config: 'Settings',
    dictionary: 'Dictionary',
    profile: 'Profile'
  },

  // === Header ===
  header: {
    refreshCache: 'Refresh cache',
    confirmRefresh: 'This will clear local mock data and restore initial state. Continue?',
    cacheTitle: 'Refresh Cache',
    cacheReset: 'Data reset. Reloading...',
    profile: 'Profile',
    changePassword: 'Change Password',
    oldPassword: 'Current',
    newPassword: 'New',
    confirmPassword: 'Confirm',
    pwdPlaceholder: '8-20 chars with upper/lower + digit',
    pwdMismatch: 'Passwords do not match',
    logout: 'Log Out',
    confirmLogout: 'Are you sure to log out?',
    tip: 'Tip',
    user: 'User'
  },

  // === Login ===
  login: {
    welcome: 'Welcome',
    welcomeTitle: 'Welcome',
    tip: 'Sign in to access the management console',
    username: 'Username',
    password: 'Password',
    captcha: 'Captcha',
    remember: 'Remember me',
    forgot: 'Forgot password?',
    button: 'SIGN IN',
    quickLogin: 'Quick login',
    captchaError: 'Invalid captcha',
    brand1: 'Warehouse · Full-chain inventory visibility',
    brand2: 'Logistics · Multi-source real-time tracking',
    brand3: 'Analytics · Smart alerts & decisions',
    brand4: 'HC002 · Warehouse-Logistics integration',
    rulesUsername: 'Please enter username',
    rulesPassword: 'Please enter password',
    rulesCaptcha: 'Please enter captcha'
  },

  // === Dashboard ===
  dashboard: {
    greetingDawn: 'Good dawn',
    greetingMorning: 'Good morning',
    greetingForenoon: 'Good morning',
    greetingNoon: 'Good noon',
    greetingAfternoon: 'Good afternoon',
    greetingEvening: 'Good evening',
    greeting: 'Hello',
    welcomeBack: 'Welcome back to Haichen Cloud. Today is {date}. Have a productive day',
    dataVolume: 'Data Volume (Today)',
    queryResponse: 'Query Response',
    onlineConcurrent: 'Online Concurrency',
    // KPI units
    unitItem: '',
    unitOrder: '',
    unitRecord: '',
    unitPercent: '%',
    // Trend
    trendCompare: 'vs yesterday',
    // Charts
    inOutTrend: 'Inbound/Outbound (7d)',
    inLegend: 'Inbound',
    outLegend: 'Outbound',
    transportMode: 'Transport Mode',
    alertTrend: 'Alert Trend (7d)',
    alertLegend: 'Alerts',
    topCustomers: 'Top Customers (10K CNY)',
    tagFinance: 'Sales & WMS',
    tagHC002: 'HC002 Sources',
    tagAlertAccuracy: '92% Accuracy',
    tagYearTotal: 'YTD',
    // Warehouse
    warehouseStatus: 'Warehouse Status',
    details: 'Details',
    temp: 'Temp',
    humidity: 'Humidity',
    // Shipments table
    inTransitShipments: 'Active Shipments',
    track: 'Track',
    trackingNo: 'Tracking',
    route: 'Route',
    mode: 'Mode',
    progress: 'Progress',
    status: 'Status',
    eta: 'ETA',
    admin: 'Admin'
  },

  // === Transport mode ===
  transport: {
    road: 'Road',
    air: 'Air',
    sea: 'Sea'
  },

  // === Shipment status ===
  shipmentStatus: {
    inTransit: 'In Transit',
    delivered: 'Delivered',
    pendingShip: 'Pending',
    pendingAssign: 'Unassigned'
  },

  // === Warehouse type ===
  warehouseType: {
    center: 'Center',
    region: 'Regional',
    front: 'Frontier'
  },

  // === Roles ===
  role: {
    admin: 'Admin',
    adminFull: 'Super Admin',
    manager: 'Manager',
    warehouse: 'Warehouse',
    logistics: 'Logistics',
    finance: 'Finance'
  },

  // === Demo accounts ===
  demo: {
    admin: 'Admin',
    manager: 'Manager',
    warehouse: 'Warehouse',
    logistics: 'Logistics',
    finance: 'Finance'
  },

  // === Common ===
  common: {
    loading: 'Loading...',
    noData: 'No data',
    search: 'Search',
    reset: 'Reset',
    query: 'Query',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'OK',
    export: 'Export',
    import: 'Import',
    batchDelete: 'Batch Delete',
    view: 'View',
    success: 'Success',
    fail: 'Failed',
    confirmTitle: 'Confirm',
    confirmDelete: 'Delete?',
    language: '中文'
  }
}
