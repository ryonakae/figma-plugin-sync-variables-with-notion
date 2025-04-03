/** @jsx h */
import { Fragment, type JSX, h } from 'preact'
import { useEffect, useState } from 'preact/hooks'

import { Dropdown, type DropdownOption, Textbox } from '@create-figma-plugin/ui'

import useCollection from '@/ui/hooks/useCollection'
import useSettings from '@/ui/hooks/useSettings'

export default function ListDisplayModeDropdown() {
  const { settings, updateSettings } = useSettings()
  const { getLibraryVariables, isLocalCollection } = useCollection()
  const [dropdownOptions, setDropdownOptions] = useState<DropdownOption[]>([])
  const [isDropdownReady, setIsDropdownReady] = useState(false)

  function handleChange(event: JSX.TargetedEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value
    updateSettings({ listDisplayModeId: newValue })
  }

  async function updateDropdownOptions(
    targetCollection: LocalVariableCollectionForUI | LibraryVariableCollection,
  ) {
    console.log(
      'ListDisplayModeDropdown: updateDropdownOptions',
      targetCollection,
    )

    setIsDropdownReady(false)

    let newDropdownOptions: DropdownOption[] = []
    let displayModeId = ''

    // LocalVariableCollectionの場合: modeの配列をdropdownOptionsに設定
    if (isLocalCollection(targetCollection)) {
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
      // LibraryVariableCollectionの場合: variableを取得し、そのmodeの配列をdropdownOptionsに設定
      const variablesInLibraryCollection =
        await getLibraryVariables(targetCollection)
      console.log('variablesInLibraryCollection', variablesInLibraryCollection)

      const valuesByMode = variablesInLibraryCollection[0].valuesByMode
      console.log('valuesByMode', valuesByMode)

      const modeIds = Object.keys(valuesByMode)
      console.log('modeIds', modeIds)

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

    console.log('newDropdownOptions', newDropdownOptions)
    console.log('displayModeId', displayModeId)

    setDropdownOptions(newDropdownOptions)
    updateSettings({
      listDisplayModeId: displayModeId,
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
          value={settings.listDisplayModeId}
        />
      ) : (
        <Textbox disabled value="Loading modes..." />
      )}
    </Fragment>
  )
}
