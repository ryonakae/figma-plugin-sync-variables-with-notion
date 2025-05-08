/** @jsx h */
/**
 * 変数リストアイテムコンポーネント
 * 単一の変数項目を表示し、コピーとクリック操作を提供
 */
import { type JSX, h } from 'preact'

import { Button } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { twMerge } from 'tailwind-merge'

import VariableListItemCopyButton from '@/ui/components/VariableListItemCopyButton'
import useSettings from '@/ui/hooks/useSettings'

/**
 * コピーボタン付き値表示コンポーネントのプロパティ
 */
type ValueWithCopyButtonProps = {
  /** 値のラベル */
  label: string
  /** 表示する値 */
  value: string
  /** コピーボタンクリック時にコピーするテキスト */
  copyText: string
  /** 選択状態 */
  selected: boolean
}

/**
 * 変数リストアイテムコンポーネントのプロパティ
 */
type VariableListItemProps = {
  /** 表示する変数 */
  variable: VariableForUI
  /** クリック時のコールバック */
  onClick: (id: string) => void
  /** 選択状態 */
  selected: boolean
}

/**
 * コピーボタン付きの値表示コンポーネント
 * ホバー時にコピーボタンを表示
 */
function ValueWithCopyButton({
  label,
  value,
  copyText,
  selected,
}: ValueWithCopyButtonProps) {
  return (
    <div className="flex w-full">
      <div className="w-10 py-1 text-text-secondary">{label}</div>
      <div
        className={twMerge(
          'group flex-1 rounded-4 p-1 hover:bg-bg-hover',
          selected && 'hover:bg-bg-selected-secondary',
        )}
      >
        <div className="relative">
          <span>{value}</span>
          <VariableListItemCopyButton
            text={copyText}
            selected={selected}
            className="-right-0.5 -bottom-0.5 absolute hidden group-hover:block"
          />
        </div>
      </div>
    </div>
  )
}

export default function VariableListItem({
  variable,
  onClick,
  selected,
}: VariableListItemProps) {
  const { settings } = useSettings()

  function getVariableValue() {
    const value =
      settings.listDisplayModeId &&
      variable.valuesByMode[settings.listDisplayModeId]
    return value ? value.toString() : '-'
  }

  function handleApplyClick(event: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    // 親要素へのバブリングを止める
    event.stopPropagation()

    console.log('handleApplyClick', variable)
    emit<ApplyVariableFromUI>('APPLY_VARIABLE_FROM_UI', variable)
  }

  return (
    <li
      className={twMerge(
        'flex flex-col !border-b !border-b-border-primary !border-solid p-2',
        selected && 'bg-bg-selected',
      )}
      onClick={() => onClick(variable.id)}
    >
      <ValueWithCopyButton
        label="Key"
        value={variable.name}
        copyText={variable.name}
        selected={selected}
      />
      <ValueWithCopyButton
        label="Value"
        value={getVariableValue()}
        copyText={getVariableValue()}
        selected={selected}
      />

      {selected && (
        <div className="mt-1">
          <Button secondary fullWidth onClick={handleApplyClick}>
            Apply variable to selected text
          </Button>
        </div>
      )}
    </li>
  )
}
