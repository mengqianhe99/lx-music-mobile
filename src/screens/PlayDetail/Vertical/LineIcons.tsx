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

type Pt = [number, number]

// 在 24x24 的网格里连折线，k 是缩放比例
const Poly = ({ pts, k, color }: { pts: Pt[], k: number, color: string }) => (
  <>
    {
      pts.slice(1).map((p, i) => (
        <Line key={i} x1={pts[i][0] * k} y1={pts[i][1] * k} x2={p[0] * k} y2={p[1] * k} color={color} />
      ))
    }
  </>
)

// 箭头头部，tip 是箭尖
const Arrow = ({ tip, dir, k, color }: { tip: Pt, dir: 'r' | 'l', k: number, color: string }) => {
  const s = dir == 'r' ? -3 : 3
  return <Poly pts={[[tip[0] + s, tip[1] - 3], tip, [tip[0] + s, tip[1] + 3]]} k={k} color={color} />
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

// 评论：圆角对话框加两行字
export const CommentIcon = ({ color, size = 30 }: { color: string, size?: number }) => {
  const k = size / 24
  return (
    <View style={{ width: size, height: size }}>
      <View style={{
        position: 'absolute',
        left: 2 * k,
        top: 3 * k,
        width: 20 * k,
        height: 15 * k,
        borderRadius: 4 * k,
        borderWidth: STROKE,
        borderColor: color,
      }} />
      <Poly pts={[[7, 18], [7, 21.5], [11.5, 18]]} k={k} color={color} />
      <Poly pts={[[7, 9], [17, 9]]} k={k} color={color} />
      <Poly pts={[[7, 13], [13, 13]]} k={k} color={color} />
    </View>
  )
}

// 循环（one 为单曲循环，中间多一个 1）
export const RepeatIcon = ({ color, size = 32, one = false }: { color: string, size?: number, one?: boolean }) => {
  const k = size / 24
  return (
    <View style={{ width: size, height: size }}>
      <Poly pts={[[4, 12], [4, 9], [5, 7], [7, 6], [20, 6]]} k={k} color={color} />
      <Arrow tip={[20, 6]} dir="r" k={k} color={color} />
      <Poly pts={[[20, 12], [20, 15], [19, 17], [17, 18], [4, 18]]} k={k} color={color} />
      <Arrow tip={[4, 18]} dir="l" k={k} color={color} />
      {one ? <Poly pts={[[11, 10], [13, 9], [13, 15]]} k={k} color={color} /> : null}
    </View>
  )
}

// 随机：两条交叉的线
export const ShuffleIcon = ({ color, size = 32 }: { color: string, size?: number }) => {
  const k = size / 24
  return (
    <View style={{ width: size, height: size }}>
      <Poly pts={[[3, 7], [6, 7], [9, 8], [11, 11], [12, 14], [14, 17], [16, 17], [21, 17]]} k={k} color={color} />
      <Arrow tip={[21, 17]} dir="r" k={k} color={color} />
      <Poly pts={[[3, 17], [6, 17], [9, 16], [11, 13], [12, 10], [14, 7], [16, 7], [21, 7]]} k={k} color={color} />
      <Arrow tip={[21, 7]} dir="r" k={k} color={color} />
    </View>
  )
}

// 顺序播放：三条横线，最下面一条带箭头
export const ListOrderIcon = ({ color, size = 32 }: { color: string, size?: number }) => {
  const k = size / 24
  return (
    <View style={{ width: size, height: size }}>
      <Poly pts={[[4, 7], [20, 7]]} k={k} color={color} />
      <Poly pts={[[4, 12], [20, 12]]} k={k} color={color} />
      <Poly pts={[[4, 17], [19, 17]]} k={k} color={color} />
      <Arrow tip={[19, 17]} dir="r" k={k} color={color} />
    </View>
  )
}

// 单曲播放一次：箭头加终点竖线
export const SingleIcon = ({ color, size = 32 }: { color: string, size?: number }) => {
  const k = size / 24
  return (
    <View style={{ width: size, height: size }}>
      <Poly pts={[[4, 12], [19, 12]]} k={k} color={color} />
      <Arrow tip={[19, 12]} dir="r" k={k} color={color} />
      <Poly pts={[[21.5, 7], [21.5, 17]]} k={k} color={color} />
    </View>
  )
}

// 收藏：线条爱心加右下角小加号，心形用公式取点连成
const HEART_PTS: Pt[] = (() => {
  const pts: Pt[] = []
  const n = 32
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2
    const x = 16 * Math.pow(Math.sin(t), 3)
    const f = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
    const y = -f
    pts.push([9.5 + x * 0.55, 9 + (y - 2.5) * 0.55])
  }
  return pts
})()

export const HeartPlusIcon = ({ color, size = 32 }: { color: string, size?: number }) => {
  const k = size / 24
  return (
    <View style={{ width: size, height: size }}>
      <Poly pts={HEART_PTS} k={k} color={color} />
      <Poly pts={[[17, 18], [22, 18]]} k={k} color={color} />
      <Poly pts={[[19.5, 15.5], [19.5, 20.5]]} k={k} color={color} />
    </View>
  )
}
