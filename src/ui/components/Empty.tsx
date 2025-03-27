/** @jsx h */
import { type JSX, h } from 'preact'
import type { ReactNode } from 'preact/compat'

type EmptyProps = {
  children: ReactNode
}

export default function Empty({ children }: EmptyProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-text-secondary">
      {children}
    </div>
  )
}
