/** @jsx h */
import { h } from 'preact'
import { useState } from 'preact/hooks'

import { emit, on, once } from '@create-figma-plugin/utilities'
import { useMount, useUpdateEffect } from 'react-use'

import { useSettingsStore } from '@/store'
import useResizeWindow from '@/ui/hooks/useResizeWindow'
import useSettings from '@/ui/hooks/useStore'

export default function App() {
  const settings = useSettingsStore()
  const { updateSettings, updateTmpSettings } = useSettings()
  const { resizeWindow } = useResizeWindow()
  const [settingsLoaded, setSettingsLoaded] = useState(false)

  useMount(() => {
    once<LoadSettingsFromMain>(
      'LOAD_SETTINGS_FROM_MAIN',
      (settings: Settings) => {
        updateSettings(settings)
        setSettingsLoaded(true)
      },
    )

    on<ProcessFinishFromMain>('PROCESS_FINISH_FROM_MAIN', options => {
      updateTmpSettings({
        loading: false,
      })

      emit<NotifyFromUI>('NOTIFY_FROM_UI', {
        message: options.message,
      })
    })
  })

  // 設定値が変更されたときにウインドウの高さを変更する
  // タブ切り替え時のリサイズは、各タブのuseMountで実行
  useUpdateEffect(() => {
    window.requestAnimationFrame(resizeWindow)
  }, [settings.collectionName, settings.languages])

  if (!settingsLoaded) return null

  return (
    <div id="wrapper">
      <h1 className="font-bold text-2xl text-text-primary mt-0.5">
        sync-variables-with-notion
      </h1>
    </div>
  )
}
