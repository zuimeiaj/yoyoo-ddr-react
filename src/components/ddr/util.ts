import Matrix from './Matrix'
import { DDRPoint, ElementRect, TransformProps } from './type'

// 缩放时基于对角坐标固定缩放
// 矩形除了4个直角坐标点外，还有每条边的一个中心点坐标，按照数组的顺序从左上顺时针到左中排列
// 例如：拖拽点为右中，对应的固定点为左中。拖拽点为左上，对应的固定点为右下
type ObjectType = { [key: string]: number }
export const pointMap: ObjectType = {
  br: 0,
  bm: 1,
  bl: 2,
  l: 3,
  tl: 4,
  tm: 5,
  tr: 6,
  r: 7,
}

export const handlerPointMap: ObjectType = {
  tl: 0,
  tm: 1,
  tr: 2,
  r: 3,
  br: 4,
  bm: 5,
  bl: 6,
  l: 7,
}
// 计算矩形大小时使用四个直角坐标
export const pointMap2: ObjectType = {
  br: 0,
  bm: 0,
  bl: 2,
  l: 2,
  tl: 4,
  tm: 4,
  tr: 6,
  r: 6,
}

export const widthMap: ObjectType = {
  l: 1,
  r: 1,
}
export const heightMap: ObjectType = {
  tm: 1,
  bm: 1,
}
export const tr2bl: ObjectType = {
  tr: 1,
  bl: 1,
  r: 1,
  l: 1,
}

export function deg2rad(deg: number) {
  return (deg * Math.PI) / 180
}

export function rad2deg(rad: number) {
  return (rad * 180) / Math.PI
}

// 获取矩形旋转后在平面上的8个坐标点，从左上角顺时针放到数组里返回

export function getPoints({ x, y, width, height, rotation }: TransformProps, zoom: number): DDRPoint[] {
  const a = (rotation * Math.PI) / 180
  const wc = (width / 2) * zoom
  const hc = (height / 2) * zoom
  const deg = new Matrix([
    [Math.cos(a), Math.sin(a)],
    [-Math.sin(a), Math.cos(a)],
  ])
  const rect = new Matrix([
    [-wc, hc],
    [0, hc],
    [wc, hc],
    [wc, 0],
    [wc, -hc],
    [0, -hc],
    [-wc, -hc],
    [-wc, 0],
  ])
  return (deg.dot(rect.T()) as Matrix)
    .T()
    .valueOf()
    .map((item: [number, number]) => {
      return { x: item[0] + wc + x * zoom, y: -(item[1] - hc) + y * zoom }
    })
}
export function getBoundingRect(transform: TransformProps, zoom: number): ElementRect {
  if (transform.rotation === 0) {
    return {
      left: transform.x,
      top: transform.y,
      right: transform.x + transform.width,
      bottom: transform.y + transform.height,
      width: transform.width,
      height: transform.height,
    }
  }
  const points = getPoints(transform, zoom)
  let xarray: number[] = [],
    yarray: number[] = []
  points.forEach((element) => {
    xarray.push(element.x)
    yarray.push(element.y)
  })
  xarray = xarray.sort((a, b) => a - b)
  yarray = yarray.sort((a, b) => a - b)
  const left = xarray[0],
    right = xarray[xarray.length - 1]
  const top = yarray[0],
    bottom = yarray[yarray.length - 1]
  return {
    left,
    right,
    top,
    bottom,
    width: right - left,
    height: bottom - top,
  }
}

// 计算当前矩形的宽高
export function getSize({ type, x, y, dis, pressAngle, startAngle }: any) {
  let w, h
  const currentAngle = rad2deg(Math.atan2(y, x))
  const rad = deg2rad(pressAngle + currentAngle - startAngle)
  if (tr2bl[type]) {
    h = Math.cos(rad) * dis
    w = Math.sin(rad) * dis
  } else {
    h = Math.sin(rad) * dis
    w = Math.cos(rad) * dis
  }
  return { w, h }
}

const cursorMap: string[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']
const handlerMap: ObjectType = { tl: 0, tm: 1, tr: 2, r: 3, br: 4, bm: 5, bl: 6, l: 7 }

export function getHandler(type: string, rotation: number) {
  const originIndex = handlerMap[type]
  const currentIndex = (originIndex + Math.floor(rotation / 45)) % 8
  return cursorMap[currentIndex]
}
