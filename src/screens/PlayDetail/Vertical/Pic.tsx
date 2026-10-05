import { useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'
import { createStyle } from '@/utils/tools'
import { usePlayerMusicInfo } from '@/store/player/hook'
import { useWindowSize } from '@/utils/hooks'
import { NAV_SHEAR_NATIVE_IDS } from '@/config/constant'
import { useNavigationComponentDidAppear } from '@/navigation'
import { HEADER_HEIGHT } from './components/Header'
import Image from '@/components/common/Image'
import Text from '@/components/common/Text'
import { useStatusbarHeight } from '@/store/common/hook'
import commonState from '@/store/common/state'
import { useTheme } from '@/store/theme/hook'
import MiniLyric from './MiniLyric'

const COVER_RADIUS = 28

export default ({ componentId }: { componentId: string }) => {
  const theme = useTheme()
  const musicInfo = usePlayerMusicInfo()
  const { width: winWidth, height: winHeight } = useWindowSize()
  const statusBarHeight = useStatusbarHeight()

  const [animated, setAnimated] = useState(!!commonState.componentIds.playDetail)
  const [pic, setPic] = useState(musicInfo.pic)
  useEffect(() => {
    if (animated) setPic(musicInfo.pic)
  }, [musicInfo.pic, animated])

  useNavigationComponentDidAppear(componentId, () => {
    setAnimated(true)
  })

  const style = useMemo(() => {
    const imgWidth = Math.min(winWidth * 0.73, (winHeight - statusBarHeight - HEADER_HEIGHT) * 0.4)
    return {
      width: imgWidth,
      height: imgWidth,
      borderRadius: COVER_RADIUS,
    }
  }, [statusBarHeight, winHeight, winWidth])

  return (
    <View style={styles.container}>
      <View style={{ ...styles.content, elevation: animated ? 6 : 0 }}>
        <Image url={pic} nativeID={NAV_SHEAR_NATIVE_IDS.playDetail_pic} style={style} />
      </View>
      <View style={styles.info}>
        <Text numberOfLines={1} size={22} color={theme['c-font']}>{musicInfo.name}</Text>
        <Text numberOfLines={1} size={14} color={theme['c-font-label']} style={styles.singer}>{musicInfo.singer}</Text>
      </View>
      <MiniLyric />
    </View>
  )
}

const styles = createStyle({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderRadius: COVER_RADIUS,
  },
  info: {
    width: '100%',
    paddingHorizontal: 26,
    marginTop: 22,
  },
  singer: {
    marginTop: 3,
  },
})
