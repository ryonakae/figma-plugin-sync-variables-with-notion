import type { DropdownOptionValue } from '@create-figma-plugin/ui'

declare global {
  type SelectedTab = 'Sync collection' | 'List' | 'Utilities'

  type SortValue = 'key' | 'value' | 'created_time' | 'last_edited_time'
  type SortOrder = 'ascending' | 'descending'

  type TargetTextRange = 'selection' | 'currentPage' | 'allPages'

  type PluginLanguage = 'en' | 'ja'

  type VariableCollectionForUI = {
    id: string
    name: string
    modes: { modeId: string; name: string }[]
  }

  type VariableForUI = {
    id: string
    name: string
    // description: string
    // remote: boolean
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
      | VariableCollectionForUI
      | LibraryVariableCollection
      | null
    listDisplayModeId: string | null
    listFilterString: string
    listSelectedListItems: { [collectionId: string]: string | null }
    listScrollPositions: { [collectionId: string]: number }

    // utilities
    utilitiesTargetCollection:
      | 'all'
      | VariableCollectionForUI
      | LibraryVariableCollection
    utilitiesTargetTextRange: TargetTextRange
    utilitiesIsIncludeComponents: boolean
    utilitiesIsIncludeInstances: boolean
    utilitiesIncludeKeyPropertyName: string
  }

  type Settings = DocumentSettings & ClientStorageSettings

  type TmpSettings = {
    loading: boolean
    loadingVariables: boolean
    localCollections: VariableCollectionForUI[]
    libraryCollections: LibraryVariableCollection[]
  }

  type ClientStorageCache = {
    [libraryCollectionKey: string]: Variable[]
  }

  type ListTargetCollectionDropdownOptionValue = DropdownOptionValue & {
    value: string | null
  }
  type ListTargetCollectionDropdownOption =
    | DropdownOptionHeader
    | DropdownOptionSeparator
    | ListTargetCollectionDropdownOptionValue
}
