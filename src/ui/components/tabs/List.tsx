/** @jsx h */
import { Fragment, h } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import {
  Button,
  Container,
  Divider,
  Stack,
  VerticalSpace,
} from '@create-figma-plugin/ui'
import { useMount, useUnmount } from 'react-use'

import Empty from '@/ui/components/Empty'
import FormItem from '@/ui/components/FormItem'
import ListDisplayModeDropdown from '@/ui/components/ListDisplayModeDropdown'
import TabItem from '@/ui/components/TabItem'
import TargetCollectionDropdown from '@/ui/components/TargetCollectionDropdown'
import VariableList from '@/ui/components/VariableList'
import useCollection from '@/ui/hooks/useCollection'
import useSettings from '@/ui/hooks/useSettings'

export default function List() {
  const { settings, tmpSettings, updateTmpSettings } = useSettings()
  const {
    isLocalCollection,
    isLibraryCollection,
    getLocalVariables,
    getLibraryVariables,
    clearCache,
  } = useCollection()
  const [variables, setVariables] = useState<VariableForUI[]>([])

  async function updateVariables(
    targetCollection: LocalVariableCollectionForUI | LibraryVariableCollection,
  ) {
    console.log('updateVariables', targetCollection)

    updateTmpSettings({
      loadingVariables: true,
    })

    // いったんvariableを空にする
    setVariables([])

    let newVariables: VariableForUI[] = []

    if (isLocalCollection(targetCollection)) {
      newVariables = await getLocalVariables(targetCollection)
    } else {
      newVariables = await getLibraryVariables(targetCollection)
    }

    // newVariablesを、resolvedTypeがstringのもの &
    // scopeにTEXT_CONTENTが含まれるのものだけに絞り込む
    newVariables = newVariables.filter(
      variable =>
        variable.resolvedType === 'STRING' &&
        (variable.scopes.includes('ALL_SCOPES') ||
          variable.scopes.includes('TEXT_CONTENT')),
    )

    console.log('newVariables', newVariables, newVariables.length)

    setVariables(newVariables)

    updateTmpSettings({
      loadingVariables: false,
    })
  }

  function handleRefreshClick() {
    const targetCollection = settings.listTargetCollection

    if (!targetCollection || !isLibraryCollection(targetCollection)) {
      return
    }

    clearCache(targetCollection.key)

    setTimeout(() => {
      updateVariables(targetCollection)
    }, 100)
  }

  useMount(async () => {
    console.log('List: mounted')
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
          <FormItem title="Target collection">
            <TargetCollectionDropdown
              settingKey="listTargetCollection"
              value={settings.listTargetCollection}
              defaultValue={null}
            />

            {settings.listTargetCollection &&
              isLibraryCollection(settings.listTargetCollection) && (
                <div className="flex h-6 items-center justify-between">
                  {tmpSettings.loadingVariables ? (
                    <div>Updating...</div>
                  ) : (
                    <Fragment>
                      <div className="text-text-secondary">
                        This collection is cached.
                      </div>

                      <Button secondary onClick={handleRefreshClick}>
                        Refresh
                      </Button>
                    </Fragment>
                  )}
                </div>
              )}
          </FormItem>

          {settings.listTargetCollection && (
            <FormItem title="Display mode">
              <ListDisplayModeDropdown />
            </FormItem>
          )}
        </Stack>

        <VerticalSpace space="medium" />
      </Container>

      <Divider />

      {/* list */}
      <div className="h-[450px]">
        {!settings.listTargetCollection ? (
          <Empty className="p-4">
            <div>Please select the collection</div>
            <div>
              Initial loading might be slow for library collections with too
              many variables.
            </div>
          </Empty>
        ) : tmpSettings.loadingVariables ? (
          <Empty>Loading variables...</Empty>
        ) : variables.length === 0 ? (
          <Empty>No string variables available</Empty>
        ) : (
          <VariableList variables={variables} />
        )}
      </div>
    </TabItem>
  )
}
