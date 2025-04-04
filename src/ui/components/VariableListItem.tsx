/** @jsx h */
import { type JSX, h } from 'preact'

import { Button } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { twMerge } from 'tailwind-merge'

import VariableListItemCopyButton from '@/ui/components/VariableListItemCopyButton'
import useSettings from '@/ui/hooks/useSettings'

type ValueWithCopyButtonProps = {
  label: string
  value: string
  copyText: string
  selected: boolean
}

type VariableListItemProps = {
  variable: VariableForUI
  onClick: (id: string) => void
  selected: boolean
}

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
