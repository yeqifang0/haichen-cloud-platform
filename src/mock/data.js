/**
 * 海辰智汇云平台 - Mock 数据库种子数据
 * 融合「销售仓储管理大数据交互系统」与「物流信息查询辅助信息化系统(HC002)」
 */

// ========== 用户与权限 ==========
export const roles = [
  { id: 1, code: 'admin', name: '超级管理员', desc: '拥有全部权限', status: 1, createTime: '2025-09-01 09:00:00' },
  { id: 2, code: 'manager', name: '管理层', desc: '经营决策、全局监控、审批', status: 1, createTime: '2025-09-01 09:00:00' },
  { id: 3, code: 'warehouse', name: '仓储运营', desc: '仓库日常作业、货品管理、单据处理', status: 1, createTime: '2025-09-01 09:00:00' },
  { id: 4, code: 'logistics', name: '物流调度', desc: '车辆调度、运单追踪、异常处理', status: 1, createTime: '2025-09-01 09:00:00' },
  { id: 5, code: 'finance', name: '财务审计', desc: '对账、结算、成本分析', status: 1, createTime: '2025-09-01 09:00:00' },
  { id: 6, code: 'data', name: '数据专员', desc: '数据维护、报表生成、系统配置', status: 1, createTime: '2025-09-01 09:00:00' }
]

export const users = [
  { id: 1, username: 'admin', password: 'Admin@123', name: '系统管理员', roleIds: [1], dept: '信息中心', phone: '13800000001', email: 'admin@haichen.com', status: 1, createTime: '2025-09-01 09:00:00', lastLogin: '2026-08-29 08:30:12' },
  { id: 2, username: 'wangjingli', password: 'Manager@123', name: '王建国', roleIds: [2], dept: '管理层', phone: '13800000002', email: 'wang@haichen.com', status: 1, createTime: '2025-09-02 10:00:00', lastLogin: '2026-08-28 18:20:33' },
  { id: 3, username: 'liCang', password: 'Wh@123456', name: '李仓管', roleIds: [3], dept: '仓储部', phone: '13800000003', email: 'licang@haichen.com', status: 1, createTime: '2025-09-03 10:00:00', lastLogin: '2026-08-29 07:55:01' },
  { id: 4, username: 'zhangDiao', password: 'Lg@123456', name: '张调度', roleIds: [4], dept: '物流部', phone: '13800000004', email: 'zhangdiao@haichen.com', status: 1, createTime: '2025-09-03 10:00:00', lastLogin: '2026-08-29 08:10:45' },
  { id: 5, username: 'caiWu', password: 'Fin@12345', name: '蔡财务', roleIds: [5], dept: '财务部', phone: '13800000005', email: 'caiwu@haichen.com', status: 1, createTime: '2025-09-04 10:00:00', lastLogin: '2026-08-28 17:40:22' },
  { id: 6, username: 'shujuYuan', password: 'Data@1234', name: '数据专员邓', roleIds: [6], dept: '信息中心', phone: '13800000006', email: 'deng@haichen.com', status: 1, createTime: '2025-09-04 10:00:00', lastLogin: '2026-08-29 08:00:00' },
  { id: 7, username: 'zhouCang', password: 'Wh@123456', name: '周仓管', roleIds: [3], dept: '仓储部', phone: '13800000007', email: 'zhou@haichen.com', status: 0, createTime: '2025-10-12 10:00:00', lastLogin: '2026-07-15 09:00:00' }
]

// 权限点：以模块:资源:动作 命名
export const permissions = [
  // 仓储
  { id: 101, code: 'warehouse:view', name: '仓储中心查看', pid: 0 },
  { id: 102, code: 'warehouse:goods:add', name: '新增货品', pid: 101 },
  { id: 103, code: 'warehouse:goods:edit', name: '编辑货品', pid: 101 },
  { id: 104, code: 'warehouse:goods:del', name: '删除货品', pid: 101 },
  { id: 105, code: 'warehouse:order:audit', name: '单据审核', pid: 101 },
  { id: 106, code: 'warehouse:order:add', name: '新增单据', pid: 101 },
  // 物流
  { id: 201, code: 'logistics:view', name: '物流中心查看', pid: 0 },
  { id: 202, code: 'logistics:alert:handle', name: '异常处理', pid: 201 },
  { id: 203, code: 'logistics:query:smart', name: '智能查询', pid: 201 },
  // 调度
  { id: 301, code: 'dispatch:view', name: '调度中心查看', pid: 0 },
  { id: 302, code: 'dispatch:assign', name: '调度指派', pid: 301 },
  // 分析
  { id: 401, code: 'analytics:view', name: '分析中心查看', pid: 0 },
  // 财务
  { id: 501, code: 'finance:view', name: '财务中心查看', pid: 0 },
  // 系统
  { id: 601, code: 'system:manage', name: '系统管理', pid: 0 },
  { id: 602, code: 'system:user:edit', name: '用户管理', pid: 601 }
]

// 角色-权限映射（admin 拥有 *）
export const rolePermissions = {
  1: '*',
  2: ['warehouse:view', 'logistics:view', 'logistics:alert:handle', 'dispatch:view', 'analytics:view', 'finance:view'],
  3: ['warehouse:view', 'warehouse:goods:add', 'warehouse:goods:edit', 'warehouse:order:add', 'warehouse:order:audit', 'logistics:view', 'analytics:view'],
  4: ['logistics:view', 'logistics:alert:handle', 'logistics:query:smart', 'dispatch:view', 'dispatch:assign', 'analytics:view'],
  5: ['warehouse:view', 'finance:view', 'analytics:view'],
  6: ['warehouse:view', 'logistics:view', 'dispatch:view', 'analytics:view', 'finance:view', 'system:manage', 'system:user:edit']
}

// ========== 仓库 ==========
export const warehouses = [
  { id: 1, code: 'WH-SH-001', name: '上海中心仓', type: '中心仓', address: '上海市浦东新区临港重装备产业区', area: 12000, manager: '李仓管', phone: '13800000003', status: 1, usage: 78, temp: 22, humidity: 55, createTime: '2019-01-15' },
  { id: 2, code: 'WH-CD-002', name: '成都区域仓', type: '区域仓', address: '成都市龙泉驿区物流大道8号', area: 6000, manager: '周仓管', phone: '13800000007', status: 1, usage: 65, temp: 24, humidity: 60, createTime: '2019-06-20' },
  { id: 3, code: 'WH-TEST-003', name: '测试前置仓', type: '前置仓', address: '深圳市南山区科技园', area: 1500, manager: '李仓管', phone: '13800000003', status: 1, usage: 92, temp: 25, humidity: 58, createTime: '2020-03-10' },
  { id: 4, code: 'WH-BJ-004', name: '北京区域仓', type: '区域仓', address: '北京市大兴区物流园', area: 5500, manager: '周仓管', phone: '13800000007', status: 0, usage: 0, temp: 0, humidity: 0, createTime: '2021-09-01' }
]

export const zones = [
  { id: 1, warehouseId: 1, code: 'A', name: 'A存储区', type: '存储区', capacity: 2000, used: 1560 },
  { id: 2, warehouseId: 1, code: 'B', name: 'B拣货区', type: '拣货区', capacity: 800, used: 410 },
  { id: 3, warehouseId: 1, code: 'C', name: 'C暂存区', type: '暂存区', capacity: 500, used: 320 },
  { id: 4, warehouseId: 1, code: 'D', name: 'D不良品区', type: '不良品区', capacity: 200, used: 45 },
  { id: 5, warehouseId: 2, code: 'A', name: 'A存储区', type: '存储区', capacity: 1200, used: 780 }
]

// ========== 货品 ==========
export const goods = [
  { id: 1, sku: 'HC-SP-001', name: '海辰储能电池模组 5kWh', spec: '48V/100Ah', category: '储能设备', unit: '台', shelfLife: 0, storageCond: '常温干燥', manufacturer: '海辰智储', price: 12800, image: '', status: 1, createTime: '2025-09-10' },
  { id: 2, sku: 'HC-SP-002', name: '海辰储能电池模组 10kWh', spec: '48V/200Ah', category: '储能设备', unit: '台', shelfLife: 0, storageCond: '常温干燥', manufacturer: '海辰智储', price: 23800, image: '', status: 1, createTime: '2025-09-10' },
  { id: 3, sku: 'HC-PC-003', name: '储能逆变器 5kW', spec: '单相/5kW', category: '电力电子', unit: '台', shelfLife: 0, storageCond: '防潮', manufacturer: '阳光电源', price: 8600, image: '', status: 1, createTime: '2025-09-12' },
  { id: 4, sku: 'HC-PC-004', name: '储能逆变器 10kW', spec: '三相/10kW', category: '电力电子', unit: '台', shelfLife: 0, storageCond: '防潮', manufacturer: '阳光电源', price: 15200, image: '', status: 1, createTime: '2025-09-12' },
  { id: 5, sku: 'HC-MS-005', name: '电池管理系统BMS', spec: '16串', category: '控制设备', unit: '套', shelfLife: 0, storageCond: '常温', manufacturer: '高特电子', price: 3200, image: '', status: 1, createTime: '2025-09-15' },
  { id: 6, sku: 'HC-MS-006', name: '能量管理系统EMS', spec: 'V2.0', category: '控制设备', unit: '套', shelfLife: 0, storageCond: '常温', manufacturer: '海辰智储', price: 18500, image: '', status: 1, createTime: '2025-09-15' },
  { id: 7, sku: 'HC-CS-007', name: '连接器组件', spec: '150A', category: '结构件', unit: '件', shelfLife: 0, storageCond: '常温', manufacturer: '中航光电', price: 280, image: '', status: 1, createTime: '2025-09-18' },
  { id: 8, sku: 'HC-CS-008', name: '电池支架', spec: '19英寸机架', category: '结构件', unit: '套', shelfLife: 0, storageCond: '常温', manufacturer: '本地代工', price: 650, image: '', status: 0, createTime: '2025-09-18' }
]

// ========== 库存 ==========
export const inventory = [
  { id: 1, sku: 'HC-SP-001', goodsName: '海辰储能电池模组 5kWh', batch: 'B202601', warehouseId: 1, warehouse: '上海中心仓', zone: 'A存储区', location: 'A-01-03', stock: 320, locked: 24, available: 296, updateTime: '2026-08-28 16:30' },
  { id: 2, sku: 'HC-SP-002', goodsName: '海辰储能电池模组 10kWh', batch: 'B202601', warehouseId: 1, warehouse: '上海中心仓', zone: 'A存储区', location: 'A-02-05', stock: 180, locked: 12, available: 168, updateTime: '2026-08-28 17:10' },
  { id: 3, sku: 'HC-PC-003', goodsName: '储能逆变器 5kW', batch: 'B202602', warehouseId: 1, warehouse: '上海中心仓', zone: 'B拣货区', location: 'B-01-02', stock: 95, locked: 8, available: 87, updateTime: '2026-08-29 08:15' },
  { id: 4, sku: 'HC-PC-004', goodsName: '储能逆变器 10kW', batch: 'B202602', warehouseId: 2, warehouse: '成都区域仓', zone: 'A存储区', location: 'A-01-08', stock: 60, locked: 0, available: 60, updateTime: '2026-08-27 15:00' },
  { id: 5, sku: 'HC-MS-005', goodsName: '电池管理系统BMS', batch: 'B202603', warehouseId: 1, warehouse: '上海中心仓', zone: 'A存储区', location: 'A-03-01', stock: 18, locked: 0, available: 18, updateTime: '2026-08-25 11:20' },
  { id: 6, sku: 'HC-MS-006', goodsName: '能量管理系统EMS', batch: 'B202603', warehouseId: 3, warehouse: '测试前置仓', zone: 'A存储区', location: 'A-01-01', stock: 8, locked: 0, available: 8, updateTime: '2026-08-20 09:00' },
  { id: 7, sku: 'HC-CS-007', goodsName: '连接器组件', batch: 'B202604', warehouseId: 1, warehouse: '上海中心仓', zone: 'C暂存区', location: 'C-02-04', stock: 5, locked: 0, available: 5, updateTime: '2026-08-15 14:00' },
  { id: 8, sku: 'HC-SP-001', goodsName: '海辰储能电池模组 5kWh', batch: 'B202512', warehouseId: 2, warehouse: '成都区域仓', zone: 'A存储区', location: 'A-02-01', stock: 145, locked: 10, available: 135, updateTime: '2026-08-26 10:30' }
]

// ========== 单据 ==========
export const orders = [
  { id: 1, orderNo: 'PO-20260828-00001', type: '采购入库', supplier: '宁德时代', warehouse: '上海中心仓', expectDate: '2026-08-25', amount: 640000, itemCount: 50, status: '已完成', creator: '李仓管', createTime: '2026-08-20 09:30', items: [{ sku: 'HC-SP-001', name: '海辰储能电池模组 5kWh', qty: 50, price: 12800 }] },
  { id: 2, orderNo: 'SO-20260829-00001', type: '销售出库', customer: '成都绿能科技', warehouse: '上海中心仓', expectDate: '2026-08-30', amount: 384000, itemCount: 30, status: '已审核', creator: '李仓管', createTime: '2026-08-29 08:20', items: [{ sku: 'HC-SP-001', name: '海辰储能电池模组 5kWh', qty: 30, price: 12800 }] },
  { id: 3, orderNo: 'PO-20260829-00002', type: '采购入库', supplier: '阳光电源', warehouse: '成都区域仓', expectDate: '2026-09-02', amount: 912000, itemCount: 60, status: '待审核', creator: '周仓管', createTime: '2026-08-29 08:45', items: [{ sku: 'HC-PC-004', name: '储能逆变器 10kW', qty: 60, price: 15200 }] },
  { id: 4, orderNo: 'SO-20260828-00002', type: '销售出库', customer: '北京华电新能源', warehouse: '上海中心仓', expectDate: '2026-08-31', amount: 119000, itemCount: 19, status: '已发运', creator: '李仓管', createTime: '2026-08-27 14:00', items: [{ sku: 'HC-PC-003', name: '储能逆变器 5kW', qty: 19, price: 8600 }, { sku: 'HC-MS-005', name: '电池管理系统BMS', qty: 5, price: 3200 }] },
  { id: 5, orderNo: 'TR-20260827-00001', type: '调拨单', fromWh: '上海中心仓', toWh: '成都区域仓', warehouse: '上海中心仓', expectDate: '2026-08-30', amount: 0, itemCount: 20, status: '拣货完成', creator: '李仓管', createTime: '2026-08-27 16:20', items: [{ sku: 'HC-SP-001', name: '海辰储能电池模组 5kWh', qty: 20, price: 12800 }] },
  { id: 6, orderNo: 'RT-20260826-00001', type: '退货单', customer: '深圳前海能源', warehouse: '测试前置仓', expectDate: '2026-08-28', amount: 25600, itemCount: 2, status: '已完成', creator: '李仓管', createTime: '2026-08-26 10:00', items: [{ sku: 'HC-SP-002', name: '海辰储能电池模组 10kWh', qty: 2, price: 12800 }] },
  { id: 7, orderNo: 'PO-20260825-00003', type: '采购入库', supplier: '高特电子', warehouse: '上海中心仓', expectDate: '2026-08-23', amount: 48000, itemCount: 15, status: '待审核', creator: '周仓管', createTime: '2026-08-25 11:00', items: [{ sku: 'HC-MS-005', name: '电池管理系统BMS', qty: 15, price: 3200 }] }
]

// ========== 客户/供应商 ==========
export const customers = [
  { id: 1, name: '成都绿能科技有限公司', type: '客户', level: 'A级', contact: '陈经理', phone: '028-88001122', address: '成都市高新区天府大道', credit: '良好', totalAmount: 2860000, lastOrder: '2026-08-29', createTime: '2025-03-10' },
  { id: 2, name: '北京华电新能源', type: '客户', level: 'A级', contact: '刘总', phone: '010-66003344', address: '北京市海淀区中关村', credit: '优秀', totalAmount: 5240000, lastOrder: '2026-08-27', createTime: '2024-11-20' },
  { id: 3, name: '深圳前海能源', type: '客户', level: 'B级', contact: '黄经理', phone: '0755-88005566', address: '深圳市前海合作区', credit: '良好', totalAmount: 980000, lastOrder: '2026-08-26', createTime: '2025-06-05' },
  { id: 4, name: '宁德时代', type: '供应商', level: '战略', contact: '采购王', phone: '0593-66007788', address: '宁德市蕉城区', credit: '优秀', totalAmount: 8600000, lastOrder: '2026-08-20', createTime: '2024-05-15' },
  { id: 5, name: '阳光电源', type: '供应商', level: '战略', contact: '渠道李', phone: '0551-66009900', address: '合肥市高新区', credit: '优秀', totalAmount: 6200000, lastOrder: '2026-08-29', createTime: '2024-07-08' },
  { id: 6, name: '高特电子', type: '供应商', level: 'A级', contact: '销售张', phone: '0755-33001122', address: '深圳市宝安区', credit: '良好', totalAmount: 1240000, lastOrder: '2026-08-25', createTime: '2025-01-12' },
  { id: 7, name: '中航光电', type: '供应商', level: 'A级', contact: '业务周', phone: '0379-66002233', address: '洛阳市涧西区', credit: '良好', totalAmount: 560000, lastOrder: '2026-08-15', createTime: '2025-02-18' }
]

export const visits = [
  { id: 1, customerId: 4, customerName: '宁德时代', content: '季度战略采购协议续签洽谈，确认Q4电池模组供应计划', date: '2026-08-20', visitor: '王建国', result: '已续签' },
  { id: 2, customerId: 5, customerName: '阳光电源', content: '逆变器到货质量抽检，沟通10kW型号技术参数升级', date: '2026-08-22', visitor: '李仓管', result: '跟进中' },
  { id: 3, customerId: 1, customerName: '成都绿能科技', content: '客户回访，确认储能项目交付进度与售后需求', date: '2026-08-25', visitor: '张调度', result: '客户满意' },
  { id: 4, customerId: 2, customerName: '北京华电新能源', content: '新订单需求沟通，预计9月新增采购120kWh储能系统', date: '2026-08-27', visitor: '王建国', result: '意向强烈' }
]

// ========== 物流 ==========
export const shipments = [
  { id: 1, trackingNo: 'YT20260828SH001', orderNo: 'SO-20260828-00002', customer: '北京华电新能源', fromCity: '上海', toCity: '北京', mode: '陆运', carrier: '海辰自有车队', vehicle: '沪A·88888', status: '运输中', departTime: '2026-08-28 09:00', eta: '2026-08-30 18:00', progress: 65 },
  { id: 2, trackingNo: 'YT20260827CD002', orderNo: 'SO-20260827-00005', customer: '成都绿能科技', fromCity: '上海', toCity: '成都', mode: '陆运', carrier: '挂靠车队-顺达物流', vehicle: '川A·66666', status: '已签收', departTime: '2026-08-27 08:00', eta: '2026-08-29 12:00', progress: 100 },
  { id: 3, trackingNo: 'HK20260825AIR01', orderNo: 'SO-20260824-00011', customer: '深圳前海能源', fromCity: '上海', toCity: '深圳', mode: '空运', carrier: '顺丰航空', vehicle: 'SF-1234', status: '运输中', departTime: '2026-08-29 06:30', eta: '2026-08-29 11:00', progress: 80 },
  { id: 4, trackingNo: 'HK20260820SEA01', orderNo: 'SO-20260818-00008', customer: '宁波港联物流', fromCity: '上海', toCity: '宁波', mode: '海运', carrier: '中远海运', vehicle: 'COSCO-88', status: '已签收', departTime: '2026-08-20 14:00', eta: '2026-08-21 08:00', progress: 100 },
  { id: 5, trackingNo: 'YT20260829SH003', orderNo: 'SO-20260829-00001', customer: '成都绿能科技', fromCity: '上海', toCity: '成都', mode: '陆运', carrier: '海辰自有车队', vehicle: '待指派', status: '待发运', departTime: '-', eta: '2026-09-01 18:00', progress: 0 }
]

export const trackPoints = {
  YT20260828SH001: [
    { time: '2026-08-28 09:00', location: '上海中心仓', desc: '已装车发运', status: 'done' },
    { time: '2026-08-28 14:30', location: '上海-昆山段', desc: '途经昆山服务区', status: 'done' },
    { time: '2026-08-29 03:20', location: '徐州枢纽', desc: '夜间行驶中', status: 'done' },
    { time: '2026-08-29 10:00', location: '济南枢纽', desc: '预计抵达', status: 'active' },
    { time: '2026-08-30 18:00', location: '北京朝阳仓', desc: '预计签收', status: 'pending' }
  ],
  YT20260827CD002: [
    { time: '2026-08-27 08:00', location: '上海中心仓', desc: '已装车发运', status: 'done' },
    { time: '2026-08-28 16:00', location: '汉中枢纽', desc: '途经汉中', status: 'done' },
    { time: '2026-08-29 12:00', location: '成都龙泉驿仓', desc: '客户已签收', status: 'done' }
  ],
  HK20260825AIR01: [
    { time: '2026-08-29 06:30', location: '上海浦东机场', desc: '货物装机', status: 'done' },
    { time: '2026-08-29 08:00', location: '起飞', desc: '航班SF-1234起飞', status: 'done' },
    { time: '2026-08-29 10:30', location: '深圳宝安机场', desc: '即将降落', status: 'active' },
    { time: '2026-08-29 11:00', location: '深圳前海仓', desc: '预计签收', status: 'pending' }
  ]
}

export const alerts = [
  { id: 1, level: '严重', title: '运单YT20260828SH001运输超时预警', type: '时效异常', shipmentNo: 'YT20260828SH001', content: '车辆沪A·88888在徐州枢纽滞留超2小时，预计延误6小时', status: '待处理', handler: '', createTime: '2026-08-29 05:30', suggestion: '建议立即联系司机核实路况，必要时启用备用车辆接力运输' },
  { id: 2, level: '警告', title: '深圳空运温度异常', type: '温控异常', shipmentNo: 'HK20260825AIR01', content: '货物舱温波动超出阈值(25℃±3℃)，当前28.5℃', status: '处理中', handler: '张调度', createTime: '2026-08-29 09:15', suggestion: '联系航司确认温控设备状态，到货后优先质检' },
  { id: 3, level: '警告', title: '海运运单报关延迟', type: '时效异常', shipmentNo: 'HK20260820SEA01', content: '宁波港报关单据审核滞后，影响清关时效', status: '已闭环', handler: '张调度', createTime: '2026-08-20 20:00', suggestion: '已协调代理加急处理，正常放行' },
  { id: 4, level: '提示', title: '成都线路天气预警', type: '环境预警', shipmentNo: 'YT20260829SH003', content: '未来24小时川陕高速局部暴雨，建议错峰发运', status: '待处理', handler: '', createTime: '2026-08-29 08:50', suggestion: '建议发运时间顺延至8月30日上午' },
  { id: 5, level: '严重', title: '挂靠车辆失联', type: '设备异常', shipmentNo: 'YT20260827CD002', content: '挂靠车辆川A·66666 GPS信号中断30分钟(已签收前)', status: '已闭环', handler: '张调度', createTime: '2026-08-29 11:30', suggestion: '司机手机欠费导致，已联系补缴，签收正常' }
]

// ========== 车辆与调度 ==========
export const vehicles = [
  { id: 1, plate: '沪A·88888', type: '自有', model: '解放J7重卡 9.6米', capacity: '20吨', driver: '赵师傅', phone: '13900000001', status: '运输中', gps: '在线', lastUpdate: '2026-08-29 10:05' },
  { id: 2, plate: '沪B·66666', type: '自有', model: '东风天龙 7.6米', capacity: '15吨', driver: '钱师傅', phone: '13900000002', status: '空闲', gps: '在线', lastUpdate: '2026-08-29 10:00' },
  { id: 3, plate: '川A·66666', type: '挂靠', model: '陕汽德龙 9.6米', capacity: '20吨', driver: '孙师傅', phone: '13900000003', status: '维修', gps: '离线', lastUpdate: '2026-08-28 18:00' },
  { id: 4, plate: '京A·99999', type: '自有', model: '欧曼EST 13米', capacity: '30吨', driver: '李师傅', phone: '13900000004', status: '空闲', gps: '在线', lastUpdate: '2026-08-29 09:50' },
  { id: 5, plate: '粤B·77777', type: '挂靠', model: '解放J6 6.8米', capacity: '10吨', driver: '周师傅', phone: '13900000005', status: '运输中', gps: '在线', lastUpdate: '2026-08-29 10:08' }
]

export const drivers = [
  { id: 1, name: '赵师傅', phone: '13900000001', license: 'A2', plate: '沪A·88888', age: 45, joinDate: '2023-03-01', status: '在职', trips: 128 },
  { id: 2, name: '钱师傅', phone: '13900000002', license: 'A2', plate: '沪B·66666', age: 38, joinDate: '2023-06-15', status: '在职', trips: 96 },
  { id: 3, name: '孙师傅', phone: '13900000003', license: 'A2', plate: '川A·66666', age: 50, joinDate: '2024-01-10', status: '休假', trips: 152 },
  { id: 4, name: '李师傅', phone: '13900000004', license: 'A2', plate: '京A·99999', age: 42, joinDate: '2023-09-20', status: '在职', trips: 110 },
  { id: 5, name: '周师傅', phone: '13900000005', license: 'A2', plate: '粤B·77777', age: 35, joinDate: '2024-05-08', status: '在职', trips: 64 }
]

export const dispatches = [
  { id: 1, dispatchNo: 'DD-20260828-001', shipmentNo: 'YT20260828SH001', fromCity: '上海', toCity: '北京', vehicle: '沪A·88888', driver: '赵师傅', cargo: '储能逆变器24台', weight: '8吨', status: '运输中', createTime: '2026-08-28 08:30' },
  { id: 2, dispatchNo: 'DD-20260827-002', shipmentNo: 'YT20260827CD002', fromCity: '上海', toCity: '成都', vehicle: '川A·66666', driver: '孙师傅', cargo: '电池模组30台', weight: '6吨', status: '已完成', createTime: '2026-08-27 07:30' },
  { id: 3, dispatchNo: 'DD-20260829-003', shipmentNo: 'YT20260829SH003', fromCity: '上海', toCity: '成都', vehicle: '待指派', driver: '待指派', cargo: '电池模组30台', weight: '6吨', status: '待调度', createTime: '2026-08-29 08:25' },
  { id: 4, dispatchNo: 'DD-20260829-004', shipmentNo: 'HK20260825AIR01', fromCity: '上海', toCity: '深圳', vehicle: 'SF-1234(航空)', driver: '顺丰航空', cargo: 'EMS系统8套', weight: '0.5吨', status: '运输中', createTime: '2026-08-29 06:00' }
]

// ========== 分析数据 ==========
export const purchaseAnalysis = {
  dates: ['2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08'],
  amounts: [1860000, 2240000, 1980000, 2680000, 3120000, 2960000],
  quantities: [148, 176, 162, 210, 248, 235]
}

export const salesAnalysis = {
  dates: ['2026-03', '2026-04', '2026-05', '2026-06', '2026-07', '2026-08'],
  amounts: [1620000, 2080000, 2350000, 2520000, 2880000, 3240000],
  quantities: [128, 168, 192, 205, 232, 268]
}

export const retentionAnalysis = [
  { sku: 'HC-SP-001', name: '海辰储能电池模组 5kWh', warehouse: '上海中心仓', inDate: '2025-11-20', days: 283, stock: 320, lastOut: '2026-08-29', status: '正常' },
  { sku: 'HC-MS-005', name: '电池管理系统BMS', warehouse: '上海中心仓', inDate: '2025-08-10', days: 384, stock: 18, lastOut: '2026-06-15', status: '滞留预警' },
  { sku: 'HC-CS-007', name: '连接器组件', warehouse: '上海中心仓', inDate: '2025-05-12', days: 474, stock: 5, lastOut: '2026-03-20', status: '长期滞留' },
  { sku: 'HC-PC-004', name: '储能逆变器 10kW', warehouse: '成都区域仓', inDate: '2026-02-28', days: 182, stock: 60, lastOut: '2026-08-20', status: '正常' },
  { sku: 'HC-MS-006', name: '能量管理系统EMS', warehouse: '测试前置仓', inDate: '2025-09-01', days: 362, stock: 8, lastOut: '2026-08-20', status: '正常' }
]

// 驾驶舱综合指标
export const dashboardData = {
  kpis: [
    { key: 'todayIn', label: '今日入库', value: 50, unit: '件', trend: 12.5, icon: 'Goods', color: '#1677ff' },
    { key: 'todayOut', label: '今日出库', value: 64, unit: '件', trend: 8.3, icon: 'Sell', color: '#52c41a' },
    { key: 'stockWarn', label: '库存不足预警', value: 3, unit: '项', trend: -2, icon: 'Warning', color: '#faad14' },
    { key: 'shipments', label: '在途运单', value: 3, unit: '单', trend: 1, icon: 'Van', color: '#722ed1' },
    { key: 'alerts', label: '待处理异常', value: 2, unit: '条', trend: -1, icon: 'Bell', color: '#ff4d4f' },
    { key: 'usage', label: '平均库容率', value: 78, unit: '%', trend: 3.2, icon: 'DataAnalysis', color: '#13c2c2' }
  ],
  inventoryTrend: {
    dates: ['08-23', '08-24', '08-25', '08-26', '08-27', '08-28', '08-29'],
    in: [120, 95, 180, 60, 50, 88, 50],
    out: [85, 110, 95, 130, 75, 92, 64]
  },
  transportMode: [
    { name: '陆运', value: 68 },
    { name: '空运', value: 12 },
    { name: '海运', value: 20 }
  ],
  alertTrend: {
    dates: ['08-23', '08-24', '08-25', '08-26', '08-27', '08-28', '08-29'],
    values: [3, 5, 2, 4, 6, 3, 2]
  },
  topCustomers: [
    { name: '北京华电新能源', value: 524 },
    { name: '宁德时代', value: 860 },
    { name: '阳光电源', value: 620 },
    { name: '成都绿能科技', value: 286 },
    { name: '高特电子', value: 124 }
  ]
}

// ========== 财务 ==========
export const receivables = [
  { id: 1, billNo: 'AR-20260829-001', customer: '成都绿能科技', orderNo: 'SO-20260829-00001', amount: 384000, period: '2026-09', status: '待对账', createTime: '2026-08-29 08:25' },
  { id: 2, billNo: 'AR-20260827-002', customer: '北京华电新能源', orderNo: 'SO-20260828-00002', amount: 119000, period: '2026-09', status: '已对账', createTime: '2026-08-27 14:05' },
  { id: 3, billNo: 'AR-20260820-003', customer: '深圳前海能源', orderNo: 'SO-20260818-00008', amount: 256000, period: '2026-08', status: '已收款', createTime: '2026-08-20 14:10' },
  { id: 4, billNo: 'AR-20260827-004', customer: '成都绿能科技', orderNo: 'SO-20260827-00005', amount: 432000, period: '2026-08', status: '已收款', createTime: '2026-08-27 08:10' }
]

export const payables = [
  { id: 1, billNo: 'AP-20260820-001', supplier: '宁德时代', orderNo: 'PO-20260828-00001', amount: 640000, period: '2026-09', status: '待付款', createTime: '2026-08-20 09:35' },
  { id: 2, billNo: 'AP-20260825-002', supplier: '高特电子', orderNo: 'PO-20260825-00003', amount: 48000, period: '2026-09', status: '待付款', createTime: '2026-08-25 11:05' },
  { id: 3, billNo: 'AP-20260829-003', supplier: '阳光电源', orderNo: 'PO-20260829-00002', amount: 912000, period: '2026-09', status: '待对账', createTime: '2026-08-29 08:50' },
  { id: 4, billNo: 'AP-20260810-004', supplier: '中航光电', orderNo: 'PO-20260805-00009', amount: 56000, period: '2026-08', status: '已付款', createTime: '2026-08-10 10:00' }
]

// ========== 系统 ==========
export const operationLogs = [
  { id: 1, username: 'admin', module: '系统管理', action: '登录系统', ip: '192.168.1.10', status: '成功', time: '2026-08-29 08:30:12' },
  { id: 2, username: 'liCang', module: '仓储管理', action: '新增销售出库单 SO-20260829-00001', ip: '192.168.1.22', status: '成功', time: '2026-08-29 08:20:45' },
  { id: 3, username: 'liCang', module: '仓储管理', action: '审核采购入库单 PO-20260828-00001', ip: '192.168.1.22', status: '成功', time: '2026-08-29 08:15:30' },
  { id: 4, username: 'zhangDiao', module: '物流管理', action: '处理异常预警 #1', ip: '192.168.1.33', status: '成功', time: '2026-08-29 09:20:18' },
  { id: 5, username: 'caiWu', module: '财务对账', action: '确认收款 AR-20260820-003', ip: '192.168.1.44', status: '成功', time: '2026-08-28 17:40:22' },
  { id: 6, username: 'unknown', module: '系统管理', action: '登录系统', ip: '10.0.0.88', status: '失败', time: '2026-08-29 03:12:00', remark: '密码错误连续3次，账号锁定5分钟' },
  { id: 7, username: 'shujuYuan', module: '系统管理', action: '修改库存预警阈值参数', ip: '192.168.1.55', status: '成功', time: '2026-08-28 16:20:00' }
]

export const systemConfig = {
  warnStock: 20,
  warnExcess: 90,
  warnTimeout: 60,
  loginLockCount: 3,
  loginLockMinutes: 5,
  sessionTimeout: 30,
  dataRetention: 365
}

export const dataDict = [
  { id: 1, type: '仓库类型', code: 'warehouse_type', items: ['中心仓', '区域仓', '前置仓'] },
  { id: 2, type: '货品品类', code: 'goods_category', items: ['储能设备', '电力电子', '控制设备', '结构件'] },
  { id: 3, type: '计量单位', code: 'unit', items: ['台', '套', '件', '箱', '托'] },
  { id: 4, type: '运输方式', code: 'transport_mode', items: ['陆运', '空运', '海运'] },
  { id: 5, type: '客户等级', code: 'customer_level', items: ['战略', 'A级', 'B级', 'C级'] },
  { id: 6, type: '单据状态', code: 'order_status', items: ['待审核', '已审核', '拣货完成', '已发运', '已完成'] }
]

export const notifications = [
  { id: 1, type: 'alert', title: '严重预警：运单YT20260828SH001运输超时', content: '车辆在徐州枢纽滞留超2小时', time: '2026-08-29 05:30', read: false },
  { id: 2, type: 'audit', title: '待审核：采购入库单 PO-20260829-00002', content: '阳光电源 60台逆变器，金额912,000元', time: '2026-08-29 08:50', read: false },
  { id: 3, type: 'audit', title: '待审核：采购入库单 PO-20260825-00003', content: '高特电子 15套BMS，金额48,000元', time: '2026-08-29 08:45', read: false },
  { id: 4, type: 'system', title: '系统通知：本周数据接入量统计', content: '本周累计处理物流数据38.6TB，日均5.5TB', time: '2026-08-29 08:00', read: true },
  { id: 5, type: 'dispatch', title: '待调度：运单YT20260829SH003', content: '上海→成都，需指派车辆', time: '2026-08-29 08:25', read: false }
]

export const smartQueryHistory = [
  { id: 1, query: '昨天发往成都的货到哪了？', result: '运单YT20260827CD002已于08-29 12:00抵达成都龙泉驿仓并由客户签收。', time: '2026-08-29 09:00' },
  { id: 2, query: '当前有哪些待处理的物流异常？', result: '共2条待处理异常：1) 运单YT20260828SH001运输超时(严重)；2) 成都线路暴雨预警(提示)。', time: '2026-08-29 09:05' }
]

// 数据源监控（HC002 12类数据源）
export const dataSources = [
  { id: 1, name: '海运-AIS船舶定位', type: '海运', status: '在线', latency: '120ms', dailyVolume: '1.2TB', accuracy: '98.5%' },
  { id: 2, name: '空运-航司货运系统', type: '空运', status: '在线', latency: '85ms', dailyVolume: '0.4TB', accuracy: '99.1%' },
  { id: 3, name: '陆运-GPS车联网', type: '陆运', status: '在线', latency: '95ms', dailyVolume: '1.8TB', accuracy: '97.8%' },
  { id: 4, name: '快递-顺丰接口', type: '陆运', status: '在线', latency: '110ms', dailyVolume: '0.6TB', accuracy: '99.0%' },
  { id: 5, name: '港口-EDI报文', type: '海运', status: '在线', latency: '150ms', dailyVolume: '0.3TB', accuracy: '96.5%' },
  { id: 6, name: '海关-报关状态', type: '海运', status: '降级', latency: '320ms', dailyVolume: '0.1TB', accuracy: '94.2%' }
]
