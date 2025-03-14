import { emit } from '@create-figma-plugin/utilities'

import { useSettingsStore, useTmpSettingsStore } from '@/store'

export default function useSettings() {
  function updateSettings(
    newSettings: { [T in keyof Settings]?: Settings[T] },
  ) {
    const currentSettings = useSettingsStore.getState()

    console.log('updateSettings', { ...currentSettings, ...newSettings })

    // storeに保存
    useSettingsStore.setState({ ...currentSettings, ...newSettings })

    // mainに送る
    emit<SaveSettingsFromUI>('SAVE_SETTINGS_FROM_UI', {
      ...currentSettings,
      ...newSettings,
    })
  }

  function updateTmpSettings(
    newSettings: { [T in keyof TmpSettings]?: TmpSettings[T] },
  ) {
    const currentSettings = useTmpSettingsStore.getState()
    console.log('updateTmpSettings', { ...currentSettings, ...newSettings })
    useTmpSettingsStore.setState({ ...currentSettings, ...newSettings })
  }

  return { updateSettings, updateTmpSettings }
}
