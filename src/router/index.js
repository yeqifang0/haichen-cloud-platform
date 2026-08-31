import { createRouter, createWebHashHistory } from 'vue-router'

// 注意：Layout 使用懒加载而非静态 import，以打破
// router/index.js <-> Layout <-> Sidebar(引用 asyncRoutes) 的循环依赖，
// 否则生产构建后会触发 TDZ 错误 "Cannot access 'X' before initialization"。
const Layout = () => import('@/layout/index.vue')

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { title: 'menu.home' },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: 'menu.dashboard', icon: 'Odometer', affix: true }
      },
      {
        path: 'workbench',
        name: 'Workbench',
        component: () => import('@/views/workbench/index.vue'),
        meta: { title: 'menu.workbench', icon: 'User' }
      }
    ]
  },
  {
    path: '/warehouse',
    component: Layout,
    redirect: '/warehouse/monitor',
    meta: { title: 'menu.warehouseCenter', icon: 'Box', permission: 'warehouse:view' },
    children: [
      {
        path: 'monitor',
        name: 'WhMonitor',
        component: () => import('@/views/warehouse/Monitor.vue'),
        meta: { title: 'menu.warehouseMonitor', icon: 'Monitor' }
      },
      {
        path: 'warehouse',
        name: 'Warehouse',
        component: () => import('@/views/warehouse/Warehouse.vue'),
        meta: { title: 'menu.warehouseList', icon: 'House' }
      },
      {
        path: 'goods',
        name: 'Goods',
        component: () => import('@/views/warehouse/Goods.vue'),
        meta: { title: 'menu.goods', icon: 'Goods' }
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('@/views/warehouse/Inventory.vue'),
        meta: { title: 'menu.stock', icon: 'Files' }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/warehouse/Orders.vue'),
        meta: { title: 'menu.orderList', icon: 'Document' }
      },
      {
        path: 'customers',
        name: 'Customers',
        component: () => import('@/views/warehouse/Customers.vue'),
        meta: { title: 'menu.customerSupplier', icon: 'UserFilled' }
      }
    ]
  },
  {
    path: '/logistics',
    component: Layout,
    redirect: '/logistics/track',
    meta: { title: 'menu.logisticsCenter', icon: 'Van', permission: 'logistics:view' },
    children: [
      {
        path: 'track',
        name: 'Track',
        component: () => import('@/views/logistics/Track.vue'),
        meta: { title: 'menu.tracking', icon: 'Position' }
      },
      {
        path: 'alerts',
        name: 'Alerts',
        component: () => import('@/views/logistics/Alerts.vue'),
        meta: { title: 'menu.alerts', icon: 'Warning' }
      },
      {
        path: 'smart-query',
        name: 'SmartQuery',
        component: () => import('@/views/logistics/SmartQuery.vue'),
        meta: { title: 'menu.smartQuery', icon: 'ChatDotRound' }
      },
      {
        path: 'datasource',
        name: 'DataSource',
        component: () => import('@/views/logistics/DataSource.vue'),
        meta: { title: 'menu.dataSource', icon: 'Connection' }
      }
    ]
  },
  {
    path: '/dispatch',
    component: Layout,
    redirect: '/dispatch/vehicles',
    meta: { title: 'menu.dispatchCenter', icon: 'Truck', permission: 'dispatch:view' },
    children: [
      {
        path: 'vehicles',
        name: 'Vehicles',
        component: () => import('@/views/dispatch/Vehicles.vue'),
        meta: { title: 'menu.vehicles', icon: 'Van' }
      },
      {
        path: 'drivers',
        name: 'Drivers',
        component: () => import('@/views/dispatch/Drivers.vue'),
        meta: { title: 'menu.drivers', icon: 'User' }
      },
      {
        path: 'list',
        name: 'DispatchList',
        component: () => import('@/views/dispatch/Dispatch.vue'),
        meta: { title: 'menu.dispatch', icon: 'Operation' }
      }
    ]
  },
  {
    path: '/analytics',
    component: Layout,
    redirect: '/analytics/purchase',
    meta: { title: 'menu.analyticsCenter', icon: 'DataAnalysis', permission: 'analytics:view' },
    children: [
      {
        path: 'purchase',
        name: 'PurchaseAnalysis',
        component: () => import('@/views/analytics/Purchase.vue'),
        meta: { title: 'menu.purchaseAnalysis', icon: 'ShoppingCart' }
      },
      {
        path: 'sales',
        name: 'SalesAnalysis',
        component: () => import('@/views/analytics/Sales.vue'),
        meta: { title: 'menu.salesAnalysis', icon: 'Sell' }
      },
      {
        path: 'retention',
        name: 'RetentionAnalysis',
        component: () => import('@/views/analytics/Retention.vue'),
        meta: { title: 'menu.retentionAnalysis', icon: 'Timer' }
      },
      {
        path: 'logistics',
        name: 'LogisticsAnalysis',
        component: () => import('@/views/analytics/Logistics.vue'),
        meta: { title: 'menu.logisticsAnalysis', icon: 'TrendCharts' }
      }
    ]
  },
  {
    path: '/finance',
    component: Layout,
    redirect: '/finance/receivable',
    meta: { title: 'menu.financeCenter', icon: 'Money', permission: 'finance:view' },
    children: [
      {
        path: 'receivable',
        name: 'Receivable',
        component: () => import('@/views/finance/Receivable.vue'),
        meta: { title: 'menu.receivable', icon: 'Wallet' }
      },
      {
        path: 'payable',
        name: 'Payable',
        component: () => import('@/views/finance/Payable.vue'),
        meta: { title: 'menu.payable', icon: 'CreditCard' }
      },
      {
        path: 'summary',
        name: 'FinanceSummary',
        component: () => import('@/views/finance/Summary.vue'),
        meta: { title: 'menu.financeSummary', icon: 'DataLine' }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    meta: { title: 'menu.systemCenter', icon: 'Setting', permission: 'system:manage' },
    children: [
      {
        path: 'user',
        name: 'SysUser',
        component: () => import('@/views/system/User.vue'),
        meta: { title: 'menu.userList', icon: 'User' }
      },
      {
        path: 'role',
        name: 'SysRole',
        component: () => import('@/views/system/Role.vue'),
        meta: { title: 'menu.role', icon: 'UserFilled' }
      },
      {
        path: 'log',
        name: 'SysLog',
        component: () => import('@/views/system/Log.vue'),
        meta: { title: 'menu.logs', icon: 'Document' }
      },
      {
        path: 'config',
        name: 'SysConfig',
        component: () => import('@/views/system/Config.vue'),
        meta: { title: 'menu.config', icon: 'Tools' }
      },
      {
        path: 'dict',
        name: 'SysDict',
        component: () => import('@/views/system/Dict.vue'),
        meta: { title: 'menu.dictionary', icon: 'Notebook' }
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
        meta: { title: 'menu.profile', icon: 'User' }
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
