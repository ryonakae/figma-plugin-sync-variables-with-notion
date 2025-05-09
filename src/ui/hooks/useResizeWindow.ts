import { emit } from '@create-figma-plugin/utilities'

import { DEFAULT_WIDTH } from '@/constants'

/**
 * ウィンドウのリサイズを行うカスタムフック
 * コンテンツの高さに合わせてウィンドウサイズを調整
 */
export default function useResizeWindow() {
  /**
   * コンテンツに合わせてウィンドウをリサイズする関数
   * wrapperの高さを計測し、mainスレッドにリサイズ要求を送信
   */
  function resizeWindow() {
    const wrapper = document.getElementById('wrapper')
    const height = wrapper?.clientHeight || 0

    emit<ResizeWindowFromUI>('RESIZE_WINDOW_FROM_UI', {
      width: DEFAULT_WIDTH,
      height,
    })

    console.log('[useResizeWindow] resizeWindow', {
      width: DEFAULT_WIDTH,
      height,
    })
  }

  return { resizeWindow }
}
