/**
 * UI と Main スレッド間の通信に使用するイベントハンドラの型定義
 * イベント名とそのハンドラ関数の型を定義
 */
import type { EventHandler } from '@create-figma-plugin/utilities'

declare global {
  /**
   * Main から UI へ設定を読み込むイベント
   */
  interface LoadSettingsFromMain extends EventHandler {
    name: 'LOAD_SETTINGS_FROM_MAIN'
    handler: (settings: Settings) => void
  }

  /**
   * UI から Main へ設定を保存するイベント
   */
  interface SaveSettingsFromUI extends EventHandler {
    name: 'SAVE_SETTINGS_FROM_UI'
    handler: (settings: Settings) => void
  }

  /**
   * UI から通知を表示するイベント
   */
  interface NotifyFromUI extends EventHandler {
    name: 'NOTIFY_FROM_UI'
    handler: (options: {
      message: string
      options?: NotificationOptions
    }) => void
  }

  /**
   * Main から処理完了通知を送るイベント
   */
  interface ProcessFinishFromMain extends EventHandler {
    name: 'PROCESS_FINISH_FROM_MAIN'
    handler: (options: {
      message: string
      options?: NotificationOptions
    }) => void
  }

  /**
   * UI からウィンドウサイズ変更を要求するイベント
   */
  interface ResizeWindowFromUI extends EventHandler {
    name: 'RESIZE_WINDOW_FROM_UI'
    handler: (windowSize: { width: number; height: number }) => void
  }

  /**
   * UI からコレクション同期を要求するイベント
   */
  interface SyncCollectionFromUI extends EventHandler {
    name: 'SYNC_COLLECTION_FROM_UI'
    handler: (options: {
      collectionName: string
      notionKeyValues: NotionKeyValue[]
      notionValuePropertyNames: string[]
    }) => void
  }

  /**
   * UI からコレクション一覧取得を要求するイベント
   */
  interface GetCollectionsFromUI extends EventHandler {
    name: 'GET_COLLECTIONS_FROM_UI'
    handler: () => void
  }

  /**
   * Main から UI へコレクション一覧を設定するイベント
   */
  interface SetCollectionsFromMain extends EventHandler {
    name: 'SET_COLLECTIONS_FROM_MAIN'
    handler: (options: {
      localCollections: VariableCollectionForUI[]
      libraryCollections: LibraryVariableCollection[]
    }) => void
  }

  /**
   * UI からローカル変数一覧取得を要求するイベント
   */
  interface GetLocalVariablesFromUI extends EventHandler {
    name: 'GET_LOCAL_VARIABLES_FROM_UI'
    handler: (targetCollection: VariableCollectionForUI) => void
  }

  /**
   * Main から UI へローカル変数一覧を設定するイベント
   */
  interface SetLocalVariablesFromMain extends EventHandler {
    name: 'SET_LOCAL_VARIABLES_FROM_MAIN'
    handler: (variablesForUI: VariableForUI[]) => void
  }

  /**
   * UI からライブラリ変数一覧取得を要求するイベント
   */
  interface GetLibraryVariablesFromUI extends EventHandler {
    name: 'GET_LIBRARY_VARIABLES_FROM_UI'
    handler: (targetCollection: LibraryVariableCollection) => void
  }

  /**
   * Main から UI へライブラリ変数一覧を設定するイベント
   */
  interface SetLibraryVariablesFromMain extends EventHandler {
    name: 'SET_LIBRARY_VARIABLES_FROM_MAIN'
    handler: (options: {
      variablesForUI: VariableForUI[]
      cacheResult: SaveCacheResult
    }) => void
  }

  /**
   * UI から変数適用を要求するイベント
   */
  interface ApplyVariableFromUI extends EventHandler {
    name: 'APPLY_VARIABLE_FROM_UI'
    handler: (variableForUI: VariableForUI) => void
  }

  /**
   * UI から一括変数適用を要求するイベント
   */
  interface BulkApplyVariablesFromUI extends EventHandler {
    name: 'BULK_APPLY_VARIABLES_FROM_UI'
    handler: (options: {
      collection: 'all' | VariableCollectionForUI | LibraryVariableCollection
      targetTextRange: TargetTextRange
      isIncludeComponents: boolean
      isIncludeInstances: boolean
      includeKeyPropertyName?: string
    }) => void
  }

  /**
   * UI からテキストハイライトを要求するイベント
   */
  interface HighlightTextFromUI extends EventHandler {
    name: 'HIGHLIGHT_TEXT_FROM_UI'
    handler: (targetTextRange: TargetTextRange) => void
  }

  /**
   * UI からキャッシュクリアを要求するイベント
   */
  interface clearCacheFromUI extends EventHandler {
    name: 'CLEAR_CACHE_FROM_UI'
    handler: (libraryCollectionKey: string) => void
  }
}
