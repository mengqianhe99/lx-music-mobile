import { TouchableOpacity } from 'react-native'
import { Icon } from '@/components/common/Icon'
import { useIsPlay } from '@/store/player/hook'
import { useTheme } from '@/store/theme/hook'
import { playNext, playPrev, togglePlay } from '@/core/player/player'
import { createStyle } from '@/utils/tools'
import { useHorizontalMode } from '@/utils/hooks'

const SIDE_ICON_SIZE = 24
const PLAY_ICON_SIZE = 20
const PLAY_CIRCLE = 44

// 主色偏亮时图标用深色，偏暗时用白色，保证看得清
const getOnPrimaryColor = (primary: string) => {
  const nums = primary.match(/\d+/g)
  if (!nums || nums.length < 3) return '#fff'
  const [r, g, b] = nums.map(Number)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance > 150 ? '#0B0B0F' : '#ffffff'
}

const handlePlayPrev = () => {
  void playPrev()
}
const handlePlayNext = () => {
  void playNext()
}

const PlayPrevBtn = () => {
  const theme = useTheme()

  return (
    <TouchableOpacity style={styles.sideBtn} activeOpacity={0.5} onPress={handlePlayPrev}>
      <Icon name='prevMusic' color={theme['c-font']} rawSize={SIDE_ICON_SIZE} />
    </TouchableOpacity>
  )
}

const PlayNextBtn = () => {
  const theme = useTheme()

  return (
    <TouchableOpacity style={styles.sideBtn} activeOpacity={0.5} onPress={handlePlayNext}>
      <Icon name='nextMusic' color={theme['c-font']} rawSize={SIDE_ICON_SIZE} />
    </TouchableOpacity>
  )
}

const TogglePlayBtn = () => {
  const isPlay = useIsPlay()
  const theme = useTheme()

  return (
    <TouchableOpacity
      style={{ ...styles.playBtn, backgroundColor: theme['c-primary'] }}
      activeOpacity={0.7}
      onPress={togglePlay}
    >
      <Icon name={isPlay ? 'pause' : 'play'} color={getOnPrimaryColor(theme['c-primary'])} rawSize={PLAY_ICON_SIZE} />
    </TouchableOpacity>
  )
}

export default () => {
  const isHorizontalMode = useHorizontalMode()
  return (
    <>
      { isHorizontalMode ? <PlayPrevBtn /> : null }
      <TogglePlayBtn />
      <PlayNextBtn />
    </>
  )
}


const styles = createStyle({
  sideBtn: {
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    width: PLAY_CIRCLE,
    height: PLAY_CIRCLE,
    borderRadius: PLAY_CIRCLE / 2,
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
})
