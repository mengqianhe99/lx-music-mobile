import { TouchableOpacity, View } from 'react-native'
import { Icon } from '@/components/common/Icon'
import { useTheme } from '@/store/theme/hook'
import { playNext, playPrev, togglePlay } from '@/core/player/player'
import { useIsPlay } from '@/store/player/hook'
import { createStyle } from '@/utils/tools'
import { useWindowSize } from '@/utils/hooks'
import PlayModeBtn from './MoreBtn/PlayModeBtn'
import MusicAddBtn from './MoreBtn/MusicAddBtn'
import { SkipIcon } from '../../LineIcons'

const getOnPrimaryColor = (primary: string) => {
  const nums = primary.match(/\d+/g)
  if (!nums || nums.length < 3) return '#fff'
  const [r, g, b] = nums.map(Number)
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  return luminance > 150 ? '#0B0B0F' : '#ffffff'
}

const SKIP_SIZE = 56

const PrevBtn = () => {
  const theme = useTheme()
  const handlePlayPrev = () => {
    void playPrev()
  }
  return (
    <TouchableOpacity style={styles.skipBtn} activeOpacity={0.5} onPress={handlePlayPrev}>
      <SkipIcon dir="prev" color={theme['c-font']} size={34} />
    </TouchableOpacity>
  )
}
const NextBtn = () => {
  const theme = useTheme()
  const handlePlayNext = () => {
    void playNext()
  }
  return (
    <TouchableOpacity style={styles.skipBtn} activeOpacity={0.5} onPress={handlePlayNext}>
      <SkipIcon dir="next" color={theme['c-font']} size={34} />
    </TouchableOpacity>
  )
}

const TogglePlayBtn = ({ size }: { size: number }) => {
  const theme = useTheme()
  const isPlay = useIsPlay()
  return (
    <TouchableOpacity
      style={{
        ...styles.playBtn,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: theme['c-primary'],
      }}
      activeOpacity={0.7}
      onPress={togglePlay}
    >
      <Icon name={isPlay ? 'pause' : 'play'} color={getOnPrimaryColor(theme['c-primary'])} rawSize={size * 0.42} />
    </TouchableOpacity>
  )
}

export default () => {
  const winSize = useWindowSize()
  const playSize = Math.min(winSize.width * 0.19, 84)

  return (
    <View style={styles.container}>
      <View style={styles.sideBtn}><PlayModeBtn /></View>
      <PrevBtn />
      <TogglePlayBtn size={playSize} />
      <NextBtn />
      <View style={styles.sideBtn}><MusicAddBtn /></View>
    </View>
  )
}


const styles = createStyle({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  sideBtn: {
    transform: [{ scale: 1.35 }],
  },
  skipBtn: {
    width: SKIP_SIZE,
    height: SKIP_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
})
