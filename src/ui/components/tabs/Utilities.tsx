/** @jsx h */
import { h } from 'preact'

import { Container, VerticalSpace } from '@create-figma-plugin/ui'
import { useMount, useUnmount } from 'react-use'

import useResizeWindow from '@/ui/hooks/useResizeWindow'

export default function Utilities() {
  const { resizeWindow } = useResizeWindow()

  useMount(() => {
    console.log('Utilities: mounted')
    window.requestAnimationFrame(resizeWindow)
  })

  useUnmount(() => {
    console.log('Utilities: unmounted')
  })

  return (
    <Container space="medium">
      <VerticalSpace space="medium" />

      <h1>Utilities</h1>

      <VerticalSpace space="medium" />
    </Container>
  )
}
