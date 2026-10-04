import { memo, useCallback, useEffect, useState } from 'react'
import { View, TouchableOpacity, TextInput } from 'react-native'
import { useSettingValue } from '@/store/setting/hook'
import { useTheme } from '@/store/theme/hook'

import SubTitle from '../../components/SubTitle'
import Text from '@/components/common/Text'
import { createStyle } from '@/utils/tools'
import { getAllThemes } from '@/theme/themes'
import { CUSTOM_PRIMARY_ID, PRESET_PRIMARY_COLORS, applyCustomPrimary } from '@/theme/themes/customPrimary'

const normalizeHex = (hex: string) => hex.trim().replace(/^#/, '').toLowerCase()

// 'rgb(212, 185, 140)' -> '#d4b98c'
const rgbToHex = (rgb: string) => {
  const nums = rgb.match(/\d+/g)
  if (!nums || nums.length < 3) return null
  return '#' + nums.slice(0, 3).map(n => Number(n).toString(16).padStart(2, '0')).join('')
}

export default memo(() => {
  const theme = useTheme()
  const activeId = useSettingValue('theme.id')
  const isActive = activeId == CUSTOM_PRIMARY_ID
  const [hex, setHex] = useState<string>(PRESET_PRIMARY_COLORS[0].hex)
  const [isDark, setIsDark] = useState(theme.isDark)
  const [error, setError] = useState(false)

  // 用过自定义主色的话，回填上次的颜色和模式
  useEffect(() => {
    void getAllThemes().then(({ userThemes }) => {
      const saved = userThemes.find(t => t.id == CUSTOM_PRIMARY_ID)
      if (!saved) return
      const savedHex = rgbToHex(saved.config.themeColors['c-primary'])
      if (savedHex) setHex(savedHex)
      setIsDark(saved.isDark)
    })
  }, [])

  const apply = useCallback(async(nextHex: string, nextDark: boolean) => {
    const id = await applyCustomPrimary(nextHex, nextDark)
    setError(id == null)
  }, [])

  const handleSwatch = (value: string) => {
    setHex(value)
    void apply(value, isDark)
  }
  const handleMode = (dark: boolean) => {
    setIsDark(dark)
    void apply(hex, dark)
  }

  const chip = (label: string, selected: boolean, onPress: () => void) => (
    <TouchableOpacity
      style={{ ...styles.chip, borderColor: selected ? theme['c-primary-font'] : theme['c-primary-background'] }}
      activeOpacity={0.5}
      onPress={onPress}
    >
      <Text size={13} color={selected ? theme['c-primary-font'] : theme['c-font']}>{label}</Text>
    </TouchableOpacity>
  )

  return (
    <SubTitle title="自定义主色">
      <View style={styles.row}>
        {
          PRESET_PRIMARY_COLORS.map(item => {
            const selected = isActive && normalizeHex(hex) == normalizeHex(item.hex)
            return (
              <TouchableOpacity
                key={item.hex}
                style={styles.swatchWrap}
                activeOpacity={0.5}
                onPress={() => { handleSwatch(item.hex) }}
              >
                <View style={{ ...styles.swatchBorder, borderColor: selected ? item.hex : 'transparent' }}>
                  <View style={{ ...styles.swatch, backgroundColor: item.hex }} />
                </View>
                <Text size={12} color={selected ? item.hex : theme['c-font']} numberOfLines={1}>{item.name}</Text>
              </TouchableOpacity>
            )
          })
        }
      </View>

      <View style={styles.row}>
        {chip('浅色', !isDark, () => { handleMode(false) })}
        {chip('深色', isDark, () => { handleMode(true) })}
      </View>

      <View style={styles.row}>
        <TextInput
          style={{ ...styles.input, color: theme['c-font'], backgroundColor: theme['c-primary-input-background'] }}
          value={hex}
          onChangeText={value => { setHex(value); setError(false) }}
          onSubmitEditing={() => { void apply(hex, isDark) }}
          placeholder="#D4B98C"
          placeholderTextColor={theme['c-font-label']}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={7}
        />
        {chip('应用', false, () => { void apply(hex, isDark) })}
      </View>

      {error ? <Text size={12} color="#d9534f">颜色格式不对，请输入 6 位 HEX，例如 #D4B98C</Text> : null}
    </SubTitle>
  )
})

const styles = createStyle({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
  },
  swatchWrap: {
    alignItems: 'center',
    width: 62,
  },
  swatchBorder: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 1.6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  swatch: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  input: {
    width: 120,
    height: 36,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 0,
    fontSize: 14,
  },
})
