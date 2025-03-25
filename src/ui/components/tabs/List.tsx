/** @jsx h */
import { h } from 'preact'

import {
  Container,
  Divider,
  Stack,
  VerticalSpace,
} from '@create-figma-plugin/ui'
import { useMount, useUnmount } from 'react-use'

import ListTargetCollectionDropdown from '@/ui/components/ListTargetCollectionDropdown'
import TabItem from '@/ui/components/TabItem'
import useSettings from '@/ui/hooks/useSettings'

export default function List() {
  const { settings, tmpSettings, updateSettings, updateTmpSettings } =
    useSettings()

  useMount(async () => {
    console.log('List: mounted')
  })

  useUnmount(() => {
    console.log('List: unmounted')
  })

  return (
    <TabItem space="none">
      {/* top */}
      <Container space="medium">
        <VerticalSpace space="medium" />

        <Stack space="small">
          <div className="flex flex-col gap-1">
            <div>参照するコレクション</div>

            <ListTargetCollectionDropdown />
          </div>
        </Stack>

        <VerticalSpace space="medium" />
      </Container>

      <Divider />

      {/* list */}
      <div>list</div>
    </TabItem>
  )
}
