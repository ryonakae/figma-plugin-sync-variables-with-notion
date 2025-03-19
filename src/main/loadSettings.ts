import {
  DEFAULT_CLIENT_STORSGE_SETTINGS,
  DEFAULT_DOCUMENT_SETTINGS,
  SETTINGS_KEY,
} from '@/constants'
import { emit, loadSettingsAsync } from '@create-figma-plugin/utilities'

export default async function loadSettings() {
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
    DEFAULT_CLIENT_STORSGE_SETTINGS,
    SETTINGS_KEY,
  )
  console.log('clientStorageSettings', clientStorageSettings)

  // documentSettingsとclientStorageSettingsをマージ
  const settings: Settings = { ...documentSettings, ...clientStorageSettings }

  // uiにsettingsを送る
  emit<LoadSettingsFromMain>('LOAD_SETTINGS_FROM_MAIN', settings)

  console.log('loadSettings: done', settings)
}
