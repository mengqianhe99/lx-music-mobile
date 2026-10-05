import { View } from 'react-native'

// 所有线条图标统一粗细
export const STROKE = 2.2

// 画一条从 (x1,y1) 到 (x2,y2) 的圆头线段
const Line = ({ x1, y1, x2, y2, color }: {
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
}) => {
  const dx = x2 - x1
  const dy = y2 - y1
  const len = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx) * 180 / Math.PI
  const cx = (x1 + x2) / 2
  const cy = (y1 + y2) / 2
  return (
    <View style={{
      position: 'absolute',
      left: cx - len / 2,
      top: cy - STROKE / 2,
      width: len,
      height: STROKE,
      borderRadius: STROKE / 2,
      backgroundColor: color,
      transform: [{ rotate: `${angle}deg` }],
    }} />
  )
}

// 返回箭头 <
export const BackIcon = ({ color, size = 28 }: { color: string, size?: number }) => {
  const c = size / 2
  return (
    <View style={{ width: size, height: size }}>
      <Line x1={c + 4} y1={c - 8} x2={c - 4} y2={c} color={color} />
      <Line x1={c - 4} y1={c} x2={c + 4} y2={c + 8} color={color} />
    </View>
  )
}

// 齿轮：圆环加 8 个齿，中间一个小圆环
export const GearIcon = ({ color, size = 30 }: { color: string, size?: number }) => {
  const c = size / 2
  const ring = size * 0.58
  const hole = size * 0.24
  const toothW = size * 0.15
  const toothH = size * 0.2
  const r = ring / 2 + toothH / 2 - 1
  return (
    <View style={{ width: size, height: size }}>
      <View style={{
        position: 'absolute',
        left: c - ring / 2,
        top: c - ring / 2,
        width: ring,
        height: ring,
        borderRadius: ring / 2,
        borderWidth: STROKE,
        borderColor: color,
      }} />
      <View style={{
        position: 'absolute',
        left: c - hole / 2,
        top: c - hole / 2,
        width: hole,
        height: hole,
        borderRadius: hole / 2,
        borderWidth: STROKE,
        borderColor: color,
      }} />
      {
        [0, 1, 2, 3, 4, 5, 6, 7].map(i => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: c - toothW / 2,
              top: c - toothH / 2,
              width: toothW,
              height: toothH,
              borderRadius: 1.5,
              backgroundColor: color,
              transform: [{ rotate: `${i * 45}deg` }, { translateY: -r }],
            }}
          />
        ))
      }
    </View>
  )
}

// 上一首 / 下一首：竖线加描边三角形
export const SkipIcon = ({ dir, color, size }: { dir: 'prev' | 'next', color: string, size: number }) => {
  const h = size * 0.62
  const w = size * 0.5
  const mid = size / 2
  const top = mid - h / 2
  const bottom = mid + h / 2
  const a = (size - w) / 2
  const X = (x: number) => (dir == 'prev' ? x : size - x)
  return (
    <View style={{ width: size, height: size }}>
      <Line x1={X(a)} y1={top} x2={X(a)} y2={bottom} color={color} />
      <Line x1={X(a)} y1={mid} x2={X(a + w)} y2={top} color={color} />
      <Line x1={X(a)} y1={mid} x2={X(a + w)} y2={bottom} color={color} />
      <Line x1={X(a + w)} y1={top} x2={X(a + w)} y2={bottom} color={color} />
    </View>
  )
}
