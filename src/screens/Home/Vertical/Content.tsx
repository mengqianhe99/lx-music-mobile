import { useEffect, useRef } from 'react'
import { View, StyleSheet } from 'react-native'
import Header from './Header'
import Main from './Main'
import Dashboard from './Dashboard'
import { useNavActiveId } from '@/store/common/hook'
import { useTheme } from '@/store/theme/hook'
import { setHomeTab, useHomeTab } from './homeTab'

const Content = () => {
  const theme = useTheme()
  const navId = useNavActiveId()
  const tab = useHomeTab()
  const firstRef = useRef(true)

  // 别处切换了板块（比如长按迷你播放条跳到列表），首页覆盖层要让开
  useEffect(() => {
    if (firstRef.current) {
      firstRef.current = false
      return
    }
    setHomeTab(navId)
  }, [navId])

  return (
    <View style={styles.container}>
      <Header homeActive={tab == 'home'} />
      <View style={styles.body}>
        <Main />
        {
          tab == 'home'
            ? (
                <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: theme['c-content-background'] }}>
                  <Dashboard />
                </View>
              )
            : null
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
})

export default Content
