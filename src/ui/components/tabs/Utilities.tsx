/** @jsx h */
/**
 * ユーティリティタブのコンポーネント
 * テキスト変数の一括適用やハイライト機能を提供
 */
import { type JSX, h } from 'preact'

import {
  Button,
  Checkbox,
  Divider,
  Dropdown,
  type DropdownOption,
  Stack,
  Text,
  Textbox,
  VerticalSpace,
} from '@create-figma-plugin/ui'
import { useMount, useUnmount } from 'react-use'

import FormItem from '@/ui/components/FormItem'
import TabItem from '@/ui/components/TabItem'
import TargetCollectionDropdown from '@/ui/components/TargetCollectionDropdown'
import useSettings from '@/ui/hooks/useSettings'
import { emit } from '@create-figma-plugin/utilities'

/**
 * ユーティリティタブのメインコンポーネント
 * 一括処理設定とボタンを提供
 */
export default function Utilities() {
  const { settings, tmpSettings, updateSettings, updateTmpSettings } =
    useSettings()

  /**
   * 対象テキスト範囲のドロップダウンオプション
   */
  const targetTextRangeDropdownOptions: DropdownOption[] &
    {
      value: TargetTextRange
    }[] = [
    {
      text: 'Selection',
      value: 'selection',
    },
    {
      text: 'Current page',
      value: 'currentPage',
    },
    {
      text: 'All pages',
      value: 'allPages',
    },
  ]

  /**
   * 対象テキスト範囲変更時のハンドラ
   * @param event ドロップダウン変更イベント
   */
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

  function handleBulkApplyVariablesClick() {
    updateTmpSettings({
      loading: true,
    })

    emit<BulkApplyVariablesFromUI>('BULK_APPLY_VARIABLES_FROM_UI', {
      collection: settings.utilitiesTargetCollection,
      targetTextRange: settings.utilitiesTargetTextRange,
      isIncludeComponents: settings.utilitiesIsIncludeComponents,
      isIncludeInstances: settings.utilitiesIsIncludeInstances,
      includeKeyPropertyName: settings.utilitiesIncludeKeyPropertyName,
    })
  }

  function handleHighlightTextClick() {
    updateTmpSettings({
      loading: true,
    })

    emit<HighlightTextFromUI>(
      'HIGHLIGHT_TEXT_FROM_UI',
      settings.utilitiesTargetTextRange,
    )
  }

  useMount(async () => {
    console.log('[Utilities] mounted')
  })

  useUnmount(() => {
    console.log('[Utilities] unmounted')
  })

  return (
    <TabItem>
      <Stack space="small">
        <div className="font-bold">Settings for actions</div>

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
          description="Applies actions to text layers within the specified range."
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
          description="Only variables with names containing this text will be used for bulk apply."
        >
          <div className="flex gap-1">
            <div className="[&>div]:!select-auto flex-1">
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

      <VerticalSpace space="medium" />

      <Divider />

      <VerticalSpace space="medium" />

      <Stack space="small">
        <div className="font-bold">Select an action</div>

        {/* 一括適用アクション */}
        <FormItem description="Bulk apply variables to text. Applies variables when the text string matches the variable value. Searches across multiple modes if available.">
          <Button
            fullWidth
            onClick={handleBulkApplyVariablesClick}
            disabled={
              !settings.utilitiesTargetCollection || tmpSettings.loading
            }
            className="!h-8"
          >
            Bulk apply variables
          </Button>
        </FormItem>

        {/* ハイライトアクション */}
        <FormItem description="Visualize variable applications in text. Text with applied variables will be highlighted in blue, while text without applications will be highlighted in red.">
          <Button
            fullWidth
            onClick={handleHighlightTextClick}
            disabled={tmpSettings.loading}
            className="!h-8"
          >
            Highlight applied variables
          </Button>
        </FormItem>
      </Stack>
    </TabItem>
  )
}
