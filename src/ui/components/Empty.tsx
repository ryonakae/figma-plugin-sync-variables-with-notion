/** @jsx h */
import { type JSX, h } from 'preact'
import type { ReactNode } from 'preact/compat'
import { twMerge } from 'tailwind-merge'

type EmptyProps = {
  className?: string
  children: ReactNode
}

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
