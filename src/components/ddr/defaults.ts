import { DDRProps } from './type'

export function getDefaultProps(props: Partial<DDRProps>) {
  const defaults = {
    value: { x: 0, y: 0, width: 100, height: 100, rotation: 0 },
    handlerSize: 11,
    active: true,
    resizeHandler: ['tl', 'tm', 'tr', 'r', 'br', 'bm', 'bl', 'l'],
    resizable: true,
    rotatable: true,
    draggable: true,
    acceptRatio: false,
    minWidth: 1,
    minHeight: 1,
    maxWidth: 1000000,
    maxHeight: 1000000,
    parent: false,
    grid: [1, 1],
    stop: true,
    prevent: true,
    zoom: 1,
    axis: 'xy',
    beforeActive: () => false,
  }

  return { ...defaults, ...props } as DDRProps
}
