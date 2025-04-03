import type { EventHandler } from '@create-figma-plugin/utilities'

declare global {
  interface LoadSettingsFromMain extends EventHandler {
    name: 'LOAD_SETTINGS_FROM_MAIN'
    handler: (settings: Settings) => void
  }

  interface SaveSettingsFromUI extends EventHandler {
    name: 'SAVE_SETTINGS_FROM_UI'
    handler: (settings: Settings) => void
  }

  interface NotifyFromUI extends EventHandler {
    name: 'NOTIFY_FROM_UI'
    handler: (options: {
      message: string
      options?: NotificationOptions
    }) => void
  }

  interface ProcessFinishFromMain extends EventHandler {
    name: 'PROCESS_FINISH_FROM_MAIN'
    handler: (options: {
      message: string
      options?: NotificationOptions
    }) => void
  }

  interface ResizeWindowFromUI extends EventHandler {
    name: 'RESIZE_WINDOW_FROM_UI'
    handler: (windowSize: { width: number; height: number }) => void
  }

  interface SyncCollectionFromUI extends EventHandler {
    name: 'SYNC_COLLECTION_FROM_UI'
    handler: (options: {
      collectionName: string
      notionKeyValues: NotionKeyValue[]
      notionValuePropertyNames: string[]
    }) => void
  }

  interface GetCollectionsFromUI extends EventHandler {
    name: 'GET_COLLECTIONS_FROM_UI'
    handler: () => void
  }

  interface SetCollectionsFromMain extends EventHandler {
    name: 'SET_COLLECTIONS_FROM_MAIN'
    handler: (options: {
      localCollections: LocalVariableCollectionForUI[]
      libraryCollections: LibraryVariableCollection[]
    }) => void
  }

  interface GetLocalVariablesFromUI extends EventHandler {
    name: 'GET_LOCAL_VARIABLES_FROM_UI'
    handler: (targetCollection: LocalVariableCollectionForUI) => void
  }

  interface SetLocalVariablesFromMain extends EventHandler {
    name: 'SET_LOCAL_VARIABLES_FROM_MAIN'
    handler: (variablesForUI: VariableForUI[]) => void
  }

  interface GetLibraryVariablesFromUI extends EventHandler {
    name: 'GET_LIBRARY_VARIABLES_FROM_UI'
    handler: (targetCollection: LibraryVariableCollection) => void
  }

  interface SetLibraryVariablesFromMain extends EventHandler {
    name: 'SET_LIBRARY_VARIABLES_FROM_MAIN'
    handler: (variablesForUI: VariableForUI[]) => void
  }

  interface ApplyVariableFromUI extends EventHandler {
    name: 'APPLY_VARIABLE_FROM_UI'
    handler: (variableForUI: VariableForUI) => void
  }

  interface BulkApplyVariablesFromUI extends EventHandler {
    name: 'BULK_APPLY_VARIABLES_FROM_UI'
    handler: (options: {
      collection:
        | 'all'
        | LocalVariableCollectionForUI
        | LibraryVariableCollection
      targetTextRange: TargetTextRange
      isIncludeComponents: boolean
      isIncludeInstances: boolean
      includeKeyPropertyName?: string
    }) => void
  }

  interface HighlightTextFromUI extends EventHandler {
    name: 'HIGHLIGHT_TEXT_FROM_UI'
    handler: (targetTextRange: TargetTextRange) => void
  }

  interface clearCacheFromUI extends EventHandler {
    name: 'CLEAR_CACHE_FROM_UI'
    handler: (libraryCollectionKey: string) => void
  }
}
