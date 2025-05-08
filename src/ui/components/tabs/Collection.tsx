/** @jsx h */
/**
 * コレクション同期設定タブのコンポーネント
 * NotionデータベースとFigmaコレクションの設定と同期を行う
 */
import { type JSX, h } from 'preact'
import { useRef } from 'preact/hooks'

import {
  Button,
  Stack,
  Textbox,
  TextboxAutocomplete,
  VerticalSpace,
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { useMount, useUnmount } from 'react-use'

import CollectionModesList from '@/ui/components/CollectionModesList'
import FormItem from '@/ui/components/FormItem'
import TabItem from '@/ui/components/TabItem'
import useNotion from '@/ui/hooks/useNotion'
import useSettings from '@/ui/hooks/useSettings'

/**
 * コレクション同期タブのメインコンポーネント
 * Notion設定フォームと同期ボタンを提供
 */
export default function Collection() {
  const { settings, tmpSettings, updateSettings, updateTmpSettings } =
    useSettings()
  const { fetchNotion } = useNotion({
    databaseId: settings.notionDatabaseId,
    integrationToken: settings.notionIntegrationToken,
    keyPropertyName: settings.notionKeyPropertyName,
    valuePropertyNames: settings.notionValuePropertyNames,
    figmaCollectionName: settings.figmaCollectionName,
  })
  const keyValuesRef = useRef<NotionKeyValue[]>([])

  /**
   * 設定フィールドの入力ハンドラ
   * @param key 更新する設定のキー
   * @returns イベントハンドラ関数
   */
  function handleInput(key: keyof Settings) {
    return (event: JSX.TargetedEvent<HTMLInputElement>) => {
      updateSettings({
        [key]: event.currentTarget.value,
      })
    }
  }

  /**
   * モード選択変更時のハンドラ
   * @param modes 選択されたモード配列
   */
  function handleModesChange(modes: string[]) {
    updateSettings({
      notionValuePropertyNames: modes,
    })
  }

  /**
   * 同期ボタンクリック時のハンドラ
   * Notionからデータを取得し、Figmaコレクションに同期
   */
  async function handleSyncClick() {
    updateTmpSettings({
      loading: true,
    })

    emit<NotifyFromUI>('NOTIFY_FROM_UI', {
      message: 'Syncing...',
    })

    // keyValuesRefをクリア
    keyValuesRef.current = []

    await fetchNotion({
      keyValuesArray: keyValuesRef.current,
    }).catch((error: Error) => {
      emit<NotifyFromUI>('NOTIFY_FROM_UI', {
        message: error.message,
        options: {
          error: true,
        },
      })
      updateTmpSettings({
        loading: false,
      })
      throw new Error(error.message)
    })

    console.log('fetch done', keyValuesRef.current)

    emit<SyncCollectionFromUI>('SYNC_COLLECTION_FROM_UI', {
      collectionName: settings.figmaCollectionName,
      notionKeyValues: keyValuesRef.current,
      notionValuePropertyNames: settings.notionValuePropertyNames,
    })
  }

  useMount(async () => {
    console.log('Collection: mounted')
    console.log(process.env.PROXY_URL)
  })

  useUnmount(() => {
    console.log('Collection: unmounted')
  })

  return (
    <TabItem>
      <Stack space="small">
        <div className="font-bold">Notion settings</div>

        <FormItem title="Database ID">
          <Textbox
            onInput={handleInput('notionDatabaseId')}
            value={settings.notionDatabaseId}
            disabled={tmpSettings.loading}
          />
        </FormItem>

        <FormItem title="Integration token">
          <Textbox
            onInput={handleInput('notionIntegrationToken')}
            value={settings.notionIntegrationToken}
            disabled={tmpSettings.loading}
          />
        </FormItem>

        <FormItem title="Key property name">
          <Textbox
            onInput={handleInput('notionKeyPropertyName')}
            value={settings.notionKeyPropertyName}
            disabled={tmpSettings.loading}
          />
        </FormItem>
      </Stack>

      <VerticalSpace space="large" />

      <Stack space="small">
        <div className="font-bold">Figma variable collection settings</div>

        <FormItem title="Collection name to create or update">
          <TextboxAutocomplete
            filter
            onInput={handleInput('figmaCollectionName')}
            value={settings.figmaCollectionName}
            options={tmpSettings.localCollections.map(collection => ({
              value: collection.name,
            }))}
            disabled={tmpSettings.loading}
          />
        </FormItem>

        <FormItem
          title="Add or reorder modes"
          description="Add and reorder language modes. Specify property names for each language in Notion (e.g., 'ja', 'en')."
        >
          <CollectionModesList
            values={settings.notionValuePropertyNames}
            onChange={handleModesChange}
          />
        </FormItem>
      </Stack>

      <VerticalSpace space="large" />

      <Button
        fullWidth
        onClick={handleSyncClick}
        disabled={
          !settings.notionDatabaseId ||
          !settings.notionIntegrationToken ||
          !settings.notionKeyPropertyName ||
          !settings.figmaCollectionName ||
          !settings.notionValuePropertyNames.length ||
          tmpSettings.loading
        }
        loading={tmpSettings.loading}
        className="!h-8"
      >
        Sync variable collection with Notion
      </Button>
    </TabItem>
  )
}
