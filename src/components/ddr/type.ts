import React, { Dispatch, MouseEvent, MutableRefObject, SetStateAction } from 'react'

export interface TransformProps {
  x: number
  y: number
  width: number
  height: number
  rotation: number
}

export type HanlderType = 'tl' | 'tm' | 'tr' | 'r' | 'br' | 'bm' | 'bl' | 'l'
export interface DDRPoint {
  x: number
  y: number
}

export interface DDREvents {
  onDragstart: (event: MouseEvent, transform: TransformProps) => void

  onDrag: (event: MouseEvent, transform: TransformProps) => void
  onDragend: (event: MouseEvent, transform: TransformProps) => void

  onRotatestart: (event: MouseEvent, transform: TransformProps) => void
  onRotate: (event: MouseEvent, transform: TransformProps) => void
  onRotateend: (event: MouseEvent, transform: TransformProps) => void

  onResizestart: (event: MouseEvent, transform: TransformProps) => void
  onResize: (event: MouseEvent, transform: TransformProps) => void
  onResizeend: (event: MouseEvent, transform: TransformProps) => void
  onChange: (event: MouseEvent, transform: TransformProps) => void
}
export type DDRHooks = keyof DDREvents
export interface DDRProps extends DDREvents {
  children: React.JSX.Element
  value: TransformProps
  handlerSize: number
  active: boolean
  resizeHandler: HanlderType[]
  resizable: boolean
  rotatable: boolean
  draggable: boolean
  acceptRatio: boolean
  minWidth: number
  minHeight: number
  maxWidth: number
  maxHeight: number
  parent: boolean
  grid: [number, number]
  stop: boolean
  prevent: boolean
  zoom: number
  axis: 'x' | 'y' | 'xy'

  beforeActive: () => boolean
}

export interface LocalPointProps {
  lastX: number
  lastY: number
  deltaX: number
  deltaY: number
  activeTarget: HTMLElement
  parentRect: DOMRect
  resizeHandler: string
  isReadyToDrag: boolean
  isReadyToResize: boolean
  isReadyToRotate: boolean
  handlerType: string
  isResizing: boolean
  isDragging: boolean
  isRotating: boolean
}
export interface LocalRotateProps {
  cx: number
  cy: number
  startAngle: number
  rotation: number
}
export interface LocalResizeProps {
  matrix: DDRPoint[]
  rect: TransformProps
  type: string
  opposite: DDRPoint
  opp2: DDRPoint
  pressAngle: number
  startAngle: number
  offsetX: number
  offsetY: number
}

export interface BehaviorImplOptions {
  newTransform: TransformProps
  localTransform: MutableRefObject<TransformProps>
  localLastTransform: MutableRefObject<TransformProps>
  localRotateOption: MutableRefObject<LocalRotateProps>
  props: DDRProps
  localResizeOption: MutableRefObject<LocalResizeProps>
  currentRatio: MutableRefObject<number>
  isInitialRatio: MutableRefObject<boolean>
  localPoint: MutableRefObject<LocalPointProps>
  setTransform: Dispatch<SetStateAction<TransformProps>>
}

export interface ElementRect {
  left: number
  right: number
  top: number
  bottom: number
  width: number
  height: number
}
