import { emit } from '@create-figma-plugin/utilities'

import { DEFAULT_WIDTH } from '@/constants'

export default function useResizeWindow() {
  function resizeWindow() {
    const wrapper = document.getElementById('wrapper')
    const height = wrapper?.clientHeight || 0

    emit<ResizeWindowFromUI>('RESIZE_WINDOW_FROM_UI', {
      width: DEFAULT_WIDTH,
      height,
    })
  }

  return { resizeWindow }
}
