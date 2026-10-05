/* eslint-disable @typescript-eslint/no-var-requires */
const { createThemeColors } = require('./utils') as {
  createThemeColors: (primary: string, font: string | null, isDark: boolean) => LX.Theme['config']['themeColors']
}

// 预设主色，第一个是默认的香槟金
export const PRESET_PRIMARY_COLORS = [
  { name: '香槟金', hex: '#D4B98C' },
  { name: '玫瑰', hex: '#D98A9B' },
  { name: '海蓝', hex: '#5B8DB8' },
  { name: '薄荷', hex: '#6FB89A' },
  { name: '暮紫', hex: '#9A86C4' },
] as const

// '#D4B98C' 或 '#fff' -> 'd4b98c'，格式不对返回 null
export const normalizeHex = (hex: string): string | null => {
  let h = hex.trim().replace(/^#/, '').toLowerCase()
  if (h.length == 3) h = h.split('').map(c => c + c).join('')
  return /^[0-9a-f]{6}$/.test(h) ? h : null
}

const hexToRgb = (hex6: string) => {
  const n = parseInt(hex6, 16)
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`
}

// 颜色和深浅直接写进 id，重启后能从 id 还原
export const makeCustomThemeId = (hex: string, isDark: boolean): string | null => {
  const h = normalizeHex(hex)
  return h ? `custom_${h}_${isDark ? 'd' : 'l'}` : null
}

export const parseCustomThemeId = (id: string) => {
  const m = /^custom_([0-9a-f]{6})_(d|l)$/.exec(id)
  return m ? { hex: `#${m[1]}`, isDark: m[2] == 'd' } : null
}

export const isCustomPrimaryId = (id: string) => parseCustomThemeId(id) != null

export const buildCustomPrimaryTheme = (hex: string, isDark: boolean): LX.Theme | null => {
  const h = normalizeHex(hex)
  const id = makeCustomThemeId(hex, isDark)
  if (!h || !id) return null

  const themeColors = createThemeColors(
    hexToRgb(h),
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
    id,
    name: '自定义主色',
    isDark,
    isCustom: true,
    config: { themeColors, extInfo },
  } as unknown as LX.Theme
}
