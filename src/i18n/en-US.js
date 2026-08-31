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
  },

  order: { title: 'Orders', detailTitle: 'Order Detail', add: 'New Order', no: 'Order No', type: 'Type', customer: 'Customer', supplier: 'Supplier', partner: 'Party', warehouse: 'Warehouse', expectDate: 'Expected Date', itemCount: 'Qty', amount: 'Amount (CNY)', status: 'Status', creator: 'Creator', createTime: 'Created At', purchaseIn: 'Purchase In', salesOut: 'Sales Out', transfer: 'Transfer', ret: 'Return', pendingAudit: 'Pending', audited: 'Approved', picked: 'Picked', shipped: 'Shipped', done: 'Done', pass: 'Pass', reject: 'Reject', trackLogistics: 'Track' },
  warehouse_m: { title: 'Warehouses', list: 'Warehouse List', monitor: 'Monitor', addEdit: 'Edit Warehouse', name: 'Name', code: 'Code', address: 'Address', manager: 'Manager', phone: 'Phone', type: 'Type', center: 'Center', region: 'Regional', front: 'Frontier', zoneTitle: 'Zones', zoneName: 'Zone Name', zoneCode: 'Code', zoneType: 'Zone Type', zoneStorage: 'Storage', zonePick: 'Pick', zoneTemp: 'Temp', zoneDefective: 'Defective' },
  goods_m: { title: 'Goods', addEdit: 'Edit Goods', sku: 'SKU', name: 'Name', spec: 'Spec', category: 'Category', storageDevice: 'Storage Device', powerElec: 'Power Elec', ctrlDevice: 'Control Device', structPart: 'Struct Part', unit: 'Unit', shelfLife: 'Shelf Life', storageCond: 'Storage', manufacturer: 'Manufacturer', price: 'Price', status: 'Status', enabled: 'Active', disabled: 'Disabled' },
  inventory: { title: 'Inventory', batch: 'Batch', warehouse: 'Warehouse', zone: 'Zone', location: 'Location', inStock: 'On Hand', available: 'Available', locked: 'Locked', updateTime: 'Updated', noStock: 'No Stock' },
  partner: { title: 'Partners', type: 'Type', customer: 'Customer', supplier: 'Supplier', level: 'Level', contact: 'Contact', phone: 'Phone', address: 'Address', credit: 'Credit', totalAmount: 'Total (CNY)', lastOrder: 'Last Order', visitTitle: 'Visits', noVisit: 'No visits', strategic: 'Strategic', levelA: 'A', levelB: 'B', levelC: 'C', excellent: 'Excellent', good: 'Good', avg: 'Avg' },
  vehicle: { title: 'Vehicles', plate: 'Plate', model: 'Model', capacity: 'Capacity', driver: 'Driver', phone: 'Phone', gps: 'GPS', status: 'Status', lastUpdate: 'Last Update', self: 'Owned', affiliated: 'Leased', online: 'Online', offline: 'Offline', idle: 'Idle', repairing: 'Repair', inTransit: 'Transit', addEdit: 'Edit Vehicle' },
  driver_m: { title: 'Drivers', license: 'License', plate: 'Bound Plate', age: 'Age', phone: 'Phone', joinDate: 'Join Date', trips: 'Trips', status: 'Status', onJob: 'On Job', onLeave: 'Leave', addEdit: 'Edit Driver', name: 'Name' },
  dispatch: { title: 'Dispatch', no: 'Dispatch No', shipNo: 'Shipment No', fromCity: 'From', toCity: 'To', vehicle: 'Vehicle', driver: 'Driver', cargo: 'Cargo', weight: 'Weight', status: 'Status', pending: 'Pending', assigned: 'Assigned', inTransit: 'Transit', done: 'Done', assign: 'Assign Vehicle', noIdle: 'No idle vehicle', selectIdle: 'Select an idle vehicle', selectDriver: 'Select driver', add: 'New Dispatch' },
  track: { title: 'Live Tracking', trackingNo: 'Tracking', fromCity: 'From', toCity: 'To', carrier: 'Carrier', vehicle: 'Vehicle', status: 'Status', progress: 'Progress', departed: 'Departed', inTransit: 'Transit', arrived: 'Arrived', signed: 'Signed' },
  alert: { title: 'Smart Alerts', level: 'Level', severe: 'Critical', warn: 'Warning', tip: 'Info', titleField: 'Title', type: 'Type', abnormalType: 'Abnormal Type', content: 'Content', status: 'Status', pending: 'Pending', handling: 'Handling', closed: 'Closed', handler: 'Handler', suggestion: 'Suggestion', detail: 'Detail', handle: 'Handle' },
  dataSource: { title: 'Data Sources', name: 'Name', type: 'Type', status: 'Status', latency: 'Latency', dailyVolume: 'Daily Volume', accuracy: 'Accuracy', sea: 'Sea', air: 'Air', road: 'Road', online: 'Online', degraded: 'Degraded' },
  finance: { title: 'Finance', receivable: 'Receivables', payable: 'Payables', summary: 'Summary', billNo: 'Bill No', customer: 'Customer', supplier: 'Supplier', period: 'Period', amount: 'Amount', pendingRecon: 'Pending Recon', reconciled: 'Reconciled', pendingPay: 'Pending Pay', paid: 'Paid', pendingRecv: 'Pending Recv', received: 'Received' },
  sys: { userTitle: 'Users', roleTitle: 'Roles', logTitle: 'Audit Logs', configTitle: 'Settings', dictTitle: 'Dictionaries', username: 'Username', realName: 'Name', role: 'Role', dept: 'Dept', phone: 'Phone', status: 'Status', enabled: 'Active', disabled: 'Disabled', lastLogin: 'Last Login', module: 'Module', action: 'Action', ip: 'IP', time: 'Time', result: 'Result', success: 'Success', fail: 'Fail', warnStock: 'Low Stock', warnExcess: 'Overstock', warnTimeout: 'Timeout (min)', sessionTimeout: 'Session (min)', dataRetention: 'Log Days', loginLockCount: 'Lockout Threshold', loginLockMinutes: 'Lockout (min)' },
  bench: { title: 'Workbench', todo: 'Todo', myAlert: 'My Alerts', shipTrack: 'Tracking', custVisit: 'Visits', noTodo: 'No todo', noAlert: 'No alerts', noTrack: 'No tracking', noVisit: 'No visits', noIdle: 'No idle vehicle', tryMe: 'Try:', orderTodo: 'Order review', pendingAudit: 'Pending review' },
  profile: { title: 'Profile', basicInfo: 'Basic Info', changePwd: 'Change Password', oldPwd: 'Current', newPwd: 'New', confirmPwd: 'Confirm', pwdOk: 'Password OK' },
  analytics: { purchaseTitle: 'Purchase Analysis', salesTitle: 'Sales Analysis', retentionTitle: 'Retention Analysis', logisticsTitle: 'Logistics Timeliness', month: 'Month', amount: 'Amount', qty: 'Qty', avgPrice: 'Avg Price/Item', lastIn: 'Last In', lastOut: 'Last Out', retentionDays: 'Days', retentionDetail: 'Detail', retentionWarn: 'Alert (d)', avgRate: 'Avg Timeliness', slaRate: 'On-time %' },
  smartQuery: { title: 'Smart Query', history: 'History', noHistory: 'No history', placeholder: 'Ask me anything...' },
  btn: { search: 'Search', reset: 'Reset', add: 'Add', edit: 'Edit', delete: 'Delete', save: 'Save', cancel: 'Cancel', confirm: 'Confirm', close: 'Close', submit: 'Submit', view: 'View', detail: 'Detail', track: 'Track', audit: 'Audit', pass: 'Pass', reject: 'Reject', import: 'Import', export: 'Export', assign: 'Assign Vehicle', syncMobile: 'Sync Mobile', batchDel: 'Batch Delete', changePwd: 'Change Password' },
  field: { no: 'No', name: 'Name', code: 'Code', type: 'Type', status: 'Status', createTime: 'Created', updateTime: 'Updated', creator: 'Creator', remark: 'Remark', description: 'Description', phone: 'Phone', mobile: 'Mobile', address: 'Address', temp: 'Temp', humidity: 'Humidity', operator: 'Owner', gps: 'GPS', ip: 'IP' }
}
