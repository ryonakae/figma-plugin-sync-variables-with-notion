/** @jsx h */
import { h } from 'preact'

import { Stack } from '@create-figma-plugin/ui'
import { useMount, useUnmount } from 'react-use'

import TabItem from '@/ui/components/TabItem'
import TargetCollectionDropdown from '@/ui/components/TargetCollectionDropdown'
import useSettings from '@/ui/hooks/useSettings'

export default function Utilities() {
  const { settings } = useSettings()

  useMount(async () => {
    console.log('Utilities: mounted')
  })

  useUnmount(() => {
    console.log('Utilities: unmounted')
  })

  return (
    <TabItem>
      <Stack space="small">
        <div className="flex flex-col gap-1">
          <div>Target collection</div>
          <TargetCollectionDropdown
            settingKey="utilitiesTargetCollection"
            value={settings.utilitiesTargetCollection}
            initialOption={{
              text: 'All',
              value: 'all',
            }}
            defaultValue="all"
          />
        </div>

        <div className="h-[300px] bg-gray-100" />
      </Stack>
    </TabItem>
  )
}
