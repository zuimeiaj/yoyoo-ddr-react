export function getClassNames(state: any) {
  const ddrClassNames = ['yoyoo-ddr'];
  if (state.active) ddrClassNames.push('active');
  if (state.isDragging) ddrClassNames.push('ddr-dragging');
  if (state.isResizing) ddrClassNames.push('ddr-resizing');
  if (state.isRotating) ddrClassNames.push('ddr-rotating');
  if (state.isReadyToDrag) ddrClassNames.push('ddr-ready-drag');
  if (state.isReadyToResize) ddrClassNames.push('ddr-ready-resize');
  if (state.isReadyToRotate) ddrClassNames.push('ddr-ready-rotate');
  return ddrClassNames;
}
