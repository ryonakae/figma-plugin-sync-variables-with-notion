/** @jsx h */
import { type JSX, h } from 'preact'
import { useRef, useState } from 'preact/hooks'

import { Button, Stack, Textbox, VerticalSpace } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { useMount, useUnmount } from 'react-use'

import TabItem from '@/ui/components/TabItem'
import useNotion from '@/ui/hooks/useNotion'
import useSettings from '@/ui/hooks/useSettings'

export default function Collection() {
  const { settings, tmpSettings, updateSettings } = useSettings()
  const { fetchNotion } = useNotion({
    databaseId: settings.notionDatabaseId,
    integrationToken: settings.notionIntegrationToken,
    keyPropertyName: settings.notionKeyPropertyName,
    valuePropertyNames: ['ja', 'en'],
    collectionName: settings.collectionName,
  })
  const [isFetching, setIsFetching] = useState(false)
  const keyValuesRef = useRef<NotionKeyValue[]>([])

  function handleInput(key: keyof Settings) {
    return (event: JSX.TargetedEvent<HTMLInputElement>) => {
      updateSettings({
        [key]: event.currentTarget.value,
      })
    }
  }

  async function handleCreateClick() {
    setIsFetching(true)

    emit<NotifyFromUI>('NOTIFY_FROM_UI', {
      message: 'Please wait a moment.',
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
      setIsFetching(false)
      throw new Error(error.message)
    })

    console.log('fetch done', keyValuesRef.current)

    setIsFetching(false)

    emit<NotifyFromUI>('NOTIFY_FROM_UI', {
      message: 'Create/Update collection done.',
    })
  }

  useMount(() => {
    console.log('Collection: mounted')
    console.log(process.env.PROXY_URL)
  })

  useUnmount(() => {
    console.log('Collection: unmounted')
  })

  return (
    <TabItem>
      <Stack space="small">
        <div className="flex flex-col gap-1">
          <div>Database ID</div>
          <Textbox
            onInput={handleInput('notionDatabaseId')}
            value={settings.notionDatabaseId}
            disabled={tmpSettings.loading}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div>Integration token</div>
          <Textbox
            onInput={handleInput('notionIntegrationToken')}
            value={settings.notionIntegrationToken}
            disabled={tmpSettings.loading}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div>Key property name</div>
          <Textbox
            onInput={handleInput('notionKeyPropertyName')}
            value={settings.notionKeyPropertyName}
            disabled={tmpSettings.loading}
          />
        </div>
      </Stack>

      <VerticalSpace space="large" />

      <Button
        fullWidth
        onClick={handleCreateClick}
        disabled={
          !settings.notionDatabaseId ||
          !settings.notionIntegrationToken ||
          !settings.notionKeyPropertyName ||
          isFetching
        }
        loading={isFetching}
      >
        Create/Update variable collection from Notion database
      </Button>
    </TabItem>
  )
}
