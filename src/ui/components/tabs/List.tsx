/** @jsx h */
import { Fragment, h } from 'preact'

import {
  Container,
  Divider,
  Stack,
  VerticalSpace,
} from '@create-figma-plugin/ui'
import { useMount, useUnmount, useUpdateEffect } from 'react-use'

import Empty from '@/ui/components/Empty'
import ListDisplayModeDropdown from '@/ui/components/ListDisplayModeDropdown'
import ListTargetCollectionDropdown from '@/ui/components/ListTargetCollectionDropdown'
import TabItem from '@/ui/components/TabItem'
import VariableList from '@/ui/components/VariableList'
import useCollection from '@/ui/hooks/useCollection'
import useSettings from '@/ui/hooks/useSettings'
import { useEffect, useState } from 'preact/hooks'

export default function List() {
  const { settings, tmpSettings, updateSettings, updateTmpSettings } =
    useSettings()
  const {
    getCollections,
    isLocalVariableCollection,
    getLocalVariables,
    getLibraryVariables,
  } = useCollection()
  const [variables, setVariables] = useState<VariableForUI[]>([])

  async function updateVariables(
    targetCollection: LocalVariableCollectionForUI | LibraryVariableCollection,
  ) {
    console.log('updateVariables', targetCollection)

    // いったんvariableを空にする
    setVariables([])

    let newVariables: VariableForUI[] = []

    if (isLocalVariableCollection(targetCollection)) {
      newVariables = await getLocalVariables(targetCollection)
    } else {
      newVariables = await getLibraryVariables(targetCollection)
    }

    // newVariablesを、resolvedTypeがstringのものだけに絞り込む
    newVariables = newVariables.filter(
      variable => variable.resolvedType === 'STRING',
    )

    console.log('newVariables', newVariables, newVariables.length)

    setVariables(newVariables)
  }

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

  useEffect(() => {
    if (!settings.listTargetCollection) return
    updateVariables(settings.listTargetCollection)
  }, [settings.listTargetCollection])

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
      <div className="h-[450px]">
        {!settings.listTargetCollection ? (
          <Empty>Please select the collection</Empty>
        ) : (
          <Fragment>
            {variables.length > 0 ? (
              <VariableList variables={variables} />
            ) : (
              <Empty>No string variables available</Empty>
            )}
          </Fragment>
        )}
      </div>
    </TabItem>
  )
}
