import {
  emit,
  loadSettingsAsync,
  on,
  saveSettingsAsync,
  setRelaunchButton,
  showUI,
} from '@create-figma-plugin/utilities'

import { DEFAULT_SETTINGS, DEFAULT_WIDTH, SETTINGS_KEY } from '@/constants'

export default async function () {
  // set relaunch button
  setRelaunchButton(figma.root, 'open')

  // show ui
  showUI({
    width: DEFAULT_WIDTH,
    height: 0,
  })

  // register event handlers
  on<SaveSettingsFromUI>('SAVE_SETTINGS_FROM_UI', async settings => {
    await saveSettingsAsync<Settings>(settings, SETTINGS_KEY)
  })

  on<NotifyFromUI>('NOTIFY_FROM_UI', options => {
    figma.notify(options.message, options.options)
  })

  on<ResizeWindowFromUI>('RESIZE_WINDOW_FROM_UI', windowSize => {
    figma.ui.resize(windowSize.width, windowSize.height)
  })

  // load options from clientStorage
  const settings = await loadSettingsAsync<Settings>(
    DEFAULT_SETTINGS,
    SETTINGS_KEY,
  )

  // ちょっとdelayさせてからUI側にsettingsを送る（たまにエラーが出るので）
  setTimeout(() => {
    emit<LoadSettingsFromMain>('LOAD_SETTINGS_FROM_MAIN', settings)
  }, 100)
}
