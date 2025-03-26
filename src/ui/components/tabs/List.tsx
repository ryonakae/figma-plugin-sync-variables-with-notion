/** @jsx h */
import { h } from 'preact'

import {
  Container,
  Divider,
  Stack,
  VerticalSpace,
} from '@create-figma-plugin/ui'
import { useMount, useUnmount } from 'react-use'

import ListDisplayModeDropdown from '@/ui/components/ListDisplayModeDropdown'
import ListTargetCollectionDropdown from '@/ui/components/ListTargetCollectionDropdown'
import TabItem from '@/ui/components/TabItem'
import useCollection from '@/ui/hooks/useCollection'
import useSettings from '@/ui/hooks/useSettings'

export default function List() {
  const { settings, tmpSettings, updateSettings, updateTmpSettings } =
    useSettings()
  const { getCollections } = useCollection()

  useMount(async () => {
    console.log('List: mounted')

    // コレクションを取得してtmpSettingsに追加
    const collections = await getCollections()
    updateTmpSettings({
      localCollections: collections.localCollections,
      libraryCollections: collections.libraryCollections,
    })
  })

  useUnmount(() => {
    console.log('List: unmounted')
  })

  if (
    !tmpSettings.localCollections.length &&
    !tmpSettings.libraryCollections.length
  ) {
    return (
      <div className="flex h-60 items-center justify-center">
        <div className="text-text-secondary">
          No collection in this document
        </div>
      </div>
    )
  }

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

          {settings.listTargetCollection && (
            <div className="flex flex-col gap-1">
              <div>表示するモード</div>

              <ListDisplayModeDropdown />
            </div>
          )}
        </Stack>

        <VerticalSpace space="medium" />
      </Container>

      <Divider />

      {/* list */}
      <div>list</div>
    </TabItem>
  )
}
