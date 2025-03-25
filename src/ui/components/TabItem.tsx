/** @jsx h */
import { Fragment, h } from 'preact'
import type { ReactNode } from 'preact/compat'

import {
  Container,
  type ContainerSpace,
  VerticalSpace,
} from '@create-figma-plugin/ui'
import { useMount } from 'react-use'

import useResizeWindow from '@/ui/hooks/useResizeWindow'

type TabItemProps = {
  space?: ContainerSpace | 'none'
  children: ReactNode
}

export default function TabItem({ space = 'medium', children }: TabItemProps) {
  const { resizeWindow } = useResizeWindow()

  useMount(() => {
    window.requestAnimationFrame(resizeWindow)
  })

  return (
    <Fragment>
      {space === 'none' ? (
        <div>{children}</div>
      ) : (
        <Container space={space}>
          <VerticalSpace space={space} />
          {children}
          <VerticalSpace space={space} />
        </Container>
      )}
    </Fragment>
  )
}
