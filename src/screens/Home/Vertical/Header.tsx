import { View } from 'react-native'
import { useTheme } from '@/store/theme/hook'
import { useNavActiveId, useStatusbarHeight } from '@/store/common/hook'
import { useI18n } from '@/lang'
import { createStyle } from '@/utils/tools'
import Text from '@/components/common/Text'
import StatusBar from '@/components/common/StatusBar'
import { type InitState as CommonState } from '@/store/common/state'
import SearchTypeSelector from '@/screens/Home/Views/Search/SearchTypeSelector'
import { getGreeting } from './homeTab'

const headerComponents: Partial<Record<CommonState['navActiveId'], React.ReactNode>> = {
  nav_search: <SearchTypeSelector />,
}

const Header = ({ homeActive }: { homeActive: boolean }) => {
  const theme = useTheme()
  const id = useNavActiveId()
  const t = useI18n()
  const statusBarHeight = useStatusbarHeight()

  return (
    <>
      <StatusBar />
      <View style={{ ...styles.container, height: statusBarHeight + 72, paddingTop: statusBarHeight }}>
        <View style={styles.left}>
          <Text style={styles.title} size={28} color={theme['c-font']} numberOfLines={1}>
            {homeActive ? getGreeting() : t(id)}
          </Text>
          {homeActive ? <Text size={13} color={theme['c-font-label']}>今天想听点什么？</Text> : null}
        </View>
        {homeActive ? null : (headerComponents[id] ?? null)}
      </View>
    </>
  )
}

const styles = createStyle({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  left: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
})

export default Header
