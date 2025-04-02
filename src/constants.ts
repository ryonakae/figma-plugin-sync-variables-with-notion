export const SETTINGS_KEY = 'sync-variables-with-notion-settings'
export const CACHE_KEY = 'sync-variables-with-notion-cache'
export const GROUP_ID_KEY = 'sync-variables-with-notion-group-id'

export const DEFAULT_WIDTH = 400

export const DEFAULT_DOCUMENT_SETTINGS: DocumentSettings = {
  // collection
  notionDatabaseId: '',
  notionIntegrationToken: '',
  notionKeyPropertyName: '',
  notionValuePropertyNames: [],
  figmaCollectionName: '',
}

export const DEFAULT_CLIENT_STORAGE_SETTINGS: ClientStorageSettings = {
  // common
  selectedTab: 'Create/Update Collection',

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

export const DEFAULT_TMP_SETTINGS: TmpSettings = {
  loading: false,
  localCollections: [],
  libraryCollections: [],
}
