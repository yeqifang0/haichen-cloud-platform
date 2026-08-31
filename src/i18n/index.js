import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import enUS from './en-US'

const SUPPORTED = ['zh-CN', 'en-US']

// Element Plus locale 对象引用（由 main.js 注入）
let epLocaleRef = null

export function setEPLocaleRef(refObj) {
  epLocaleRef = refObj
}

function getInitialLocale() {
  const saved = localStorage.getItem('haichen_locale')
  if (saved && SUPPORTED.includes(saved)) return saved
  const nav = navigator.language || ''
  return nav.toLowerCase().startsWith('en') ? 'en-US' : 'zh-CN'
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

export function setLocale(lang) {
  if (!SUPPORTED.includes(lang)) return
  i18n.global.locale.value = lang
  localStorage.setItem('haichen_locale', lang)
  // 同步 Element Plus locale
  const epLang = lang === 'en-US' ? 'en' : 'zh-cn'
  import(`element-plus/es/locale/lang/${epLang}.js`).then((mod) => {
    if (epLocaleRef) {
      epLocaleRef.value = mod.default
    }
  }).catch(() => {})
}

export function getLocale() {
  return i18n.global.locale.value
}

export function toggleLocale() {
  return setLocale(getLocale() === 'zh-CN' ? 'en-US' : 'zh-CN')
}

export default i18n
