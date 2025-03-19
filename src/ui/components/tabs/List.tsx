/** @jsx h */
import { h } from 'preact'

import { useMount, useUnmount } from 'react-use'

import TabItem from '@/ui/components/TabItem'

export default function List() {
  useMount(() => {
    console.log('List: mounted')
  })

  useUnmount(() => {
    console.log('List: unmounted')
  })

  return (
    <TabItem>
      <h1>List</h1>
    </TabItem>
  )
}
