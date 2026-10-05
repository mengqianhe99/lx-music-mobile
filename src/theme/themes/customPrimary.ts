import { applyTheme } from '@/core/theme'
import { updateSetting } from '@/core/common'
import { buildCustomPrimaryTheme } from './customTheme'

// 记住选择并立即生效，成功返回主题 id，颜色格式不对返回 null
export const applyCustomPrimary = async(hex: string, isDark: boolean): Promise<string | null> => {
  const theme = buildCustomPrimaryTheme(hex, isDark)
  if (!theme) return null
  updateSetting({ 'theme.id': theme.id })
  // 传副本，因为 buildActiveThemeColors 会修改传入对象
  applyTheme(JSON.parse(JSON.stringify(theme)) as LX.Theme)
  return theme.id
}
