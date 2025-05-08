/** @jsx h */
/**
 * タブ内容コンポーネント
 * タブパネル内の内容を表示するためのコンテナ
 */
import { Fragment, h } from 'preact'
import type { ReactNode } from 'preact/compat'

import {
  Container,
  type ContainerSpace,
  VerticalSpace,
} from '@create-figma-plugin/ui'
import { useMount, useUnmount } from 'react-use'

import useResizeWindow from '@/ui/hooks/useResizeWindow'

/**
 * タブアイテムコンポーネントのプロパティ
 */
type TabItemProps = {
  /** コンテナの余白サイズ。'none'を指定すると余白なし */
  space?: ContainerSpace | 'none'
  /** タブパネル内に表示する内容 */
  children: ReactNode
}

/**
 * タブパネル内のコンテンツを表示するコンポーネント
 * マウント時にウィンドウサイズの自動調整を行う
 */
export default function TabItem({ space = 'medium', children }: TabItemProps) {
  const { resizeWindow } = useResizeWindow()

  useMount(async () => {
    console.log('TabItem useMount')

    // ウインドウをリサイズ
    window.requestAnimationFrame(resizeWindow)
  })

  useUnmount(() => {
    console.log('TabItem useUnmount')
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
