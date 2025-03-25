import { saveSettingsAsync } from '@create-figma-plugin/utilities'

import { SETTINGS_KEY } from '@/constants'

export default async function saveSettings(settings: Settings) {
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
    filterString: settings.filterString,
    selectedListItemId: settings.selectedListItemId,
    displayModeId: settings.displayModeId,
    scrollPosition: settings.scrollPosition,
    targetCollection: settings.targetCollection,
    targetTextRange: settings.targetTextRange,
    isIncludeComponents: settings.isIncludeComponents,
    isIncludeInstances: settings.isIncludeInstances,
    includeKeyPropertyName: settings.includeKeyPropertyName,
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
