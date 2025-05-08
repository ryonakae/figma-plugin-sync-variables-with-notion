import { uniqBy } from 'es-toolkit'

import getAncestorInstances from '@/main/utils/getAncestorInstances'
import getIsNodeParentComponentOrVariants from '@/main/utils/getIsNodeParentComponentOrVariants'

/**
 * textNodesをフィルタリングする関数
 * @param textNodes フィルタリング対象のテキストノード配列
 * @param options フィルタリングオプション
 * @returns フィルタリング後のテキストノード配列
 */
export default async function filterTextNodes(
  textNodes: TextNode[],
  options: {
    isIncludeComponents: boolean
    isIncludeInstances: boolean
  },
): Promise<TextNode[]> {
  // 削除予定のtextNodeを格納する配列
  let textNodesToRemove: TextNode[] = []

  // isIncludeComponentsがfalse
  // → コンポーネントまたはバリアントの子要素をtextNodesToRemoveに追加
  if (!options.isIncludeComponents) {
    textNodes.forEach(textNode => {
      console.log(
        'Checking textNode (component/variant child):',
        textNode.characters,
      )

      if (getIsNodeParentComponentOrVariants(textNode)) {
        console.log(
          'Removing textNode (component/variant child):',
          textNode.characters,
        )
        textNodesToRemove.push(textNode)
      }
    })
  }

  // isIncludeInstances
  // → インスタンスの子要素をtextNodesToRemoveに追加
  if (!options.isIncludeInstances) {
    console.log('textNodes', textNodes)
    for (const textNode of textNodes) {
      console.log('Checking textNode (instance child):', textNode.characters)

      const ancestorInstances = await getAncestorInstances(textNode)
      if (ancestorInstances.length > 0) {
        console.log('Removing textNode (instance child):', textNode.characters)
        textNodesToRemove.push(textNode)
      }
    }
  }

  // textNodesToRemoveから重複を削除
  textNodesToRemove = uniqBy(textNodesToRemove, node => node.id)

  console.log('textNodesToRemove', textNodesToRemove)

  // textNodesからtextNodesToRemoveにある要素を削除
  const filteredTextNodes = textNodes.filter(textNode => {
    return !textNodesToRemove.some(
      textNodeToRemove => textNodeToRemove.id === textNode.id,
    )
  })

  // filteredTextNodesを返す
  return filteredTextNodes
}
