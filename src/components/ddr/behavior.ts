import { MouseEvent, TouchEvent, useEffect, useRef, useState } from 'react'
import { DDRProps, LocalPointProps, LocalResizeProps, LocalRotateProps, TransformProps } from './type'
import BehaviorImpl from './behavior-impl'
import { getDefaultProps } from './defaults'

export function useDDRBehavior(initProps: Partial<DDRProps>) {
  const props = getDefaultProps(initProps)
  const [newTransform, setTransform] = useState<TransformProps>(props.value)

  const isInitialRatio = useRef(false)
  const currentRatio = useRef(1)
  const localRotateOption = useRef({} as LocalRotateProps)
  const localResizeOption = useRef({} as LocalResizeProps)
  const localPoint = useRef({} as LocalPointProps)
  const localLastTransform = useRef({ ...newTransform })
  const localTransform = useRef({ ...newTransform })

  const domWrapper = useRef<HTMLDivElement>(null)
  // 对辅具体实现进行初始化
  const behaviorImpl = BehaviorImpl.init({
    newTransform,
    localLastTransform,
    localTransform,
    localPoint,
    currentRatio,
    isInitialRatio,
    localResizeOption,
    localRotateOption,
    setTransform,
    props,
  })

  useEffect(() => {
    setTransform(behaviorImpl.options.props.value)
  }, [behaviorImpl.options.props.value])

  return {
    behavior: behaviorImpl,
    domWrapper,
    // 准备就绪
    setMouseDownHandler: (event: MouseEvent & TouchEvent) => {
      if (!props.active && !props.beforeActive()) return
      behaviorImpl.handleDefaultEvent(event)
      const point = event.touches ? event.touches[0] : event
      const target = event.target as HTMLElement
      const { clientX, clientY } = point
      // 缓存当前鼠标位置相关信息和点击的元素信息
      localPoint.current.lastX = clientX
      localPoint.current.lastY = clientY
      localPoint.current.activeTarget = target
      localPoint.current.parentRect = domWrapper.current!.parentElement!.getBoundingClientRect()
      console.log(localPoint.current.parentRect)
      localPoint.current.resizeHandler = target.dataset.resizetype as string
      localTransform.current = { ...newTransform }
      localLastTransform.current = { ...newTransform }

      const moveHandler = (event: any) => {
        behaviorImpl.setMoveHandler(event)
      }
      const upHandler = (e: any) => {
        behaviorImpl.handleDefaultEvent(e)
        document.removeEventListener('mousemove', moveHandler, false)
        document.removeEventListener('mouseup', moveHandler, false)
        document.removeEventListener('mouseup', upHandler, false)
        document.removeEventListener('touchend', upHandler, false)
        const current = localPoint.current
        current.isDragging = current.isResizing = current.isRotating = false
        current.isReadyToDrag = current.isReadyToResize = current.isReadyToRotate = false
        // emit hooks
        if (current.handlerType == 'resize') {
          behaviorImpl.callHooks('onResizeend', event, newTransform)
        } else if (current.handlerType == 'rotate') {
          behaviorImpl.callHooks('onRotateend', event, newTransform)
        } else if (current.handlerType == 'drag') {
          behaviorImpl.callHooks('onDragend', event, newTransform)
        }
      }

      document.addEventListener('mousemove', moveHandler, false)
      document.addEventListener('touchmove', moveHandler, false)
      document.addEventListener('touchend', upHandler, false)
      document.addEventListener('mouseup', upHandler, false)

      const type = (event.target as HTMLElement).dataset.type
      if (type === 'rotate') {
        localPoint.current.handlerType = 'rotate'
        localPoint.current.isReadyToRotate = true
        behaviorImpl.setRotateStart(event, domWrapper.current!)
        behaviorImpl.callHooks('onRotatestart', event, newTransform)
      } else if (target.dataset.resizetype) {
        localPoint.current.handlerType = 'resize'
        localPoint.current.isReadyToResize = true
        behaviorImpl.setResizeStart(event)
        behaviorImpl.callHooks('onResizestart', event, newTransform)
      } else {
        localPoint.current.handlerType = 'drag'
        localPoint.current.isReadyToDrag = true
        props.draggable && behaviorImpl.callHooks('onDragstart', event, newTransform)
      }
    },
  }
}
