import {
  emit,
  on,
  setRelaunchButton,
  showUI,
} from '@create-figma-plugin/utilities'

import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@/constants'
import applyVariable from '@/main/applyVariable'
import bulkApplyVariables from '@/main/bulkApplyVariables'
import getCollections from '@/main/getCollections'
import getLibraryVariables from '@/main/getLibraryVariables'
import getLocalVariables from '@/main/getLocalVariables'
import highlightText from '@/main/highlightText'
import loadSettings from '@/main/loadSettings'
import saveSettings from '@/main/saveSettings'
import syncCollection from '@/main/syncCollection'

export default async function () {
  // set relaunch button
  setRelaunchButton(figma.root, 'open')

  // show ui
  showUI({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  })

  // register event handlers
  on<SaveSettingsFromUI>('SAVE_SETTINGS_FROM_UI', saveSettings)

  on<NotifyFromUI>('NOTIFY_FROM_UI', options => {
    figma.notify(options.message, options.options)
  })

  on<ResizeWindowFromUI>('RESIZE_WINDOW_FROM_UI', windowSize => {
    figma.ui.resize(windowSize.width, windowSize.height)
  })

  on<SyncCollectionFromUI>('SYNC_COLLECTION_FROM_UI', async options => {
    await syncCollection(options).catch((error: Error) => {
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

  on<BulkApplyVariablesFromUI>(
    'BULK_APPLY_VARIABLES_FROM_UI',
    bulkApplyVariables,
  )

  on<HighlightTextFromUI>('HIGHLIGHT_TEXT_FROM_UI', highlightText)

  // ちょっとdelayさせてからUI側にsettingsを送る（たまにエラーが出るので）
  setTimeout(() => {
    loadSettings()
  }, 100)
}
