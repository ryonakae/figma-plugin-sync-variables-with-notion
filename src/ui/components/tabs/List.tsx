/** @jsx h */
import { h } from 'preact'

import { Container, VerticalSpace } from '@create-figma-plugin/ui'
import { useMount, useUnmount } from 'react-use'

import useResizeWindow from '@/ui/hooks/useResizeWindow'

export default function List() {
  const { resizeWindow } = useResizeWindow()

  useMount(() => {
    console.log('List: mounted')
    window.requestAnimationFrame(resizeWindow)
  })

  useUnmount(() => {
    console.log('List: unmounted')
  })

  return (
    <Container space="medium">
      <VerticalSpace space="medium" />

      <h1>List</h1>

      <VerticalSpace space="medium" />
    </Container>
  )
}
