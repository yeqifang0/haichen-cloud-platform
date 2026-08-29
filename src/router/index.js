import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { title: '首页' },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '综合运营看板', icon: 'Odometer', affix: true }
      },
      {
        path: 'workbench',
        name: 'Workbench',
        component: () => import('@/views/workbench/index.vue'),
        meta: { title: '个人工作台', icon: 'User' }
      }
    ]
  },
  {
    path: '/warehouse',
    component: Layout,
    redirect: '/warehouse/monitor',
    meta: { title: '仓储管理中心', icon: 'Box', permission: 'warehouse:view' },
    children: [
      {
        path: 'monitor',
        name: 'WhMonitor',
        component: () => import('@/views/warehouse/Monitor.vue'),
        meta: { title: '仓库监控', icon: 'Monitor' }
      },
      {
        path: 'warehouse',
        name: 'Warehouse',
        component: () => import('@/views/warehouse/Warehouse.vue'),
        meta: { title: '仓库管理', icon: 'House' }
      },
      {
        path: 'goods',
        name: 'Goods',
        component: () => import('@/views/warehouse/Goods.vue'),
        meta: { title: '货品管理', icon: 'Goods' }
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('@/views/warehouse/Inventory.vue'),
        meta: { title: '库存查询', icon: 'Files' }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/warehouse/Orders.vue'),
        meta: { title: '单据管理', icon: 'Document' }
      },
      {
        path: 'customers',
        name: 'Customers',
        component: () => import('@/views/warehouse/Customers.vue'),
        meta: { title: '客户/供应商', icon: 'UserFilled' }
      }
    ]
  },
  {
    path: '/logistics',
    component: Layout,
    redirect: '/logistics/track',
    meta: { title: '物流信息中心', icon: 'Van', permission: 'logistics:view' },
    children: [
      {
        path: 'track',
        name: 'Track',
        component: () => import('@/views/logistics/Track.vue'),
        meta: { title: '实时物流追踪', icon: 'Position' }
      },
      {
        path: 'alerts',
        name: 'Alerts',
        component: () => import('@/views/logistics/Alerts.vue'),
        meta: { title: '智能预警中心', icon: 'Warning' }
      },
      {
        path: 'smart-query',
        name: 'SmartQuery',
        component: () => import('@/views/logistics/SmartQuery.vue'),
        meta: { title: '智能查询助手', icon: 'ChatDotRound' }
      },
      {
        path: 'datasource',
        name: 'DataSource',
        component: () => import('@/views/logistics/DataSource.vue'),
        meta: { title: '多源数据接入', icon: 'Connection' }
      }
    ]
  },
  {
    path: '/dispatch',
    component: Layout,
    redirect: '/dispatch/vehicles',
    meta: { title: '车辆调度中心', icon: 'Truck', permission: 'dispatch:view' },
    children: [
      {
        path: 'vehicles',
        name: 'Vehicles',
        component: () => import('@/views/dispatch/Vehicles.vue'),
        meta: { title: '车辆管理', icon: 'Van' }
      },
      {
        path: 'drivers',
        name: 'Drivers',
        component: () => import('@/views/dispatch/Drivers.vue'),
        meta: { title: '司机管理', icon: 'User' }
      },
      {
        path: 'list',
        name: 'DispatchList',
        component: () => import('@/views/dispatch/Dispatch.vue'),
        meta: { title: '调度管理', icon: 'Operation' }
      }
    ]
  },
  {
    path: '/analytics',
    component: Layout,
    redirect: '/analytics/purchase',
    meta: { title: '大数据分析中心', icon: 'DataAnalysis', permission: 'analytics:view' },
    children: [
      {
        path: 'purchase',
        name: 'PurchaseAnalysis',
        component: () => import('@/views/analytics/Purchase.vue'),
        meta: { title: '采购入库分析', icon: 'ShoppingCart' }
      },
      {
        path: 'sales',
        name: 'SalesAnalysis',
        component: () => import('@/views/analytics/Sales.vue'),
        meta: { title: '销售出库分析', icon: 'Sell' }
      },
      {
        path: 'retention',
        name: 'RetentionAnalysis',
        component: () => import('@/views/analytics/Retention.vue'),
        meta: { title: '滞留时长分析', icon: 'Timer' }
      },
      {
        path: 'logistics',
        name: 'LogisticsAnalysis',
        component: () => import('@/views/analytics/Logistics.vue'),
        meta: { title: '物流时效分析', icon: 'TrendCharts' }
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/receivable',
    meta: { title: '财务对账中心', icon: 'Money', permission: 'finance:view' },
    children: [
      {
        path: 'receivable',
        name: 'Receivable',
        component: () => import('@/views/finance/Receivable.vue'),
        meta: { title: '应收对账', icon: 'Wallet' }
      },
      {
        path: 'payable',
        name: 'Payable',
        component: () => import('@/views/finance/Payable.vue'),
        meta: { title: '应付对账', icon: 'CreditCard' }
      },
      {
        path: 'summary',
        name: 'FinanceSummary',
        component: () => import('@/views/finance/Summary.vue'),
        meta: { title: '财务总览', icon: 'DataLine' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'Setting', permission: 'system:manage' },
    children: [
      {
        path: 'user',
        name: 'SysUser',
        component: () => import('@/views/system/User.vue'),
        meta: { title: '用户管理', icon: 'User' }
      },
      {
        path: 'role',
        name: 'SysRole',
        component: () => import('@/views/system/Role.vue'),
        meta: { title: '角色权限', icon: 'UserFilled' }
      },
      {
        path: 'log',
        name: 'SysLog',
        component: () => import('@/views/system/Log.vue'),
        meta: { title: '操作日志', icon: 'Document' }
      },
      {
        path: 'config',
        name: 'SysConfig',
        component: () => import('@/views/system/Config.vue'),
        meta: { title: '参数设置', icon: 'Tools' }
      },
      {
        path: 'dict',
        name: 'SysDict',
        component: () => import('@/views/system/Dict.vue'),
        meta: { title: '数据字典', icon: 'Notebook' }
      }
    ]
  },
  {
    path: '/profile',
    component: Layout,
    meta: { hidden: true },
    children: [
      {
        path: '',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: { title: '个人中心', icon: 'User' }
      }
    ]
  },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/404.vue'), meta: { hidden: true } }
]

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})

export default router
