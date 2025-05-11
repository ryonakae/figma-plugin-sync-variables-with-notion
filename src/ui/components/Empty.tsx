/** @jsx h */
/**
 * 空状態表示コンポーネント
 * データがない場合やエラー時の表示に使用
 */
import { type JSX, h } from 'preact'
import type { ReactNode } from 'preact/compat'
import { twMerge } from 'tailwind-merge'

/**
 * 空状態コンポーネントのプロパティ
 */
type EmptyProps = {
  /** 追加のTailwind CSSクラス */
  className?: string
  /** 表示するメッセージやアイコン */
  children: ReactNode
}

/**
 * データがない場合などに表示する空状態コンポーネント
 * 中央揃えで薄いテキストカラーでメッセージを表示
 */
export default function Empty({ className, children }: EmptyProps) {
  return (
    <div
      className={twMerge(
        'flex h-full flex-col items-center justify-center gap-2 text-center text-text-secondary',
        className,
      )}
    >
      {children}
    </div>
  )
}
