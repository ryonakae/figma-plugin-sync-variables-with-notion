/** @jsx h */
import { h } from 'preact'
import type { ComponentPropsWithoutRef, ReactNode } from 'preact/compat'

import { twMerge } from 'tailwind-merge'

type FormItemProps = ComponentPropsWithoutRef<'div'> & {
  title: string
  description?: string
  className?: string
  children: ReactNode
}

export default function FormItem({
  title,
  description,
  className,
  children,
}: FormItemProps) {
  return (
    <div className={twMerge('flex flex-col gap-1', className)}>
      <div>{title}</div>

      {children}

      {description && <p className="text-text-secondary">{description}</p>}
    </div>
  )
}
