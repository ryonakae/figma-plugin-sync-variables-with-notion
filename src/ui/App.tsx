/** @jsx h */
/**
 * アプリケーションのメインコンポーネント
 * タブ切り替えとイベントハンドリングを統括
 */
import { type JSX, h } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import { Tabs, type TabsOption } from '@create-figma-plugin/ui'
import { emit, on, once } from '@create-figma-plugin/utilities'
import { useMount, useUpdateEffect } from 'react-use'

import Collection from '@/ui/components/tabs/Collection'
import List from '@/ui/components/tabs/List'
import Utilities from '@/ui/components/tabs/Utilities'
import useCollection from '@/ui/hooks/useCollection'
import useResizeWindow from '@/ui/hooks/useResizeWindow'
import useSettings from '@/ui/hooks/useSettings'

import '!./styles/output.css'

export default function App() {
  const { settings, updateSettings, updateTmpSettings } = useSettings()
  const { resizeWindow } = useResizeWindow()
  const { getCollections } = useCollection()
  const [settingsLoaded, setSettingsLoaded] = useState(false)

  const tabOptions: TabsOption[] &
    {
      value: SelectedTab
    }[] = [
    {
      children: <Collection />,
      value: 'Sync collection',
    },
    {
      children: <List />,
      value: 'List',
    },
    {
      children: <Utilities />,
      value: 'Utilities',
    },
  ]

  function tabChangeHandler(event: JSX.TargetedEvent<HTMLInputElement>) {
    updateSettings({
      selectedTab: event.currentTarget.value as Settings['selectedTab'],
    })
  }

  async function handleSelectedTabUpdate() {
    // タブが変更されたらコレクションを取得してtmpSettingsに追加
    const collections = await getCollections()
    updateTmpSettings({
      localCollections: collections.localCollections,
      libraryCollections: collections.libraryCollections,
    })
  }

  useMount(() => {
    // マウントされたらイベント監視を開始
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
        options: options.options,
      })
    })
  })

  // 設定値が変更されたときにウインドウの高さを変更する
  // タブ切り替え時のリサイズは、各タブのuseMountで実行
  useUpdateEffect(() => {
    window.requestAnimationFrame(resizeWindow)
  }, [settings])

  // タブが更新されたらコレクションを取得してtmpSettingsに追加
  useEffect(() => {
    handleSelectedTabUpdate()
  }, [settings.selectedTab])

  if (!settingsLoaded) return null

  return (
    <div id="wrapper">
      <Tabs
        options={tabOptions}
        onChange={tabChangeHandler}
        value={settings.selectedTab}
      />
    </div>
  )
}
