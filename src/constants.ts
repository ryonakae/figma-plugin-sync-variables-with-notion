export const SETTINGS_KEY = 'sync-variables-with-notion'

export const DEFAULT_WIDTH = 400

export const DEFAULT_SETTINGS: Settings = {
  // common
  selectedTabKey: 'collection',

  // collection
  notionIntegrationToken: '',
  notionDatabaseId: '',
  notionKeyPropertyName: '',
  collectionName: '',
  languages: [],

  // list
  filterString: '',
  sortValue: 'created_time',
  sortOrder: 'descending',
  selectedListItemId: null,
  displayModeId: null,
  scrollPosition: 0,

  // utilities
  targetCollection: 'all',
  targetTextRange: 'currentPage',
  isIncludeComponents: true,
  isIncludeInstances: false,
  includeKeyPropertyName: '',

  // settings
  pluginLanguage: 'en',
}

export const DEFAULT_TMP_SETTINGS: TmpSettings = {
  loading: false,
}
