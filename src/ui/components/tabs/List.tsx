/** @jsx h */
import { Fragment, h } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import {
  Button,
  Container,
  Divider,
  Modal,
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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  async function updateVariables(
    targetCollection: VariableCollectionForUI | LibraryVariableCollection,
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

  function handleDetailsClick() {
    setIsDetailsOpen(true)
  }

  function handleDetailsCloseClick() {
    setIsDetailsOpen(false)
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
                    <div>Loading...</div>
                  ) : (
                    <Fragment>
                      <div className="flex gap-1 text-text-secondary">
                        <span>This library collection is cached.</span>
                        <button
                          type="button"
                          className="text-text-link"
                          onClick={handleDetailsClick}
                        >
                          Details
                        </button>

                        <Modal
                          title="About caching"
                          open={isDetailsOpen}
                          onCloseButtonClick={handleDetailsCloseClick}
                          onOverlayClick={handleDetailsCloseClick}
                          onEscapeKeyDown={handleDetailsCloseClick}
                        >
                          <div className="flex w-64 flex-col gap-2 p-4">
                            <p>
                              When the target collection is a library
                              collection, this plugin caches the collection in
                              Client Storage.
                            </p>
                            <p>
                              This is because retrieving library collections
                              with a large number of variables can take a
                              significant amount of time. Additionally, there's
                              a possibility of hitting Figma's API limitations.
                            </p>
                            <p>
                              Clicking the Refresh button will clear the cache
                              and re-fetch the variables.
                            </p>
                          </div>
                        </Modal>
                      </div>

                      <Button secondary onClick={handleRefreshClick}>
                        Refresh
                      </Button>
                    </Fragment>
                  )}
                </div>
              )}
          </FormItem>

          <FormItem title="Display mode">
            <ListDisplayModeDropdown />
          </FormItem>
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
