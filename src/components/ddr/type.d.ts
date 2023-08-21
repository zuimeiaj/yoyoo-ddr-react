import React, { MouseEvent } from 'react'

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
  onDragstart(event: MouseEvent, transform: TransformProps): void

  onDrag(event: MouseEvent, transform: TransformProps): void
  onDragend(event: MouseEvent, transform: TransformProps): void

  onRotatestart(event: MouseEvent, transform: TransformProps): void
  onRotate(event: MouseEvent, transform: TransformProps): void
  onRotateend(event: MouseEvent, transform: TransformProps): void

  onResizestart(event: MouseEvent, transform: TransformProps): void
  onResize(event: MouseEvent, transform: TransformProps): void
  onResizeend(event: MouseEvent, transform: TransformProps): void
}

export interface DDRProps extends DDREvents {
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
  id: string
  grid: [number, number]
  stop: boolean
  prevent: boolean
  zoom: number
  axis: 'x' | 'y' | 'xy'

  renderContent: () => React.ReactNode
  beforeActive: (id: string) => boolean
}

export interface LocalPointProps {
  lastX: number
  lastY: number
  activeTarget: HTMLElement
  parentRect: DOMRect
  resizeHandler: string
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
