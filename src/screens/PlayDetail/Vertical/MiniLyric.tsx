import { memo } from 'react'
import { View } from 'react-native'
import { useLrcPlay, useLrcSet } from '@/plugins/lyric'
import { useTheme } from '@/store/theme/hook'
import Text from '@/components/common/Text'
import { createStyle } from '@/utils/tools'

export default memo(() => {
  const theme = useTheme()
  const lyricLines = useLrcSet()
  const { line } = useLrcPlay()

  const hasLyric = lyricLines.length > 0
  const prev = hasLyric ? (lyricLines[line - 1]?.text ?? '') : ''
  const current = hasLyric ? (lyricLines[line]?.text ?? '') : ''
  const next = hasLyric ? (lyricLines[line + 1]?.text ?? '') : ''

  return (
    <View style={styles.container}>
      <Text style={styles.line} numberOfLines={1} size={14} color={theme['c-font-label']}>{prev}</Text>
      <Text style={{ ...styles.line, ...styles.current }} numberOfLines={1} size={18} color={theme['c-primary']}>{current}</Text>
      <Text style={styles.line} numberOfLines={1} size={14} color={theme['c-font-label']}>{next}</Text>
    </View>
  )
})

const styles = createStyle({
  container: {
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 26,
    alignItems: 'center',
  },
  line: {
    minHeight: 30,
    textAlign: 'center',
  },
  current: {
    minHeight: 42,
    paddingTop: 6,
    fontWeight: 'bold',
  },
})
