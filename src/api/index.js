import mock from '@/mock'

// 统一 API 入口（当前为 mock，可无缝替换为真实后端）
export default mock

export const authApi = mock.auth
export const dashboardApi = mock.dashboard
export const warehouseApi = mock.warehouse
export const logisticsApi = mock.logistics
export const dispatchApi = mock.dispatch
export const analyticsApi = mock.analytics
export const financeApi = mock.finance
export const systemApi = mock.system
