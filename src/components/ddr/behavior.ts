import { MouseEvent, TouchEvent, useRef, useState } from 'react'
import { DDRProps, LocalPointProps, LocalResizeProps, LocalRotateProps } from './type'
import { getPoints, getSize, handlerPointMap, heightMap, pointMap, pointMap2, rad2deg, tr2bl, widthMap } from './util'

export function useDDRBehavior(props: DDRProps) {
  const [newTransform, setTransform] = useState(props.value)

  const isInitialRatio = useRef(false)
  const currentRatio = useRef(1)
  const localRotateOption = useRef<Partial<LocalRotateProps>>({})
  const localResizeOption = useRef<Partial<LocalResizeProps>>({})
  const localTransform = useRef({ ...newTransform })
  const localPoint = useRef<Partial<LocalPointProps>>({})
  const localLastTransform = useRef({ ...newTransform })

  const domWrapper = useRef<HTMLElement>()
  return {
    transform: newTransform,
    setRotateStart: (event: MouseEvent & TouchEvent, wrapper: Element) => {
      const { clientX, clientY } = event.touches ? event.touches[0] : event
      const t = wrapper.getBoundingClientRect()
      const cx = t.left + t.width / 2
      const cy = t.top + t.height / 2
      const startAngle = (180 / Math.PI) * Math.atan2(clientY - cy, clientX - cx)
      const rotation = newTransform.rotation
      localRotateOption.current = {
        cx,
        cy,
        startAngle,
        rotation,
      }
    },
    setRotateMove: (event: MouseEvent & TouchEvent) => {
      const { cx, cy, startAngle, rotation } = localRotateOption.current as any
      const { clientX, clientY } = event.touches ? event.touches[0] : event
      const x = clientX - cx
      const y = clientY - cy
      const angle = (180 / Math.PI) * Math.atan2(y, x)
      // 旋转角度 = 鼠标移动时角度 - 鼠标按下时角度
      // 旋转后的角度 = 组件按下时角度 + 旋转角度
      const currentAngle = angle - startAngle
      let r = rotation + currentAngle
      r = r % 360
      r = r < 0 ? r + 360 : r
      setTransform({
        ...newTransform,
        rotation: Math.floor(r),
      })
    },

    setResizeStart: (event: MouseEvent & TouchEvent) => {
      const type = localPoint.current.resizeHandler!
      const rect = newTransform
      const matrix = getPoints(rect, props.zoom)
      let pressAngle

      const opposite = matrix[pointMap[type]]

      const opp2 = matrix[pointMap2[type]]
      const { clientX, clientY } = event.touches ? event.touches[0] : event

      const handlerPoint = matrix[handlerPointMap[type]]
      const offsetX = clientX - handlerPoint.x
      const offsetY = clientY - handlerPoint.y

      const x1 = clientX - opp2.x - offsetX
      const y1 = clientY - opp2.y - offsetY
      const width = rect.width
      const height = rect.height
      if (tr2bl[type]) {
        pressAngle = rad2deg(Math.atan2(width, widthMap[type] ? height / 2 : height))
      } else {
        pressAngle = rad2deg(Math.atan2(height, heightMap[type] ? width / 2 : width))
      }
      const startAngle = rad2deg(Math.atan2(y1, x1))
      localResizeOption.current = {
        matrix,
        rect,
        type,
        opposite,
        opp2,
        pressAngle,
        startAngle,
        offsetX,
        offsetY,
      }
    },
    setResizeMove: (event: MouseEvent & TouchEvent) => {
      const { clientX, clientY } = event.touches ? event.touches[0] : event
      const { opposite, opp2, type, pressAngle, startAngle, offsetX, offsetY } = localResizeOption.current as any
      const x = clientX - opp2.x - offsetX
      const y = clientY - opp2.y - offsetY
      const dis = Math.hypot(y, x)
      const ratio = event.shiftKey || props.acceptRatio
      const [gridX, gridY] = props.grid

      // 锁定纵横比
      if (!isInitialRatio.current && ratio) {
        currentRatio.current = newTransform.width / newTransform.height
        isInitialRatio.current = true
      }
      if (!ratio) {
        isInitialRatio.current = false
      }

      // 获取新的宽度和高度
      let { w, h } = getSize({
        type,
        dis,
        x,
        y,
        startAngle,
        pressAngle,
      })
      const transform = { ...newTransform }

      // 进行等比例缩放
      if (isInitialRatio.current) {
        if (widthMap[type]) h = w / currentRatio.current
        else w = h * currentRatio.current
      }
      // 还原到实际尺寸
      w /= props.zoom
      h /= props.zoom
      w = Math.min(Math.max(Math.round(w), props.minWidth), props.maxWidth)
      h = Math.min(Math.max(Math.round(h), props.minHeight), props.maxHeight)
      // 判断当前控制点是否为宽度缩放还是高度缩放
      if (widthMap[type] && !ratio) {
        transform.width = w
      } else if (heightMap[type] && !ratio) {
        transform.height = h
      } else {
        transform.width = w
        transform.height = h
      }

      // // 限制在网格中移动，原理同拖动
      if (transform.width % gridX > 0) {
        if (transform.width > localTransform.current.width) {
          // 宽度变大时向下取整
          transform.width = transform.width - (transform.width % gridX)
        } else {
          // 宽度变小时向上取整
          transform.width = transform.width - ((transform.width % gridX) - gridX)
        }
      }

      // 原理同上
      if (transform.height % gridY > 0) {
        if (transform.height > localTransform.current.height) {
          transform.height = transform.height - (transform.height % gridY)
        } else {
          transform.height = transform.height - ((transform.height % gridY) - gridY)
        }
      }

      // 根据新的旋转和宽高计算新的位置
      const matrix = getPoints(transform, props.zoom)

      const newOpposite = matrix[pointMap[type]]
      const deltaX = -(newOpposite.x - opposite.x) / props.zoom
      const deltaY = -(newOpposite.y - opposite.y) / props.zoom

      transform.x = Math.round(transform.x + deltaX)
      transform.y = Math.round(transform.y + deltaY)

      setTransform(transform)
    },

    // 准备就绪
    initBehavior: (event: MouseEvent & TouchEvent) => {
      const point = event.touches ? event.touches[0] : event
      const { clientX, clientY } = point
      localPoint.current.lastX = clientX
      localPoint.current.lastY = clientY
      localPoint.current.activeTarget = event.target as HTMLElement
      localPoint.current.parentRect = domWrapper.current!.parentElement!.getBoundingClientRect()
      localPoint.current.resizeHandler = (event.target as HTMLElement).dataset.resizetype as string
      localTransform.current = { ...newTransform }
      localLastTransform.current = { ...newTransform }
    },
  }
}
