/** @jsx h */
import { Fragment, type JSX, h } from 'preact'
import { useState } from 'preact/hooks'

import { Dropdown, type DropdownOption, Textbox } from '@create-figma-plugin/ui'
import { useUpdateEffect } from 'react-use'

import useSettings from '@/ui/hooks/useSettings'

// Propsの型定義
type TargetCollectionDropdownProps = {
  settingKey: 'listTargetCollection' | 'utilitiesTargetCollection' // 更新する設定キー
  value: LocalVariableCollectionForUI | LibraryVariableCollection | 'all' | null // 現在の選択値
  initialOption?: DropdownOption // 先頭に追加する特別なオプション (例: 'All')
  defaultValue: 'all' | null // デフォルト値 (選択肢がない場合など)
}

export default function TargetCollectionDropdown({
  settingKey,
  value,
  initialOption,
  defaultValue,
}: TargetCollectionDropdownProps) {
  const { tmpSettings, updateSettings } = useSettings()
  const [isDropdownReady, setIsDropdownReady] = useState(false) // ドロップダウン準備完了フラグ
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>([]) // ドロップダウンの選択肢

  // ドロップダウンの選択肢を更新する関数
  async function updateDropdownOptions(options: {
    localCollections: LocalVariableCollectionForUI[]
    libraryCollections: LibraryVariableCollection[]
  }) {
    console.log('updateDropdownOptions Base', options, initialOption)

    // 基本となるドロップダウンオプションを初期化
    let newDropdownOptions: DropdownOption[] = []

    // initialOptionが指定されていれば先頭に追加
    if (initialOption) {
      newDropdownOptions.push(initialOption, '-')
    }

    // ローカルコレクションを追加
    newDropdownOptions = [
      ...newDropdownOptions,
      {
        header: 'Local Collections',
      },
      ...options.localCollections.map(collection => ({
        text: collection.name,
        value: collection.id,
      })),
    ]

    // ライブラリコレクションが1つ以上ある場合、ライブラリコレクションを追加
    if (options.libraryCollections.length > 0) {
      newDropdownOptions = [
        ...newDropdownOptions,
        '-',
        {
          header: 'Library Collections',
        },
        ...options.libraryCollections.map(collection => ({
          text: collection.name,
          value: collection.key, // ライブラリコレクションはkeyをvalueにする
        })),
      ]
    }

    // console.log('newDropdownOptions Base', newDropdownOptions)

    // 現在の選択値が新しいオプションリストに存在するか確認
    const targetCollectionExist = newDropdownOptions.some(option => {
      if (typeof option === 'object' && 'value' in option) {
        // 現在の選択値に対応する value を取得
        const currentValue =
          value === null
            ? null // valueがnullの場合
            : value === 'all'
              ? 'all' // valueが'all'の場合
              : 'id' in value
                ? value.id // ローカルコレクションの場合
                : value.key // ライブラリコレクションの場合
        return option.value === currentValue
      }
      return false
    })

    // 存在しない場合、defaultValue を設定する
    if (!targetCollectionExist) {
      // console.log('Target collection not found, setting default:', defaultValue)
      updateSettings({
        [settingKey]: defaultValue,
      })
    }

    // 新しいドロップダウンオプションをstateに設定
    setDropdownOptions(newDropdownOptions)

    // 次のフレームでドロップダウンを準備完了にする
    window.requestAnimationFrame(() => {
      setIsDropdownReady(true)
    })
  }

  // ドロップダウンの選択が変更されたときのハンドラ
  async function handleChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value as string | null
    // console.log('handleChange Base', newValue, initialOption)

    // initialOption の値が選択された場合
    // initialOptionが存在し、かつそれがvalueを持つオブジェクトであり、newValueがそのvalueと一致する場合
    if (
      initialOption &&
      typeof initialOption === 'object' &&
      'value' in initialOption && // 型ガード: initialOptionがvalueプロパティを持つか確認
      newValue === initialOption.value
    ) {
      updateSettings({
        [settingKey]: initialOption.value, // initialOptionのvalue ('all' など) を設定
      })
    }
    // ListTargetCollectionDropdownでnullが選択された場合(defaultValueがnullの場合)
    else if (newValue === null && defaultValue === null) {
      updateSettings({
        [settingKey]: null,
      })
    }
    // ローカルコレクションが選択された場合
    else if (newValue?.startsWith('VariableCollectionId:')) {
      const newTargetCollection = tmpSettings.localCollections.find(
        collection => collection.id === newValue,
      )
      if (newTargetCollection) {
        updateSettings({
          [settingKey]: newTargetCollection,
        })
      } else {
        // 見つからない場合はデフォルト値を設定 (念のため)
        updateSettings({ [settingKey]: defaultValue })
      }
    }
    // ライブラリコレクションが選択された場合
    else if (newValue) {
      const newTargetCollection = tmpSettings.libraryCollections.find(
        collection => collection.key === newValue,
      )
      if (newTargetCollection) {
        updateSettings({
          [settingKey]: newTargetCollection,
        })
      } else {
        // 見つからない場合はデフォルト値を設定 (念のため)
        updateSettings({ [settingKey]: defaultValue })
      }
    } else {
      // その他の予期しないケースでもデフォルト値を設定
      updateSettings({ [settingKey]: defaultValue })
    }
  }

  // localCollections または libraryCollections が変更されたときにドロップダウンオプションを更新
  useUpdateEffect(() => {
    updateDropdownOptions({
      localCollections: tmpSettings.localCollections,
      libraryCollections: tmpSettings.libraryCollections,
    })
  }, [tmpSettings.localCollections, tmpSettings.libraryCollections])

  // レンダリング
  return (
    <Fragment>
      {isDropdownReady ? (
        <Dropdown
          onChange={handleChange}
          options={dropdownOptions}
          value={
            value === null
              ? null
              : value === 'all'
                ? 'all'
                : 'id' in value
                  ? value.id
                  : value.key
          }
        />
      ) : (
        // 準備中は無効なテキストボックスを表示
        <Textbox disabled value="Loading collections..." />
      )}
    </Fragment>
  )
}
