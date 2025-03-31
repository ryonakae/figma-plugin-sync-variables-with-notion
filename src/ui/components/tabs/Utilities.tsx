/** @jsx h */
import { type JSX, h } from 'preact'

import {
  Checkbox,
  Dropdown,
  type DropdownOption,
  Stack,
  Text,
} from '@create-figma-plugin/ui'
import { useMount, useUnmount } from 'react-use'

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

  useMount(async () => {
    console.log('Utilities: mounted')
  })

  useUnmount(() => {
    console.log('Utilities: unmounted')
  })

  return (
    <TabItem>
      <Stack space="small">
        <div className="flex flex-col gap-1">
          <div>Target collection</div>
          <TargetCollectionDropdown
            settingKey="utilitiesTargetCollection"
            value={settings.utilitiesTargetCollection}
            initialOption={{
              text: 'All',
              value: 'all',
            }}
            defaultValue="all"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div>Target text range</div>
          <Dropdown
            onChange={handleTargetTextRangeChange}
            options={targetTextRangeDropdownOptions}
            value={settings.utilitiesTargetTextRange}
          />
          <p className="text-text-secondary">
            Applies actions to text layers within the specified range
          </p>
        </div>

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

        <div className="h-[200px] bg-gray-100" />
      </Stack>
    </TabItem>
  )
}
