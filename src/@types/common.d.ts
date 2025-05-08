/**
 * プラグイン全体で使用する共通の型定義
 * UI表示や設定に関する型を含む
 */
import type { DropdownOptionValue } from '@create-figma-plugin/ui'

declare global {
  /**
   * プラグインのタブ名を表す型
   */
  type SelectedTab = 'Sync collection' | 'List' | 'Utilities'

  /**
   * 並び替え用の値と順序を表す型
   */
  type SortValue = 'key' | 'value' | 'created_time' | 'last_edited_time'
  type SortOrder = 'ascending' | 'descending'

  /**
   * テキスト範囲を表す型（選択範囲、現在のページ、すべてのページ）
   */
  type TargetTextRange = 'selection' | 'currentPage' | 'allPages'

  /**
   * プラグインの言語設定
   */
  type PluginLanguage = 'en' | 'ja'

  /**
   * UI表示用に整形されたVariableCollection型
   */
  type VariableCollectionForUI = {
    id: string
    name: string
    modes: { modeId: string; name: string }[]
  }

  /**
   * UI表示用に整形されたVariable型
   */
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

  /**
   * ドキュメント設定
   * Notionとの同期に関する設定を格納
   */
  type DocumentSettings = {
    // collection
    notionDatabaseId: string
    notionIntegrationToken: string
    notionKeyPropertyName: string
    notionValuePropertyNames: string[]
    figmaCollectionName: string
  }

  /**
   * クライアントストレージ設定
   * UIの状態やユーザー設定を格納
   */
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

  /**
   * 全設定を結合した型
   */
  type Settings = DocumentSettings & ClientStorageSettings

  /**
   * 一時的な設定
   * プラグイン実行中のみ保持される一時的な状態
   */
  type TmpSettings = {
    loading: boolean
    loadingVariables: boolean
    localCollections: VariableCollectionForUI[]
    libraryCollections: LibraryVariableCollection[]
  }

  /**
   * キャッシュ用の型定義
   * ライブラリコレクションのキーと対応する変数の配列を格納
   */
  type ClientStorageCache = {
    [libraryCollectionKey: string]: Variable[]
  }

  /**
   * キャッシュ操作の結果を表す型
   * 成功時はsuccessフラグのみ、失敗時はエラーメッセージを含む
   */
  type SaveCacheResult = { success: true } | { success: false; error: string }

  /**
   * ドロップダウン用の型定義
   */
  type ListTargetCollectionDropdownOptionValue = DropdownOptionValue & {
    value: string | null
  }
  type ListTargetCollectionDropdownOption =
    | DropdownOptionHeader
    | DropdownOptionSeparator
    | ListTargetCollectionDropdownOptionValue
}
