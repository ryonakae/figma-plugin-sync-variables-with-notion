declare global {
  type Tab = {
    key: string
    value: string
  }
  type SelectedTabKey = 'collection' | 'list' | 'utilities' | 'settings'

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

  type CommonState = {
    selectedTabKey: SelectedTabKey
  }

  type CollectionState = {
    notionIntegrationToken: string
    notionDatabaseId: string
    notionKeyPropertyName: string
    collectionName: string
    languages: string[]
  }

  type ListState = {
    filterString: string
    sortValue: SortValue
    sortOrder: SortOrder
    selectedListItemId: string | null
    displayModeId: string | null
    scrollPosition: number
  }

  type UtilitiesState = {
    targetCollection:
      | 'all'
      | LocalVariableCollectionForUI
      | LibraryVariableCollection
    targetTextRange: TargetTextRange
    isIncludeComponents: boolean
    isIncludeInstances: boolean
    includeKeyPropertyName: string
  }

  type SettingsState = {
    pluginLanguage: PluginLanguage
  }

  type NotionTitle = {
    type: 'title'
    title: { plain_text: string }[]
  }

  type NotionFomula = {
    type: 'formula'
    formula: {
      string: string
    }
  }

  type NotionRichText = {
    type: 'rich_text'
    rich_text: { plain_text: string }[]
  }

  type NotionPage = {
    object: 'page'
    id: string
    properties: {
      [key: string]: NotionTitle | NotionFomula | NotionRichText
    }
    created_time: string
    last_edited_time: string
    url: string
  }
}

export {}
