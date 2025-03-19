/** @jsx h */
import { h } from 'preact'

import { useMount, useUnmount } from 'react-use'

import TabItem from '@/ui/components/TabItem'

export default function Collection() {
  useMount(() => {
    console.log('Collection: mounted')
    console.log(process.env.PROXY_URL)
  })

  useUnmount(() => {
    console.log('Collection: unmounted')
  })

  return (
    <TabItem>
      <h1>Collection</h1>
    </TabItem>
  )
}
