/** @jsx h */
import { type JSX, h } from 'preact'

import { useMount, useUnmount } from 'react-use'

import TabItem from '@/ui/components/TabItem'
import useSettings from '@/ui/hooks/useSettings'
import { Stack, Textbox } from '@create-figma-plugin/ui'

export default function Collection() {
  const { settings, tmpSettings, updateSettings } = useSettings()

  function handleInput(key: keyof Settings) {
    return (event: JSX.TargetedEvent<HTMLInputElement>) => {
      updateSettings({
        [key]: event.currentTarget.value,
      })
    }
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
    </TabItem>
  )
}
