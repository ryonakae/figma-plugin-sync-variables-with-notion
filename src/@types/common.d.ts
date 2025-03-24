declare global {
  type SelectedTab = 'Create/Update Collection' | 'List' | 'Utilities'

  type SortValue = 'key' | 'value' | 'created_time' | 'last_edited_time'
  type SortOrder = 'ascending' | 'descending'

  type TargetTextRange = 'currentPage' | 'selection' | 'allPages'

  type PluginLanguage = 'en' | 'ja'

  type LocalVariableCollectionForUI = {
    id: string
    name: string
    modes: { modeId: string; name: string }[]
  }

  type VariableForUI = {
    id: string
    name: string
    description: string
    variableCollectionId: string
    key: string
    valuesByMode: { [modeId: string]: VariableValue }
    scopes: VariableScope[]
  }

  type DocumentSettings = {
    // collection
    notionDatabaseId: string
    notionIntegrationToken: string
    notionKeyPropertyName: string
    notionValuePropertyNames: string[]
    collectionName: string
  }

  type ClientStorageSettings = {
    // common
    selectedTab: SelectedTab

    // list
    filterString: string
    sortValue: SortValue
    sortOrder: SortOrder
    selectedListItemId: string | null
    displayModeId: string | null
    scrollPosition: number

    // utilities
    targetCollection:
      | 'all'
      | LocalVariableCollectionForUI
      | LibraryVariableCollection
    targetTextRange: TargetTextRange
    isIncludeComponents: boolean
    isIncludeInstances: boolean
    includeKeyPropertyName: string
  }

  type Settings = DocumentSettings & ClientStorageSettings

  type TmpSettings = {
    loading: boolean
  }
}

export {}
