/**
 * プラグイン全体で使用する定数を定義
 * 設定キー、キャッシュキー、デフォルト値などを含む
 */

// ストレージのキー名
export const SETTINGS_KEY = 'sync-variables-with-notion-settings'
export const CACHE_KEY = 'sync-variables-with-notion-cache'
export const GROUP_ID_KEY = 'sync-variables-with-notion-group-id'

// UIのデフォルトサイズ
export const DEFAULT_WIDTH = 400
export const DEFAULT_HEIGHT = 0

// ドキュメント設定のデフォルト値
export const DEFAULT_DOCUMENT_SETTINGS: DocumentSettings = {
  // collection
  notionDatabaseId: '',
  notionIntegrationToken: '',
  notionKeyPropertyName: '',
  notionValuePropertyNames: [],
  figmaCollectionName: '',
}

// クライアントストレージ設定のデフォルト値
export const DEFAULT_CLIENT_STORAGE_SETTINGS: ClientStorageSettings = {
  // common
  selectedTab: 'Sync collection',

  // list
  listTargetCollection: null,
  listDisplayModeId: null,
  listFilterString: '',
  listSelectedListItems: {},
  listScrollPositions: {},

  // utilities
  utilitiesTargetCollection: 'all',
  utilitiesTargetTextRange: 'selection',
  utilitiesIsIncludeComponents: true,
  utilitiesIsIncludeInstances: false,
  utilitiesIncludeKeyPropertyName: '',
}

// 一時的な設定のデフォルト値
export const DEFAULT_TMP_SETTINGS: TmpSettings = {
  loading: false,
  loadingVariables: false,
  localCollections: [],
  libraryCollections: [],
}
