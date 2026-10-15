import { View, TouchableOpacity } from 'react-native'
// import Button from '@/components/common/Button'
// import { navigations } from '@/navigation'
// import { BorderWidths } from '@/theme'
import { useTheme } from '@/store/theme/hook'
import { useNavActiveId, useStatusbarHeight } from '@/store/common/hook'
import { useI18n } from '@/lang'
import { createStyle } from '@/utils/tools'
import { Icon } from '@/components/common/Icon'
import Text from '@/components/common/Text'
import StatusBar from '@/components/common/StatusBar'
import { useSettingValue } from '@/store/setting/hook'
import { scaleSizeH } from '@/utils/pixelRatio'
import { HEADER_HEIGHT } from '@/config/constant'
import { type InitState as CommonState } from '@/store/common/state'
import SearchTypeSelector from '@/screens/Home/Views/Search/SearchTypeSelector'

const headerComponents: Partial<Record<CommonState['navActiveId'], React.ReactNode>> = {
  nav_search: <SearchTypeSelector />,
}

const MENU_ICON_SIZE = 28

const LeftHeader = () => {
  const theme = useTheme()
  const id = useNavActiveId()
  const t = useI18n()
  const statusBarHeight = useStatusbarHeight()

  const openMenu = () => {
    global.app_event.changeMenuVisible(true)
  }

  return (
    <View style={{
      ...styles.container,
      height: scaleSizeH(HEADER_HEIGHT) + statusBarHeight,
      paddingTop: statusBarHeight,
    }}>
      <View style={styles.left}>
        <TouchableOpacity style={styles.btn} activeOpacity={0.5} onPress={openMenu}>
          <Icon color={theme['c-font']} name="menu" rawSize={MENU_ICON_SIZE} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.titleBtn} activeOpacity={0.5} onPress={openMenu}>
          <Text style={{ ...styles.title, ...styles.leftTitle }} size={22} color={theme['c-font']}>{t(id)}</Text>
        </TouchableOpacity>
      </View>
      {headerComponents[id] ?? null}
    </View>
  )
}


const RightHeader = () => {
  const theme = useTheme()
  const t = useI18n()
  const id = useNavActiveId()
  const statusBarHeight = useStatusbarHeight()

  const openMenu = () => {
    global.app_event.changeMenuVisible(true)
  }
  return (
    <View style={{
      ...styles.container,
      height: scaleSizeH(HEADER_HEIGHT) + statusBarHeight,
      paddingTop: statusBarHeight,
    }}>
      <View style={styles.left}>
        <TouchableOpacity style={styles.titleBtn} activeOpacity={0.5} onPress={openMenu}>
          <Text style={{ ...styles.title, ...styles.rightTitle }} size={22} color={theme['c-font']}>{t(id)}</Text>
        </TouchableOpacity>
      </View>
      {headerComponents[id] ?? null}
      <TouchableOpacity style={styles.btn} activeOpacity={0.5} onPress={openMenu}>
        <Icon color={theme['c-font']} name="menu" rawSize={MENU_ICON_SIZE} />
      </TouchableOpacity>
    </View>
  )
}

const Header = () => {
  const drawerLayoutPosition = useSettingValue('common.drawerLayoutPosition')

  return (
    <>
      <StatusBar />
      {
        drawerLayoutPosition == 'left'
          ? <LeftHeader />
          : <RightHeader />
      }

    </>
  )
}


const styles = createStyle({
  container: {
    paddingRight: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 5,
    alignItems: 'center',
    height: '100%',
  },
  btn: {
    width: Math.max(HEADER_HEIGHT, 48),
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  titleBtn: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  leftTitle: {
    paddingLeft: 6,
    paddingRight: 16,
  },
  rightTitle: {
    paddingLeft: 16,
    paddingRight: 16,
  },
})

export default Header
