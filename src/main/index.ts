import {
  emit,
  on,
  setRelaunchButton,
  showUI,
} from '@create-figma-plugin/utilities'

import { DEFAULT_WIDTH } from '@/constants'
import createOrUpdateCollection from '@/main/createOrUpdateCollection'
import loadSettings from '@/main/loadSettings'
import saveSettings from '@/main/saveSettings'

export default async function () {
  // set relaunch button
  setRelaunchButton(figma.root, 'open')

  // show ui
  showUI({
    width: DEFAULT_WIDTH,
    height: 0,
  })

  // register event handlers
  on<SaveSettingsFromUI>('SAVE_SETTINGS_FROM_UI', saveSettings)

  on<NotifyFromUI>('NOTIFY_FROM_UI', options => {
    figma.notify(options.message, options.options)
  })

  on<ResizeWindowFromUI>('RESIZE_WINDOW_FROM_UI', windowSize => {
    figma.ui.resize(windowSize.width, windowSize.height)
  })

  on<CreateOrUpdateCollectionFromUI>(
    'CREATE_OR_UPDATE_COLLECTION_FROM_UI',
    options => {
      createOrUpdateCollection(options).catch((error: Error) => {
        emit<ProcessFinishFromMain>('PROCESS_FINISH_FROM_MAIN', {
          message: error.message,
          options: {
            error: true,
          },
        })
        throw new Error(error.message)
      })
    },
  )

  // ちょっとdelayさせてからUI側にsettingsを送る（たまにエラーが出るので）
  setTimeout(() => {
    loadSettings()
  }, 100)
}
