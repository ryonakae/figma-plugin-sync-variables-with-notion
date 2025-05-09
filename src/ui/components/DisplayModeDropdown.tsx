/** @jsx h */
/**
 * リスト表示モードドロップダウンコンポーネント
 * 変数コレクションのモード選択機能を提供
 */
import { Fragment, type JSX, h } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import { Dropdown, type DropdownOption, Textbox } from '@create-figma-plugin/ui'

import useCollection from '@/ui/hooks/useCollection'
import useSettings from '@/ui/hooks/useSettings'

/**
 * DisplayModeDropdownコンポーネントのProps
 */
interface DisplayModeDropdownProps {
  /**
   * 選択されたコレクション
   */
  targetCollection: VariableCollectionForUI | LibraryVariableCollection | null

  /**
   * コレクションに関連する変数配列
   * ライブラリコレクションの場合に使用され、getLibraryVariablesの重複呼び出しを防止
   */
  variablesForUI: VariableForUI[]
}

/**
 * 変数コレクションのモード（例：ライト/ダークテーマ）を選択するドロップダウン
 * 選択されたコレクションに基づいて利用可能なモードを動的に表示
 */
export default function DisplayModeDropdown({
  targetCollection,
  variablesForUI,
}: DisplayModeDropdownProps) {
  const { settings, updateSettings } = useSettings()
  const { isLocalCollection } = useCollection()
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>([])
  const [isDropdownReady, setIsDropdownReady] = useState(false)

  /**
   * モード選択変更時のハンドラ
   * @param event 変更イベント
   */
  function handleChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    updateSettings({ listDisplayModeId: newValue })
  }

  /**
   * ドロップダウンオプションを更新する関数
   * 選択されたコレクションに基づいて利用可能なモードを設定
   */
  function updateDropdownOptions() {
    console.log(
      '[DisplayModeDropdown] updateDropdownOptions',
      targetCollection,
      variablesForUI,
    )

    setIsDropdownReady(false)

    let newDropdownOptions: DropdownOption[] = []
    let displayModeId = ''

    // targetCollectionがnullなら何もしない
    if (targetCollection === null) {
      console.log('[DisplayModeDropdown] targetCollection is null')
      newDropdownOptions = []
      displayModeId = ''
    } else if (isLocalCollection(targetCollection)) {
      // LocalVariableCollectionの場合: modeの配列をdropdownOptionsに設定
      console.log(
        '[DisplayModeDropdown] targetCollection is LocalVariableCollection',
      )
      newDropdownOptions = targetCollection.modes.map(mode => ({
        text: mode.name,
        value: mode.modeId,
      }))

      // settings.listDisplayModeIdがnullではなく、かつtargetCollection.modesに存在する場合は、settings.listDisplayModeIdをセット
      if (
        settings.listDisplayModeId &&
        targetCollection.modes.some(
          mode => mode.modeId === settings.listDisplayModeId,
        )
      ) {
        displayModeId = settings.listDisplayModeId
      } else {
        // そうではない場合は、最初のモードidをセット
        displayModeId = targetCollection.modes[0].modeId
      }
    } else {
      // LibraryVariableCollectionの場合: propsから受け取った変数を使用
      console.log(
        '[DisplayModeDropdown] targetCollection is LibraryVariableCollection',
      )
      if (variablesForUI.length > 0) {
        const valuesByMode = variablesForUI[0].valuesByMode
        const modeIds = Object.keys(valuesByMode)

        console.log('[DisplayModeDropdown] valuesByMode', valuesByMode)
        console.log('[DisplayModeDropdown] modeIds', modeIds)

        newDropdownOptions = modeIds.map(modeId => ({
          value: modeId,
        }))

        // settings.listDisplayModeIdがnullではなく、かつnewDropdownOptionsに存在する場合は、settings.listDisplayModeIdをセット
        // そうではない場合は、最初のモードidをセット
        if (
          settings.listDisplayModeId &&
          modeIds.some(modeId => modeId === settings.listDisplayModeId)
        ) {
          displayModeId = settings.listDisplayModeId
        } else {
          displayModeId = modeIds[0]
        }
      }
    }

    console.log('[DisplayModeDropdown] newDropdownOptions', newDropdownOptions)
    console.log('[DisplayModeDropdown] displayModeId', displayModeId)

    setDropdownOptions(newDropdownOptions)
    updateSettings({
      listDisplayModeId: displayModeId,
    })

    window.requestAnimationFrame(() => {
      setIsDropdownReady(true)
    })
  }

  useEffect(() => {
    updateDropdownOptions()
  }, [targetCollection, variablesForUI])

  return (
    <Fragment>
      {!targetCollection ? (
        <Textbox disabled value="" />
      ) : !isDropdownReady ? (
        <Textbox disabled value="Loading modes..." />
      ) : dropdownOptions.length > 0 ? (
        <Dropdown
          onChange={handleChange}
          options={dropdownOptions}
          value={settings.listDisplayModeId}
        />
      ) : (
        <Textbox disabled value="No display modes available" />
      )}
    </Fragment>
  )
}
