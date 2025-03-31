/** @jsx h */
import { Fragment, type JSX, h } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import { Dropdown, type DropdownOption, Textbox } from '@create-figma-plugin/ui'

import useSettings from '@/ui/hooks/useSettings'

export default function UtilitiesTargetCollectionDropdown() {
  const { settings, tmpSettings, updateSettings } = useSettings()
  const [isDropdownReady, setIsDropdownReady] = useState(false)
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>([])

  async function handleChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    console.log('handleChange', newValue)

    // 選択値がallの場合、targetCollectionをallに設定
    if (newValue === 'all') {
      updateSettings({
        utilitiesTargetCollection: 'all',
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
          utilitiesTargetCollection: newTargetCollection,
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
          utilitiesTargetCollection: newTargetCollection,
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
    let newDropdownOptions: DropdownOption[] = [
      {
        text: 'All',
        value: 'all',
      },
      '-',
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

    // targetCollectionがdropdownOptionsに存在しない場合、utilitiesTargetCollectionをallに設定する
    const targetCollectionExist = newDropdownOptions.some(option => {
      if (typeof option === 'object' && 'value' in option) {
        const targetCollectionValue =
          settings.utilitiesTargetCollection === 'all'
            ? 'all'
            : 'id' in settings.utilitiesTargetCollection
              ? settings.utilitiesTargetCollection.id
              : settings.utilitiesTargetCollection.key
        return option.value === targetCollectionValue
      }
      return false
    })
    if (!targetCollectionExist) {
      updateSettings({
        utilitiesTargetCollection: 'all',
      })
    }

    // 新しいdropdownOptionsをstateに入れて、Dropdownコンポーネントをマウントする
    setDropdownOptions(newDropdownOptions)

    window.requestAnimationFrame(() => {
      setIsDropdownReady(true)
    })
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
          onChange={handleChange}
          options={dropdownOptions}
          value={
            settings.utilitiesTargetCollection === 'all'
              ? 'all'
              : 'id' in settings.utilitiesTargetCollection
                ? settings.utilitiesTargetCollection.id
                : settings.utilitiesTargetCollection.key
          }
        />
      ) : (
        <Textbox disabled value="No collection in this document" />
      )}
    </Fragment>
  )
}
