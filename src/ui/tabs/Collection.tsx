/** @jsx h */
import { h } from 'preact'

import { Container, VerticalSpace } from '@create-figma-plugin/ui'
import { useMount, useUnmount } from 'react-use'

import useResizeWindow from '@/ui/hooks/useResizeWindow'

export default function Collection() {
  const { resizeWindow } = useResizeWindow()

  useMount(() => {
    console.log('Collection: mounted')
    window.requestAnimationFrame(resizeWindow)
  })

  useUnmount(() => {
    console.log('Collection: unmounted')
  })

  return (
    <Container space="medium">
      <VerticalSpace space="medium" />

      <h1>Collection</h1>

      <VerticalSpace space="medium" />
    </Container>
  )
}
