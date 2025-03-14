export const SETTINGS_KEY = 'sync-variables-with-notion-settings'
export const CACHE_KEY = 'sync-variables-with-notion-cache'
export const GROUP_ID_KEY = 'sync-variables-with-notion-group-id'

export const DEFAULT_WIDTH = 400

export const DEFAULT_SETTINGS: Settings = {
  // common
  selectedTab: 'Create/Update Collection',

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
}

export const DEFAULT_TMP_SETTINGS: TmpSettings = {
  loading: false,
}
