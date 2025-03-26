/** @jsx h */
import { Fragment, type JSX, h } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import { Dropdown, type DropdownOption, Textbox } from '@create-figma-plugin/ui'

import useCollection from '@/ui/hooks/useCollection'
import useSettings from '@/ui/hooks/useSettings'
import { emit, once } from '@create-figma-plugin/utilities'

export default function ListDisplayModeDropdown() {
  const { settings, updateSettings } = useSettings()
  const { isLocalVariableCollection } = useCollection()
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>([])
  const [isDropdownReady, setIsDropdownReady] = useState(false)

  function handleChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    updateSettings({ displayModeId: newValue })
  }

  async function updateDropdownOptions(
    targetCollection: LocalVariableCollectionForUI | LibraryVariableCollection,
  ) {
    console.log('updateDropdownOptions', targetCollection)

    setIsDropdownReady(false)

    let newDropdownOptions: DropdownOption[] = []
    let displayModeId = ''

    // LocalVariableCollectionの場合: modeの配列をdropdownOptionsに設定
    if (isLocalVariableCollection(targetCollection)) {
      newDropdownOptions = targetCollection.modes.map(mode => ({
        text: mode.name,
        value: mode.modeId,
      }))

      // settings.displayModeIdがnullではなく、かつtargetCollection.modesに存在する場合は、settings.displayModeIdをセット
      // そうではない場合は、最初のモードidをセット
      if (
        settings.displayModeId &&
        targetCollection.modes.some(
          mode => mode.modeId === settings.displayModeId,
        )
      ) {
        displayModeId = settings.displayModeId
      } else {
        displayModeId = targetCollection.modes[0].modeId
      }
    }

    // LibraryVariableCollectionの場合: variableを取得し、そのmodeの配列をdropdownOptionsに設定
    else {
      const variablesInLibraryCollection = await new Promise<VariableForUI[]>(
        (resolve, _reject) => {
          once<SetVariablesInLibraryCollectionFromMain>(
            'SET_VARIABLES_IN_LIBRARY_COLLECTION_FROM_MAIN',
            resolve,
          )
          emit<GetVariablesInLibraryCollectionFromUI>(
            'GET_VARIABLES_IN_LIBRARY_COLLECTION_FROM_UI',
            targetCollection,
          )
        },
      )
      console.log('variablesInLibraryCollection', variablesInLibraryCollection)

      const valuesByMode = variablesInLibraryCollection[0].valuesByMode
      console.log('valuesByMode', valuesByMode)

      const modeIds = Object.keys(valuesByMode)
      console.log('modeIds', modeIds)

      newDropdownOptions = modeIds.map(modeId => ({
        value: modeId,
      }))

      // settings.displayModeIdがnullではなく、かつnewDropdownOptionsに存在する場合は、settings.displayModeIdをセット
      // そうではない場合は、最初のモードidをセット
      if (
        settings.displayModeId &&
        modeIds.some(modeId => modeId === settings.displayModeId)
      ) {
        displayModeId = settings.displayModeId
      } else {
        displayModeId = modeIds[0]
      }
    }

    console.log('newDropdownOptions', newDropdownOptions)
    console.log('displayModeId', displayModeId)

    setDropdownOptions(newDropdownOptions)
    updateSettings({
      displayModeId,
    })

    window.requestAnimationFrame(() => {
      setIsDropdownReady(true)
    })
  }

  useEffect(() => {
    if (settings.listTargetCollection === null) return

    // targetCollectionが変更された場合、dropdownOptionsを更新
    updateDropdownOptions(settings.listTargetCollection)
  }, [settings.listTargetCollection])

  return (
    <Fragment>
      {isDropdownReady && dropdownOptions.length > 0 ? (
        <Dropdown
          onChange={handleChange}
          options={dropdownOptions}
          value={settings.displayModeId}
        />
      ) : (
        <Textbox disabled value="" />
      )}
    </Fragment>
  )
}
