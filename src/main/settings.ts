import {
  DEFAULT_CLIENT_STORAGE_SETTINGS,
  DEFAULT_DOCUMENT_SETTINGS,
  SETTINGS_KEY,
} from '@/constants'
import {
  emit,
  loadSettingsAsync,
  saveSettingsAsync,
} from '@create-figma-plugin/utilities'

export async function saveSettings(settings: Settings) {
  console.log('saveSettings: start', settings)

  const newDocumentSettings: DocumentSettings = {
    notionIntegrationToken: settings.notionIntegrationToken,
    notionDatabaseId: settings.notionDatabaseId,
    notionKeyPropertyName: settings.notionKeyPropertyName,
    notionValuePropertyNames: settings.notionValuePropertyNames,
    figmaCollectionName: settings.figmaCollectionName,
  }
  const newClientStorageSettings: ClientStorageSettings = {
    listTargetCollection: settings.listTargetCollection,
    selectedTab: settings.selectedTab,
    listFilterString: settings.listFilterString,
    listSelectedListItems: settings.listSelectedListItems,
    listDisplayModeId: settings.listDisplayModeId,
    listScrollPositions: settings.listScrollPositions,
    utilitiesTargetCollection: settings.utilitiesTargetCollection,
    utilitiesTargetTextRange: settings.utilitiesTargetTextRange,
    utilitiesIsIncludeComponents: settings.utilitiesIsIncludeComponents,
    utilitiesIsIncludeInstances: settings.utilitiesIsIncludeInstances,
    utilitiesIncludeKeyPropertyName: settings.utilitiesIncludeKeyPropertyName,
  }

  // newDocumentSettingsをDocumentに保存
  figma.root.setPluginData(SETTINGS_KEY, JSON.stringify(newDocumentSettings))

  // newClientStorageSettingsをclientStorageに保存
  await saveSettingsAsync<ClientStorageSettings>(
    newClientStorageSettings,
    SETTINGS_KEY,
  )

  console.log('saveSettings: done')
}

export async function loadSettings() {
  console.log('loadSettings: start')

  // documentSettingsを取得
  let documentSettings: DocumentSettings = DEFAULT_DOCUMENT_SETTINGS
  const pluginData = figma.root.getPluginData(SETTINGS_KEY)
  if (pluginData) {
    documentSettings = JSON.parse(pluginData)
  }
  console.log('documentSettings', documentSettings)

  // clientStorageSettingsを取得
  const clientStorageSettings = await loadSettingsAsync<ClientStorageSettings>(
    DEFAULT_CLIENT_STORAGE_SETTINGS,
    SETTINGS_KEY,
  )
  console.log('clientStorageSettings', clientStorageSettings)

  // documentSettingsとclientStorageSettingsをマージ
  const settings: Settings = { ...documentSettings, ...clientStorageSettings }

  // uiにsettingsを送る
  emit<LoadSettingsFromMain>('LOAD_SETTINGS_FROM_MAIN', settings)

  console.log('loadSettings: done', settings)
}
