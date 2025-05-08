/** @jsx h */
/**
 * UIのエントリーポイント
 * プラグインのUIコンポーネントをレンダリング
 */
import { h } from 'preact'

import { render } from '@create-figma-plugin/ui'

import App from '@/ui/App'

/**
 * メインのプラグインコンポーネント
 * Appコンポーネントをラップ
 */
function Plugin() {
  return <App />
}

export default render(Plugin)
