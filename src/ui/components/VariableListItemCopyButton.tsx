/** @jsx h */
import { type JSX, h } from 'preact'

import { emit } from '@create-figma-plugin/utilities'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCopyToClipboard } from 'react-use'
import { twMerge } from 'tailwind-merge'

type VariableListItemCopyButtonProps = {
  text: string
  selected: boolean
  className?: string
}

export default function VariableListItemCopyButton({
  text,
  selected,
  className,
}: VariableListItemCopyButtonProps) {
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
          '!bg-bg-primary hover:!bg-bg-tertiary active:!bg-bg-primary flex h-5 w-5 items-center justify-center rounded-2',
          selected &&
            '!bg-bg-selected hover:!bg-bg-selected-tertiary active:!bg-bg-selected',
        )}
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faCopy} className="text-text-secondary" />
      </button>
    </div>
  )
}
