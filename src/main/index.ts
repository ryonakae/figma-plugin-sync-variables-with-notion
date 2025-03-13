import { setRelaunchButton, showUI } from '@create-figma-plugin/utilities'

import { DEFAULT_WIDTH } from '@/constants'

export default async function () {
  // set relaunch button
  setRelaunchButton(figma.root, 'open')

  // show ui
  showUI({
    width: DEFAULT_WIDTH,
    height: 400,
  })
}
