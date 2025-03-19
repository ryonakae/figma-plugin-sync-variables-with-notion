/** @jsx h */
import { h } from 'preact'

import { useMount, useUnmount } from 'react-use'

import TabItem from '@/ui/components/TabItem'

export default function Utilities() {
  useMount(() => {
    console.log('Utilities: mounted')
  })

  useUnmount(() => {
    console.log('Utilities: unmounted')
  })

  return (
    <TabItem>
      <h1>Utilities</h1>
    </TabItem>
  )
}
