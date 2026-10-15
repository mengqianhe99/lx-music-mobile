import { memo, useMemo } from 'react'
import { View } from 'react-native'
import { useKeyboard } from '@/utils/hooks'

import Pic from './components/Pic'
import Title from './components/Title'
import PlayInfo from './components/PlayInfo'
import ControlBtn from './components/ControlBtn'
import { createStyle } from '@/utils/tools'
import { useTheme } from '@/store/theme/hook'
import { useSettingValue } from '@/store/setting/hook'


export default memo(({ isHome = false }: { isHome?: boolean }) => {
  const { keyboardShown } = useKeyboard()
  const theme = useTheme()
  const autoHidePlayBar = useSettingValue('common.autoHidePlayBar')

  const playerComponent = useMemo(() => (
    <View style={{
      ...styles.container,
      backgroundColor: theme['c-content-background'],
      borderTopColor: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : theme['c-primary-alpha-800'],
    }}>
      <Pic isHome={isHome} />
      <View style={styles.center}>
        <Title isHome={isHome} />
        <PlayInfo isHome={isHome} />
      </View>
      <View style={styles.right}>
        <ControlBtn />
      </View>
    </View>
  ), [theme, isHome])

  return autoHidePlayBar && keyboardShown ? null : playerComponent
})


const styles = createStyle({
  container: {
    width: '100%',
    paddingVertical: 8,
    paddingLeft: 10,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 12,
  },
  center: {
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    paddingLeft: 10,
    height: '100%',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 0,
    flexShrink: 0,
    paddingLeft: 5,
    paddingRight: 8,
  },
})
