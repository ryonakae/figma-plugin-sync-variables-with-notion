/** @jsx h */
/**
 * フォームアイテムコンポーネント
 * タイトル、説明、および子要素を含むフォーム要素のラッパー
 */
import { h } from 'preact'
import type { ComponentPropsWithoutRef, ReactNode } from 'preact/compat'

import { twMerge } from 'tailwind-merge'

/**
 * フォームアイテムコンポーネントのプロパティ
 */
type FormItemProps = ComponentPropsWithoutRef<'div'> & {
  /** フォームアイテムのタイトル */
  title?: string
  /** フォームアイテムの説明文 */
  description?: string
  /** 追加のTailwind CSSクラス */
  className?: string
  /** フォームコントロール要素 */
  children: ReactNode
}

/**
 * 一貫したスタイルのフォームアイテムを表示するコンポーネント
 * フォームコントロールにタイトルと説明テキストを追加
 */
export default function FormItem({
  title,
  description,
  className,
  children,
}: FormItemProps) {
  return (
    <div className={twMerge('flex flex-col gap-1', className)}>
      {title && <div>{title}</div>}

      {children}

      {description && <p className="text-text-secondary">{description}</p>}
    </div>
  )
}
