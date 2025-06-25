// 드래그 기능 제거됨 - 빈 파일
export function useDragHandler() {
  return {
    boardRef: null,
    dragState: null,
    handleMouseDown: () => {},
    handleMouseMove: () => {},
    handleMouseUp: () => {},
    handleMouseLeave: () => {},
    dragBoxStyle: { display: 'none' }
  }
}
