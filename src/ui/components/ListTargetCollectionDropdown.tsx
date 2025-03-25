/** @jsx h */
import { Fragment, type JSX, h } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import { Dropdown, Textbox } from '@create-figma-plugin/ui'

import useSettings from '@/ui/hooks/useSettings'

export default function ListTargetCollectionDropdown() {
  const { settings, tmpSettings, updateSettings, updateTmpSettings } =
    useSettings()
  const [isDropdownReady, setIsDropdownReady] = useState(false)
  const [dropdownOptions, setDropdownOptions] = useState<
    ListTargetCollectionDropdownOption[]
  >([])

  async function handleDropdownChange(
    event: JSX.TargetedEvent<HTMLInputElement>,
  ) {
    const newValue = event.currentTarget.value as string | null
    console.log('handleDropdownChange', newValue)

    if (newValue === null) {
      // 選択値がnullの場合、targetCollectionをnullに設定
      updateSettings({
        listTargetCollection: null,
      })
    }

    // 選択肢がローカルコレクションの場合、localCollectionsから新しいtargetCollectionを見つける
    else if (newValue.startsWith('VariableCollectionId:')) {
      const newTargetCollection = tmpSettings.localCollections.find(
        collection => collection.id === newValue,
      )

      // 新しいtargetCollectionが見つかった場合、設定を更新
      if (newTargetCollection) {
        updateSettings({
          listTargetCollection: newTargetCollection,
        })
      }
    }

    // 選択肢がライブラリコレクションの場合（valueがkeyになっている場合）、
    // libraryCollectionsから新しいtargetCollectionを見つける
    else {
      const newTargetCollection = tmpSettings.libraryCollections.find(
        collection => collection.key === newValue,
      )
      // 新しいtargetCollectionが見つかった場合、設定を更新
      if (newTargetCollection) {
        updateSettings({
          listTargetCollection: newTargetCollection,
        })
      }
    }
  }

  async function updateDropdownOptions(options: {
    localCollections: LocalVariableCollectionForUI[]
    libraryCollections: LibraryVariableCollection[]
  }) {
    console.log('updateDropdownOptions', options)

    // dropdownOptionsを新しく作成
    let newDropdownOptions: ListTargetCollectionDropdownOption[] = [
      {
        header: 'Local Collections',
      },
      ...options.localCollections.map(collection => ({
        text: collection.name,
        value: collection.id,
      })),
    ]

    if (options.libraryCollections.length > 0) {
      // libraryCollectionsが1つ以上ある場合、libraryCollectionsを配列に追加
      newDropdownOptions = [
        ...newDropdownOptions,
        '-',
        {
          header: 'Library Collections',
        },
        ...options.libraryCollections.map(collection => ({
          text: collection.name,
          value: collection.key,
        })),
      ]
    }

    console.log('newDropdownOptions', newDropdownOptions)

    // targetCollectionがdropdownOptionsに存在しない場合、listTargetCollectionをnullに設定する
    const targetCollectionExist = newDropdownOptions.some(option => {
      if (typeof option === 'object' && 'value' in option) {
        const targetCollectionValue =
          settings.listTargetCollection === null
            ? null
            : 'id' in settings.listTargetCollection
              ? settings.listTargetCollection.id
              : settings.listTargetCollection.key
        return option.value === targetCollectionValue
      }
      return false
    })
    if (!targetCollectionExist) {
      updateSettings({
        listTargetCollection: null,
      })
    }

    // 新しいdropdownOptionsをstateに入れて、Dropdownコンポーネントをマウントする
    setDropdownOptions(newDropdownOptions)
    setIsDropdownReady(true)
  }

  // localCollectionとlibraryCollectionが変更されるたびにupdateDropdownOptionsを実行する
  useEffect(() => {
    updateDropdownOptions({
      localCollections: tmpSettings.localCollections,
      libraryCollections: tmpSettings.libraryCollections,
    })
  }, [tmpSettings.localCollections, tmpSettings.libraryCollections])

  return (
    <Fragment>
      {isDropdownReady ? (
        <Dropdown
          onChange={handleDropdownChange}
          options={dropdownOptions}
          value={
            settings.listTargetCollection === null
              ? null
              : 'id' in settings.listTargetCollection
                ? settings.listTargetCollection.id
                : settings.listTargetCollection.key
          }
        />
      ) : (
        <Textbox disabled value="No collection in this document" />
      )}
    </Fragment>
  )
}
