import type { DropdownOptionValue } from '@create-figma-plugin/ui'

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
    remote: boolean
    variableCollectionId: string
    key: string
    resolvedType: VariableResolvedDataType
    valuesByMode: { [modeId: string]: VariableValue }
    scopes: VariableScope[]
  }

  type DocumentSettings = {
    // collection
    notionDatabaseId: string
    notionIntegrationToken: string
    notionKeyPropertyName: string
    notionValuePropertyNames: string[]
    figmaCollectionName: string
  }

  type ClientStorageSettings = {
    // common
    selectedTab: SelectedTab

    // list
    listTargetCollection:
      | LocalVariableCollectionForUI
      | LibraryVariableCollection
      | null
    listDisplayModeId: string | null
    filterString: string
    selectedListItemId: string | null
    scrollPositions: { [collectionId: string]: number }

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
    localCollections: LocalVariableCollectionForUI[]
    libraryCollections: LibraryVariableCollection[]
  }

  type ListTargetCollectionDropdownOptionValue = DropdownOptionValue & {
    value: string | null
  }
  type ListTargetCollectionDropdownOption =
    | DropdownOptionHeader
    | DropdownOptionSeparator
    | ListTargetCollectionDropdownOptionValue
}
