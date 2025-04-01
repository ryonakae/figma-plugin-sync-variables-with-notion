import {
  emit,
  on,
  setRelaunchButton,
  showUI,
} from '@create-figma-plugin/utilities'

import { DEFAULT_WIDTH } from '@/constants'
import applyVariable from '@/main/applyVariable'
import getCollections from '@/main/getCollections'
import getLibraryVariables from '@/main/getLibraryVariables'
import getLocalVariables from '@/main/getLocalVariables'
import loadSettings from '@/main/loadSettings'
import saveSettings from '@/main/saveSettings'
import syncCollection from '@/main/syncCollection'

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

  on<SyncCollectionFromUI>('SYNC_COLLECTION_FROM_UI', options => {
    syncCollection(options).catch((error: Error) => {
      emit<ProcessFinishFromMain>('PROCESS_FINISH_FROM_MAIN', {
        message: error.message,
        options: {
          error: true,
        },
      })
      throw new Error(error.message)
    })
  })

  on<GetCollectionsFromUI>('GET_COLLECTIONS_FROM_UI', getCollections)

  on<GetLibraryVariablesFromUI>(
    'GET_LIBRARY_VARIABLES_FROM_UI',
    getLibraryVariables,
  )

  on<GetLocalVariablesFromUI>('GET_LOCAL_VARIABLES_FROM_UI', getLocalVariables)

  on<ApplyVariableFromUI>('APPLY_VARIABLE_FROM_UI', applyVariable)

  // ちょっとdelayさせてからUI側にsettingsを送る（たまにエラーが出るので）
  setTimeout(() => {
    loadSettings()
  }, 100)
}
