import { TouchableOpacity, View } from 'react-native'
import { Icon } from '@/components/common/Icon'
import { useTheme } from '@/store/theme/hook'
import { playNext, playPrev, togglePlay } from '@/core/player/player'
import { useIsPlay } from '@/store/player/hook'
import { createStyle } from '@/utils/tools'
import { useWindowSize } from '@/utils/hooks'
import { BTN_WIDTH } from './MoreBtn/Btn'
import { useMemo } from 'react'

const getOnPrimaryColor = (primary: string) => {
  const nums = primary.match(/\d+/g)
  if (!nums || nums.length < 3) return '#fff'
  const [r, g, b] = nums.map(Number)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance > 150 ? '#0B0B0F' : '#ffffff'
}

// 用色块画的上一首/下一首：一根竖线加一个三角形
const SkipIcon = ({ dir, color, size }: { dir: 'prev' | 'next', color: string, size: number }) => {
  const h = size * 0.5
  const w = size * 0.42
  const triangle = dir == 'next'
    ? { borderLeftWidth: w, borderLeftColor: color, borderTopWidth: h / 2, borderBottomWidth: h / 2 }
    : { borderRightWidth: w, borderRightColor: color, borderTopWidth: h / 2, borderBottomWidth: h / 2 }
  const bar = <View style={{ width: 3, height: h, borderRadius: 2, backgroundColor: color }} />
  const tri = <View style={{ width: 0, height: 0, borderColor: 'transparent', ...triangle }} />
  return (
    <View style={styles.skipIcon}>
      {dir == 'prev' ? bar : null}
      {tri}
      {dir == 'next' ? bar : null}
    </View>
  )
}

const PrevBtn = ({ size }: { size: number }) => {
  const theme = useTheme()
  const handlePlayPrev = () => {
    void playPrev()
  }
  return (
    <TouchableOpacity style={{ ...styles.cotrolBtn, width: size, height: size }} activeOpacity={0.5} onPress={handlePlayPrev}>
      <SkipIcon dir="prev" color={theme['c-font']} size={size * 0.7} />
    </TouchableOpacity>
  )
}
const NextBtn = ({ size }: { size: number }) => {
  const theme = useTheme()
  const handlePlayNext = () => {
    void playNext()
  }
  return (
    <TouchableOpacity style={{ ...styles.cotrolBtn, width: size, height: size }} activeOpacity={0.5} onPress={handlePlayNext}>
      <SkipIcon dir="next" color={theme['c-font']} size={size * 0.7} />
    </TouchableOpacity>
  )
}

const TogglePlayBtn = ({ size }: { size: number }) => {
  const theme = useTheme()
  const isPlay = useIsPlay()
  const circleSize = size * 1.05
  return (
    <TouchableOpacity
      style={{
        ...styles.cotrolBtn,
        ...styles.playBtn,
        width: circleSize,
        height: circleSize,
        borderRadius: circleSize / 2,
        backgroundColor: theme['c-primary'],
      }}
      activeOpacity={0.7}
      onPress={togglePlay}
    >
      <Icon name={isPlay ? 'pause' : 'play'} color={getOnPrimaryColor(theme['c-primary'])} rawSize={circleSize * 0.45} />
    </TouchableOpacity>
  )
}

const MAX_SIZE = BTN_WIDTH * 1.6
const MIN_SIZE = BTN_WIDTH * 1.2

export default () => {
  const winSize = useWindowSize()
  const maxHeight = Math.max(winSize.height * 0.11, MIN_SIZE)
  const containerStyle = useMemo(() => {
    return {
      ...styles.conatiner,
      maxHeight,
    }
  }, [maxHeight])
  const size = Math.min(Math.max(winSize.width * 0.33 * global.lx.fontSize * 0.4, MIN_SIZE), MAX_SIZE, maxHeight)

  return (
    <View style={containerStyle}>
      <PrevBtn size={size} />
      <TogglePlayBtn size={size}/>
      <NextBtn size={size} />
    </View>
  )
}


const styles = createStyle({
  conatiner: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 1,
    paddingHorizontal: '4%',
    paddingVertical: 22,
  },
  cotrolBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    elevation: 4,
  },
  skipIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
})
