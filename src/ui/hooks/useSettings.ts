import { emit } from '@create-figma-plugin/utilities'

import { useSettingsStore, useTmpSettingsStore } from '@/ui/store'

/**
 * 設定の取得と更新を行うカスタムフック
 * 永続的な設定と一時的な設定の両方を管理
 */
export default function useSettings() {
  const settings = useSettingsStore()
  const tmpSettings = useTmpSettingsStore()

  /**
   * 永続的な設定を更新する関数
   * storeに保存し、mainスレッドに送信
   * @param newSettings 更新する設定のオブジェクト
   */
  function updateSettings(
    newSettings: { [T in keyof Settings]?: Settings[T] },
  ) {
    const currentSettings = useSettingsStore.getState()
    console.log('[useSettings] updateSettings', {
      ...currentSettings,
      ...newSettings,
    })

    // storeに保存
    useSettingsStore.setState({ ...currentSettings, ...newSettings })

    // mainに送る
    emit<SaveSettingsFromUI>('SAVE_SETTINGS_FROM_UI', {
      ...currentSettings,
      ...newSettings,
    })
  }

  /**
   * 一時的な設定を更新する関数
   * storeに保存するのみで、mainスレッドには送信しません
   * @param newSettings 更新する一時的な設定のオブジェクト
   */
  function updateTmpSettings(
    newSettings: { [T in keyof TmpSettings]?: TmpSettings[T] },
  ) {
    const currentSettings = useTmpSettingsStore.getState()
    console.log('[useSettings] updateTmpSettings', {
      ...currentSettings,
      ...newSettings,
    })
    useTmpSettingsStore.setState({ ...currentSettings, ...newSettings })
  }

  return { settings, tmpSettings, updateSettings, updateTmpSettings }
}
