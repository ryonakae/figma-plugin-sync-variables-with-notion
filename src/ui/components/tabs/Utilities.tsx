/** @jsx h */
import { h } from 'preact'

import { Stack } from '@create-figma-plugin/ui'
import { useMount, useUnmount } from 'react-use'

import TabItem from '@/ui/components/TabItem'
import UtilitiesTargetCollectionDropdown from '@/ui/components/UtilitiesTargetCollectionDropdown'

export default function Utilities() {
  useMount(() => {
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
          <UtilitiesTargetCollectionDropdown />
        </div>
      </Stack>
    </TabItem>
  )
}
