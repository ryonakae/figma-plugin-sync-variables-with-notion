/** @jsx h */
import { type JSX, h } from 'preact'

import { Button } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCopyToClipboard } from 'react-use'
import { twMerge } from 'tailwind-merge'

import useSettings from '@/ui/hooks/useSettings'

type CopyButtonProps = {
  text: string
  selected: boolean
  className?: string
}

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

function CopyButton({ text, selected, className }: CopyButtonProps) {
  const [_state, copyToClipboard] = useCopyToClipboard()

  function onClick(event: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    // 親要素へのバブリングを止める
    event.stopPropagation()

    copyToClipboard(text)
    console.log('copied', text)

    emit<NotifyFromUI>('NOTIFY_FROM_UI', {
      message: 'Copied to clipboard.',
    })
  }

  return (
    <div className={className}>
      <button
        type="button"
        className={twMerge(
          'flex h-5 w-5 items-center justify-center rounded-2 !bg-bg-primary hover:!bg-bg-tertiary active:!bg-bg-primary',
          selected &&
            '!bg-bg-selected hover:!bg-bg-selected-tertiary active:!bg-bg-selected',
        )}
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faCopy} />
      </button>
    </div>
  )
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
          'group flex-1 rounded-2 p-1 hover:bg-bg-hover',
          selected && 'hover:bg-bg-selected-secondary',
        )}
      >
        <div className="relative">
          <span>{value}</span>
          <CopyButton
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
    // emit<ApplyVariableHandler>('APPLY_VARIABLE', variable)
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
        <div className="mt-1 flex flex-col gap-1">
          <Button secondary fullWidth onClick={handleApplyClick}>
            Assign the selected variable to the text
          </Button>
        </div>
      )}
    </li>
  )
}
