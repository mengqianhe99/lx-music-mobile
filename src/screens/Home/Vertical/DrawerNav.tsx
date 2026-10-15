import { memo } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { useI18n } from '@/lang'
import { useNavActiveId, useStatusbarHeight } from '@/store/common/hook'
import { useTheme } from '@/store/theme/hook'
import { Icon } from '@/components/common/Icon'
import { confirmDialog, createStyle, exitApp as backHome } from '@/utils/tools'
import { NAV_MENUS } from '@/config/constant'
import type { InitState } from '@/store/common/state'
import { exitApp, setNavActiveId } from '@/core/common'
import Text from '@/components/common/Text'
import { useSettingValue } from '@/store/setting/hook'

const styles = createStyle({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 28,
    justifyContent: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerSub: {
    marginTop: 4,
  },
  menus: {
    flex: 1,
  },
  list: {
    paddingTop: 6,
    paddingBottom: 10,
    paddingHorizontal: 14,
  },
  menuItem: {
    flexDirection: 'row',
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 16,
    paddingRight: 16,
    marginBottom: 4,
    borderRadius: 14,
    alignItems: 'center',
  },
  iconContent: {
    width: 28,
    alignItems: 'center',
  },
  text: {
    paddingLeft: 16,
  },
  footer: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
})

const Header = () => {
  const theme = useTheme()
  const statusBarHeight = useStatusbarHeight()
  return (
    <View style={{ paddingTop: statusBarHeight }}>
      <View style={styles.header}>
        <Text style={styles.headerText} size={26} color={theme['c-font']}>LX Music</Text>
        <Text style={styles.headerSub} size={12} color={theme['c-font-label']}>moomusic</Text>
      </View>
    </View>
  )
}

type IdType = InitState['navActiveId'] | 'nav_exit' | 'back_home'

const MenuItem = ({ id, icon, onPress }: {
  id: IdType
  icon: string
  onPress: (id: IdType) => void
}) => {
  const t = useI18n()
  const activeId = useNavActiveId()
  const theme = useTheme()

  return activeId == id
    ? <View style={{ ...styles.menuItem, backgroundColor: theme['c-primary-alpha-900'] }}>
        <View style={styles.iconContent}>
          <Icon name={icon} rawSize={24} color={theme['c-primary']} />
        </View>
        <Text style={styles.text} size={16} color={theme['c-primary']}>{t(id)}</Text>
      </View>
    : <TouchableOpacity style={styles.menuItem} activeOpacity={0.5} onPress={() => { onPress(id) }}>
        <View style={styles.iconContent}>
          <Icon name={icon} rawSize={24} color={theme['c-font-label']} />
        </View>
        <Text style={styles.text} size={16} color={theme['c-font']}>{t(id)}</Text>
      </TouchableOpacity>
}

export default memo(() => {
  const theme = useTheme()
  const showBackBtn = useSettingValue('common.showBackBtn')
  const showExitBtn = useSettingValue('common.showExitBtn')

  const handlePress = (id: IdType) => {
    switch (id) {
      case 'nav_exit':
        void confirmDialog({
          message: global.i18n.t('exit_app_tip'),
          confirmButtonText: global.i18n.t('list_remove_tip_button'),
        }).then(isExit => {
          if (!isExit) return
          exitApp('Exit Btn')
        })
        return
      case 'back_home':
        backHome()
        return
    }

    global.app_event.changeMenuVisible(false)
    setNavActiveId(id)
  }


  return (
    <View style={{ ...styles.container, backgroundColor: theme['c-content-background'] }}>
      <Header />
      <ScrollView style={styles.menus}>
        <View style={styles.list}>
          {NAV_MENUS.map(menu => <MenuItem key={menu.id} id={menu.id} icon={menu.icon} onPress={handlePress} />)}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {
          showBackBtn ? <MenuItem id="back_home" icon="home" onPress={handlePress} /> : null
        }
        {
          showExitBtn ? <MenuItem id="nav_exit" icon="exit2" onPress={handlePress} /> : null
        }
      </View>
    </View>
  )
})
