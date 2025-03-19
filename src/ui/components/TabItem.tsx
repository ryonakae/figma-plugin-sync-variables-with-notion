/** @jsx h */
import { h } from 'preact'
import type { ReactNode } from 'preact/compat'

import { Container, VerticalSpace } from '@create-figma-plugin/ui'
import { useMount } from 'react-use'

import useResizeWindow from '@/ui/hooks/useResizeWindow'

type TabItemProps = {
  children: ReactNode
}

export default function TabItem({ children }: TabItemProps) {
  const { resizeWindow } = useResizeWindow()

  useMount(() => {
    window.requestAnimationFrame(resizeWindow)
  })

  return (
    <Container space="medium">
      <VerticalSpace space="medium" />
      {children}
      <VerticalSpace space="medium" />
    </Container>
  )
}
