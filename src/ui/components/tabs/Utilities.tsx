/** @jsx h */
import { type JSX, h } from 'preact'

import {
  Button,
  Checkbox,
  Dropdown,
  type DropdownOption,
  Stack,
  Text,
  Textbox,
} from '@create-figma-plugin/ui'
import { useMount, useUnmount } from 'react-use'

import FormItem from '@/ui/components/FormItem'
import TabItem from '@/ui/components/TabItem'
import TargetCollectionDropdown from '@/ui/components/TargetCollectionDropdown'
import useSettings from '@/ui/hooks/useSettings'

export default function Utilities() {
  const { settings, updateSettings } = useSettings()

  const targetTextRangeDropdownOptions: DropdownOption[] &
    {
      value: TargetTextRange
    }[] = [
    {
      text: 'Current page',
      value: 'currentPage',
    },
    {
      text: 'Selection',
      value: 'selection',
    },
    {
      text: 'All pages',
      value: 'allPages',
    },
  ]

  function handleTargetTextRangeChange(
    event: JSX.TargetedEvent<HTMLInputElement>,
  ) {
    const targetTextRange = event.currentTarget.value as TargetTextRange
    updateSettings({
      utilitiesTargetTextRange: targetTextRange,
    })
  }

  function handleCheckboxChange(key: keyof Settings) {
    return (event: JSX.TargetedEvent<HTMLInputElement>) => {
      updateSettings({
        [key]: event.currentTarget.checked,
      })
    }
  }

  function handleIncludeKeyPropertyNameInput(
    event: JSX.TargetedEvent<HTMLInputElement>,
  ) {
    updateSettings({
      utilitiesIncludeKeyPropertyName: event.currentTarget.value,
    })
  }

  function handleIncludeKeyPropertyNameClear() {
    updateSettings({
      utilitiesIncludeKeyPropertyName: '',
    })
  }

  useMount(async () => {
    console.log('Utilities: mounted')
  })

  useUnmount(() => {
    console.log('Utilities: unmounted')
  })

  return (
    <TabItem>
      <Stack space="small">
        <FormItem title="Target collection">
          <TargetCollectionDropdown
            settingKey="utilitiesTargetCollection"
            value={settings.utilitiesTargetCollection}
            initialOption={{
              text: 'All',
              value: 'all',
            }}
            defaultValue="all"
          />
        </FormItem>

        <FormItem
          title="Target text range"
          description="Applies actions to text layers within the specified range"
        >
          <Dropdown
            onChange={handleTargetTextRangeChange}
            options={targetTextRangeDropdownOptions}
            value={settings.utilitiesTargetTextRange}
          />
        </FormItem>

        <Checkbox
          onChange={handleCheckboxChange('utilitiesIsIncludeComponents')}
          value={settings.utilitiesIsIncludeComponents}
        >
          {/* チェックボックスのラベル */}
          <Text>Include text within components</Text>
        </Checkbox>

        <Checkbox
          onChange={handleCheckboxChange('utilitiesIsIncludeInstances')}
          value={settings.utilitiesIsIncludeInstances}
        >
          {/* チェックボックスのラベル */}
          <Text>Include text within instances</Text>
        </Checkbox>

        <FormItem
          title="Limit variable name"
          description="Only variables with names containing this text will be used for bulk assignment."
        >
          <div className="flex gap-1">
            <div className="flex-1">
              <Textbox
                value={settings.utilitiesIncludeKeyPropertyName}
                onInput={handleIncludeKeyPropertyNameInput}
              />
            </div>

            {/* clear button */}
            {settings.utilitiesIncludeKeyPropertyName.length > 0 && (
              <Button onClick={handleIncludeKeyPropertyNameClear}>Clear</Button>
            )}
          </div>
        </FormItem>
      </Stack>
    </TabItem>
  )
}
