/** @jsx h */
/**
 * 変数リストアイテム用コピーボタンコンポーネント
 * クリップボードへのコピー機能を提供
 */
import { type JSX, h } from 'preact'

import { emit } from '@create-figma-plugin/utilities'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCopyToClipboard } from 'react-use'
import { twMerge } from 'tailwind-merge'

/**
 * コピーボタンコンポーネントのプロパティ
 */
type VariableListItemCopyButtonProps = {
  /** コピーするテキスト */
  text: string
  /** 親アイテムの選択状態 */
  selected: boolean
  /** 追加のTailwind CSSクラス */
  className?: string
}

/**
 * クリップボードへコピー機能を持つボタンコンポーネント
 * コピー成功時に通知を表示
 */
export default function VariableListItemCopyButton({
  text,
  selected,
  className,
}: VariableListItemCopyButtonProps) {
  const [_state, copyToClipboard] = useCopyToClipboard()

  /**
   * クリック時のハンドラ
   * クリップボードにテキストをコピーし、通知を表示
   */
  function onClick(event: JSX.TargetedMouseEvent<HTMLButtonElement>) {
    // 親要素へのバブリングを止める
    event.stopPropagation()

    copyToClipboard(text)
    console.log('[VarListItemCopyBtn] copied', text)

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
