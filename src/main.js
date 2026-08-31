import { createApp, ref } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import router from './router'
import permissionDirective from './utils/permission'
import i18n, { getLocale, setEPLocaleRef } from './i18n'
import './styles/index.css'
import './permission'

// 根据初始语言选择 Element Plus locale
const initialLocale = getLocale()
const epLocale = ref(initialLocale === 'en-US' ? en : zhCn)

// 把 ref 传给 i18n 模块，让 setLocale() 能动态更新 Element Plus locale
setEPLocaleRef(epLocale)

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(i18n)

// Element Plus locale 配置：使用 provide 方式让运行时切换生效
app.use(ElementPlus, {
  locale: epLocale.value
})

// 全局 provide 响应式的 EP locale，让 Element Plus 组件能响应语言切换
app.provide('el-locale', epLocale)

app.directive('permission', permissionDirective)

app.mount('#app')
