import { Fragment, type ReactNode } from 'react'
import { TouchableOpacity, View, StyleSheet } from 'react-native'
import { useTheme } from '@/store/theme/hook'

const SIZE = 28
const STROKE = 1.8

// 时钟：细圆环加两根指针
const ClockIcon = ({ color }: { color: string }) => {
  const inner = SIZE - STROKE * 2
  const center = inner / 2
  return (
    <View style={{ width: SIZE, height: SIZE, borderRadius: SIZE / 2, borderWidth: STROKE, borderColor: color }}>
      <View style={{
        position: 'absolute',
        width: STROKE,
        height: SIZE * 0.28,
        left: center - STROKE / 2,
        top: center - SIZE * 0.28 + STROKE / 2,
        borderRadius: STROKE,
        backgroundColor: color,
      }} />
      <View style={{
        position: 'absolute',
        width: SIZE * 0.2,
        height: STROKE,
        left: center - STROKE / 2,
        top: center - STROKE / 2,
        borderRadius: STROKE,
        backgroundColor: color,
      }} />
    </View>
  )
}

// 设置：三条横线加滑块圆点
const SlidersIcon = ({ color }: { color: string }) => {
  const dot = 8
  const rows = [
    { y: 0.22, x: 0.68 },
    { y: 0.5, x: 0.32 },
    { y: 0.78, x: 0.62 },
  ]
  return (
    <View style={{ width: SIZE, height: SIZE }}>
      {
        rows.map(({ y, x }) => (
          <Fragment key={y}>
            <View style={{
              position: 'absolute',
              left: 0,
              width: SIZE,
              height: STROKE,
              top: SIZE * y - STROKE / 2,
              borderRadius: STROKE,
              backgroundColor: color,
            }} />
            <View style={{
              position: 'absolute',
              width: dot,
              height: dot,
              borderRadius: dot / 2,
              left: SIZE * x - dot / 2,
              top: SIZE * y - dot / 2,
              backgroundColor: color,
            }} />
          </Fragment>
        ))
      }
    </View>
  )
}

const IconBtn = ({ onPress, children }: { onPress: () => void, children: ReactNode }) => (
  <TouchableOpacity style={styles.btn} activeOpacity={0.5} onPress={onPress}>
    {children}
  </TouchableOpacity>
)

export const ClockBtn = ({ active, onPress }: { active: boolean, onPress: () => void }) => {
  const theme = useTheme()
  return (
    <IconBtn onPress={onPress}>
      <ClockIcon color={active ? theme['c-primary'] : theme['c-font']} />
    </IconBtn>
  )
}

export const SettingBtn = ({ onPress }: { onPress: () => void }) => {
  const theme = useTheme()
  return (
    <IconBtn onPress={onPress}>
      <SlidersIcon color={theme['c-font']} />
    </IconBtn>
  )
}

const styles = StyleSheet.create({
  btn: {
    width: 48,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
