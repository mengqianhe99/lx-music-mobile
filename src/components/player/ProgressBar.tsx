import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View, PanResponder } from 'react-native'
import { createStyle } from '@/utils/tools'
import { useTheme } from '@/store/theme/hook'
import { scaleSizeW, scaleSizeH } from '@/utils/pixelRatio'
import { useDrag } from '@/utils/hooks'
import { Icon } from '@/components/common/Icon'
// import { AppColors } from '@/theme'


const DefaultBar = memo(() => {
  const theme = useTheme()
  const color = theme.isDark ? 'rgba(255, 255, 255, 0.1)' : theme['c-primary-alpha-800']

  return <View style={{ ...styles.progressBar, backgroundColor: color, position: 'absolute', width: '100%', left: 0, top: 0 }}></View>
})

const BufferedBar = memo(({ progress }: { progress: number }) => {
  const theme = useTheme()
  return <View style={{ ...styles.progressBar, backgroundColor: theme['c-primary-alpha-600'], position: 'absolute', width: `${progress * 100}%`, left: 0, top: 0 }}></View>
})


const PreassBar = memo(({ onDragState, setDragProgress, onSetProgress }: {
  onDragState: (drag: boolean) => void
  setDragProgress: (progress: number) => void
  onSetProgress: (progress: number) => void
}) => {
  const {
    onLayout,
    onDragStart,
    onDragEnd,
    onDrag,
  } = useDrag(onSetProgress, onDragState, setDragProgress)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderMove: (evt, gestureState) => {
        onDrag(gestureState.dx)
      },
      onPanResponderGrant: (evt, gestureState) => {
        onDragStart(gestureState.dx, evt.nativeEvent.locationX)
      },
      onPanResponderRelease: () => {
        onDragEnd()
      },
    }),
  ).current

  return <View onLayout={onLayout} style={styles.pressBar} {...panResponder.panHandlers} />
})


const Progress = ({ progress, duration, buffered }: {
  progress: number
  duration: number
  buffered: number
}) => {
  const theme = useTheme()
  const [draging, setDraging] = useState(false)
  const [dragProgress, setDragProgress] = useState(0)
  const progressStr: `${number}%` = `${progress * 100}%`

  const progressDotStyle = useMemo(() => {
    return {
      width: progressDotSize,
      position: 'absolute',
      right: -progressDotSize / 2,
      top: -(progressDotSize - progressHeightSize) / 2,
    } as const
  }, [])

  const durationRef = useRef(duration)
  useEffect(() => {
    durationRef.current = duration
  }, [duration])
  const onSetProgress = useCallback((progress: number) => {
    global.app_event.setProgress(progress * durationRef.current)
  }, [])

  return (
    <View style={styles.progress}>
      <View>
        <DefaultBar />
        <BufferedBar progress={buffered} />
        {
          draging
            ? (
                <>
                  <View style={{ ...styles.progressBar, backgroundColor: theme['c-primary-alpha-500'], width: progressStr, position: 'absolute', left: 0, top: 0 }} />
                  <View style={{ ...styles.progressBar, backgroundColor: theme['c-primary'], width: `${dragProgress * 100}%`, position: 'absolute', left: 0, top: 0 }}>
                    <Icon name="full_stop" color={theme['c-primary']} rawSize={progressDotSize} style={progressDotStyle} />
                  </View>
                </>
              ) : (
                <View style={{ ...styles.progressBar, backgroundColor: theme['c-primary'], width: progressStr, position: 'absolute', left: 0, top: 0 }}>
                  <Icon name="full_stop" color={theme['c-primary']} rawSize={progressDotSize} style={progressDotStyle} />
                </View>
              )
        }

      </View>
      <PreassBar onDragState={setDraging} setDragProgress={setDragProgress} onSetProgress={onSetProgress} />
    </View>
  )
}


const progressContentPadding = 10
const progressHeight = 7
const progressContentHeight = progressContentPadding * 2 + progressHeight
const progressHeightSize = scaleSizeH(progressHeight)
let progressDotSize = scaleSizeW(progressContentHeight * 0.7)
const styles = createStyle({
  progress: {
    width: '100%',
    height: progressContentHeight,
    paddingTop: progressContentPadding,
    paddingBottom: progressContentPadding,
    zIndex: 1,
  },
  progressBar: {
    height: progressHeight,
    borderRadius: 4,
  },
  pressBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: progressContentHeight,
    paddingTop: progressContentPadding,
    paddingBottom: progressContentPadding,
    width: '100%',
    zIndex: 6,
  },
})

export default Progress
