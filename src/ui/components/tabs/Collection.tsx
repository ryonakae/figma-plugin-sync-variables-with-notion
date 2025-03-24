/** @jsx h */
import { type JSX, h } from 'preact'
import { useRef, useState } from 'preact/hooks'

import { Button, Stack, Textbox, VerticalSpace } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { useMount, useUnmount } from 'react-use'

import CollectionModesList from '@/ui/components/CollectionModesList'
import TabItem from '@/ui/components/TabItem'
import useNotion from '@/ui/hooks/useNotion'
import useSettings from '@/ui/hooks/useSettings'

export default function Collection() {
  const { settings, tmpSettings, updateSettings } = useSettings()
  const { fetchNotion } = useNotion({
    databaseId: settings.notionDatabaseId,
    integrationToken: settings.notionIntegrationToken,
    keyPropertyName: settings.notionKeyPropertyName,
    valuePropertyNames: settings.notionValuePropertyNames,
    figmaCollectionName: settings.figmaCollectionName,
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

  function handleModesChange(modes: string[]) {
    updateSettings({
      notionValuePropertyNames: modes,
    })
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
        <div className="font-bold">Notion settings</div>

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

      <Stack space="small">
        <div className="font-bold">Figma variable collection settings</div>

        <div className="flex flex-col gap-1">
          <div>Collection name to create or update</div>
          <Textbox
            onInput={handleInput('figmaCollectionName')}
            value={settings.figmaCollectionName}
            disabled={tmpSettings.loading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div>Add or reorder modes</div>

          <CollectionModesList
            values={settings.notionValuePropertyNames}
            onChange={handleModesChange}
          />

          <p className="text-text-secondary">
            Set the language to be added as a mode. Please add and reorder the
            property names corresponding to each language in Notion (e.g., ja,
            en).
          </p>
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
          !settings.figmaCollectionName ||
          !settings.notionValuePropertyNames.length ||
          isFetching
        }
        loading={isFetching}
      >
        Create or update variable collection from Notion database
      </Button>
    </TabItem>
  )
}
