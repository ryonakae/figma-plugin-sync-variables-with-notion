import {
  emit,
  on,
  setRelaunchButton,
  showUI,
} from '@create-figma-plugin/utilities'

import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@/constants'
import applyVariable from '@/main/applyVariable'
import bulkApplyVariables from '@/main/bulkApplyVariables'
import { clearCache } from '@/main/cache'
import handleError from '@/main/handleError'
import highlightText from '@/main/highlightText'
import { loadSettings, saveSettings } from '@/main/settings'
import syncCollection from '@/main/syncCollection'

import getCollections from '@/main/utils/getCollections'
import getLibraryVariablesForUI from '@/main/utils/getLibraryVariablesForUI'
import getLocalVariableForUI from '@/main/utils/getLocalVariableForUI'

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
    figma.notify(options.message || 'Something went wrong', options.options)
  })

  on<ResizeWindowFromUI>('RESIZE_WINDOW_FROM_UI', windowSize => {
    figma.ui.resize(windowSize.width, windowSize.height)
  })

  on<SyncCollectionFromUI>('SYNC_COLLECTION_FROM_UI', async options => {
    await syncCollection(options).catch((error: Error) => {
      handleError(error)
      throw new Error(error.message)
    })

    emit<ProcessFinishFromMain>('PROCESS_FINISH_FROM_MAIN', {
      message: 'Collection synced successfully.',
    })
  })

  on<GetCollectionsFromUI>('GET_COLLECTIONS_FROM_UI', async () => {
    const collections = await getCollections().catch((error: Error) => {
      handleError(error)
      throw new Error(error.message)
    })

    emit<SetCollectionsFromMain>('SET_COLLECTIONS_FROM_MAIN', collections)
  })

  on<GetLibraryVariablesFromUI>(
    'GET_LIBRARY_VARIABLES_FROM_UI',
    async targetCollection => {
      const variablesForUI = await getLibraryVariablesForUI(
        targetCollection,
      ).catch((error: Error) => {
        handleError(error)
        throw new Error(error.message)
      })

      emit<SetLibraryVariablesFromMain>(
        'SET_LIBRARY_VARIABLES_FROM_MAIN',
        variablesForUI,
      )
    },
  )

  on<GetLocalVariablesFromUI>(
    'GET_LOCAL_VARIABLES_FROM_UI',
    async targetCollection => {
      const variablesForUI = await getLocalVariableForUI(
        targetCollection,
      ).catch((error: Error) => {
        handleError(error)
        throw new Error(error.message)
      })

      emit<SetLocalVariablesFromMain>(
        'SET_LOCAL_VARIABLES_FROM_MAIN',
        variablesForUI,
      )
    },
  )

  on<ApplyVariableFromUI>('APPLY_VARIABLE_FROM_UI', async variable => {
    await applyVariable(variable).catch((error: Error) => {
      handleError(error)
      throw new Error(error.message)
    })

    emit<ProcessFinishFromMain>('PROCESS_FINISH_FROM_MAIN', {
      message: 'Variable applied successfully.',
    })
  })

  on<BulkApplyVariablesFromUI>(
    'BULK_APPLY_VARIABLES_FROM_UI',
    async options => {
      await bulkApplyVariables(options).catch((error: Error) => {
        handleError(error)
        throw new Error(error.message)
      })
    },
  )

  on<HighlightTextFromUI>('HIGHLIGHT_TEXT_FROM_UI', async targetTextRange => {
    await highlightText(targetTextRange).catch((error: Error) => {
      handleError(error)
      throw new Error(error.message)
    })

    emit<ProcessFinishFromMain>('PROCESS_FINISH_FROM_MAIN', {
      message: 'Highlighted applied variables.',
    })
  })

  on<clearCacheFromUI>('CLEAR_CACHE_FROM_UI', clearCache)

  // ちょっとdelayさせてからUI側にsettingsを送る（たまにエラーが出るので）
  setTimeout(() => {
    loadSettings()
  }, 100)
}
