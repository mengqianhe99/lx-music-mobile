/* eslint-disable @typescript-eslint/no-var-requires */
import { getAllThemes, saveTheme } from '@/theme/themes'
import { applyTheme } from '@/core/theme'
import { updateSetting } from '@/core/common'

const { createThemeColors } = require('./utils') as {
  createThemeColors: (primary: string, font: string | null, isDark: boolean) => LX.Theme['config']['themeColors']
}

export const CUSTOM_PRIMARY_ID = 'custom_primary'

// 预设主色，第一个是默认的香槟金
export const PRESET_PRIMARY_COLORS = [
  { name: '香槟金', hex: '#D4B98C' },
  { name: '玫瑰', hex: '#D98A9B' },
  { name: '海蓝', hex: '#5B8DB8' },
  { name: '薄荷', hex: '#6FB89A' },
  { name: '暮紫', hex: '#9A86C4' },
] as const

// '#D4B98C' 或 '#fff' -> 'rgb(212, 185, 140)'，格式不对返回 null
export const hexToRgb = (hex: string): string | null => {
  let h = hex.trim().replace(/^#/, '')
  if (h.length == 3) h = h.split('').map(c => c + c).join('')
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null
  const n = parseInt(h, 16)
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`
}

export const buildCustomPrimaryTheme = (hex: string, isDark: boolean): LX.Theme | null => {
  const primary = hexToRgb(hex)
  if (!primary) return null

  const themeColors = createThemeColors(
    primary,
    isDark ? 'rgb(255, 255, 255)' : 'rgb(33, 33, 33)',
    isDark,
  )

  const extInfo = isDark
    ? {
        'c-app-background': 'rgba(11, 11, 15, 1)',
        'c-main-background': 'rgba(11, 11, 15, 1)',
        'bg-image': '',
        'bg-image-position': 'center',
        'bg-image-size': 'cover',
        'c-badge-primary': 'var(c-primary-dark-200)',
        'c-badge-secondary': 'var(c-primary)',
        'c-badge-tertiary': 'var(c-primary-dark-300)',
      }
    : {
        'c-app-background': 'var(c-primary-light-600-alpha-700)',
        'c-main-background': 'rgba(255, 255, 255, 1)',
        'bg-image': '',
        'bg-image-position': 'center',
        'bg-image-size': 'cover',
        'c-badge-primary': 'var(c-primary)',
        'c-badge-secondary': 'var(c-primary-light-100)',
        'c-badge-tertiary': 'var(c-primary-light-100)',
      }

  return {
    id: CUSTOM_PRIMARY_ID,
    name: '自定义主色',
    isDark,
    isCustom: true,
    config: { themeColors, extInfo },
  } as unknown as LX.Theme
}

// 保存、记住选择并立即生效，成功返回主题 id，颜色格式不对返回 null
export const applyCustomPrimary = async(hex: string, isDark: boolean): Promise<string | null> => {
  const theme = buildCustomPrimaryTheme(hex, isDark)
  if (!theme) return null
  await getAllThemes() // 确保用户主题列表已初始化
  await saveTheme(theme)
  updateSetting({ 'theme.id': theme.id })
  // 不用 core/theme 的 setTheme：它在 id 相同时会跳过，换颜色就不生效了
  // 传副本，因为 buildActiveThemeColors 会修改传入对象
  applyTheme(JSON.parse(JSON.stringify(theme)) as LX.Theme)
  return theme.id
}
