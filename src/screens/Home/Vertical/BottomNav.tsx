import { memo } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { useI18n } from '@/lang'
import { useTheme } from '@/store/theme/hook'
import { Icon } from '@/components/common/Icon'
import Text from '@/components/common/Text'
import { createStyle } from '@/utils/tools'
import { NAV_MENUS } from '@/config/constant'
import { setNavActiveId } from '@/core/common'
import { useKeyboard } from '@/utils/hooks'
import { setHomeTab, useHomeTab } from './homeTab'

const Item = ({ active, icon, label, onPress }: {
  active: boolean
  icon: string
  label: string
  onPress: () => void
}) => {
  const theme = useTheme()
  const color = active ? theme['c-primary'] : theme['c-font-label']
  return (
    <TouchableOpacity style={styles.item} activeOpacity={0.6} onPress={onPress}>
      <View style={{ ...styles.pill, backgroundColor: active ? theme['c-primary-alpha-800'] : 'transparent' }}>
        <Icon name={icon} rawSize={22} color={color} style={styles.icon} />
      </View>
      <Text style={styles.label} size={11} color={color} numberOfLines={1}>{label}</Text>
    </TouchableOpacity>
  )
}

export default memo(() => {
  const theme = useTheme()
  const t = useI18n()
  const tab = useHomeTab()
  const { keyboardShown } = useKeyboard()

  // 搜索时键盘弹出，把标签栏藏起来
  if (keyboardShown) return null

  return (
    <View style={{
      ...styles.container,
      backgroundColor: theme['c-content-background'],
      borderTopColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : theme['c-primary-alpha-800'],
    }}>
      <Item active={tab == 'home'} icon="home" label="首页" onPress={() => { setHomeTab('home') }} />
      {
        NAV_MENUS.map(m => (
          <Item
            key={m.id}
            active={tab == m.id}
            icon={m.icon}
            label={t(m.id)}
            onPress={() => {
              setNavActiveId(m.id)
              setHomeTab(m.id)
            }}
          />
        ))
      }
    </View>
  )
})

const styles = createStyle({
  container: {
    width: '100%',
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 6,
    borderTopWidth: 1,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  pill: {
    width: 56,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 36,
    textAlign: 'center',
  },
  label: {
    marginTop: 4,
  },
})
