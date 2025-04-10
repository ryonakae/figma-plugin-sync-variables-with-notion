import { times, uniqBy } from 'es-toolkit/compat'

// nodeの親がコンポーネント or Variantsかどうかを返す再帰関数
export function getIsNodeParentComponentOrVariants(node: SceneNode) {
  // 親要素がなかったらfalseを返す
  if (!node.parent) {
    return false
  }
  // 親がpage or documentならfalseを返す
  if (node.parent.type === 'PAGE' || node.parent.type === 'DOCUMENT') {
    return false
  }
  // 親要素のtypeがCOMPONENT || COMPONENT_SETならtrueを返す
  if (
    node.parent.type === 'COMPONENT' ||
    node.parent.type === 'COMPONENT_SET'
  ) {
    return true
  }
  // ↑のどれにも当てはまらなかったら親要素を対象にして関数実行
  return getIsNodeParentComponentOrVariants(node.parent)
}

// nodeのidから先祖インスタンスの配列を返す関数（自分は含まない）
export async function getAncestorInstances(node: SceneNode) {
  // idをセミコロンで区切って配列にしたもの
  const idArray = node.id.split(';')

  // 非同期処理を並列実行するためのPromise配列を生成
  // 各Promiseはインスタンスノードまたはnullを解決する
  const promises = idArray.map(async (id, i): Promise<InstanceNode | null> => {
    // 最後のidは除外
    if (i === idArray.length - 1) return null

    // indexに応じてidを加工
    const targetId =
      i === 0
        ? idArray[i]
        : times(i + 1)
            .map(j => idArray[j])
            .join(';')

    try {
      // 加工したidを元にインスタンスを検索
      const instance = await figma.getNodeByIdAsync(targetId)
      if (instance && instance.type === 'INSTANCE') {
        // インスタンスが見つかった場合はそれを返す
        return instance as InstanceNode
      }
    } catch (error) {
      console.error(`Failed to get instance with id: ${targetId}`, error)
    }
    // インスタンスが見つからない、またはエラーが発生した場合はnullを返す
    return null
  })

  // すべての非同期処理が完了するのを待つ
  // results配列はpromises配列と同じ順序になる
  const results = await Promise.all(promises)

  // 結果配列からnullを除外し、有効なインスタンスノードのみをフィルタリングする
  const instanceArray = results.filter(
    (instance): instance is InstanceNode => instance !== null,
  )

  return instanceArray
}

// targetTextRangeに応じてtextNodeを取得する関数
export async function getTextNodes(targetTextRange: TargetTextRange) {
  // textNodeを格納する配列を用意
  let textNodes: TextNode[] = []

  if (targetTextRange === 'currentPage') {
    // targetTextRangeに応じてtextNodeを検索、配列に追加
    textNodes = figma.currentPage.findAllWithCriteria({ types: ['TEXT'] })
  } else if (targetTextRange === 'allPages') {
    // 各ページごとに処理を実行
    for (const page of figma.root.children) {
      // ページを読み込む
      await page.loadAsync()

      // ページ配下にあるすべてのテキストをtextNodesに追加
      textNodes = [
        ...textNodes,
        ...page.findAllWithCriteria({ types: ['TEXT'] }),
      ]
    }
  } else if (targetTextRange === 'selection') {
    // 何も選択していない場合は処理を終了
    if (figma.currentPage.selection.length === 0) {
      throw new Error('Please select at least one element.')
    }

    figma.currentPage.selection.forEach(node => {
      // 要素がテキストの場合、textNodesに追加
      if (node.type === 'TEXT') {
        textNodes.push(node)
      }

      // 要素がグループ、フレーム、コンポーネント、インスタンスなら、要素内のすべてのテキストをtextNodesに追加
      else if (
        node.type === 'GROUP' ||
        node.type === 'FRAME' ||
        node.type === 'COMPONENT' ||
        node.type === 'COMPONENT_SET' ||
        node.type === 'INSTANCE'
      ) {
        textNodes = [
          ...textNodes,
          ...node.findAllWithCriteria({ types: ['TEXT'] }),
        ]
      }

      // それ以外の場合は何もしない
      // else {}
    })
  }

  return textNodes
}

// textNodesをフィルタリングする関数
export async function filterTextNodes(
  textNodes: TextNode[],
  options: {
    isIncludeComponents: boolean
    isIncludeInstances: boolean
  },
) {
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
  textNodesToRemove = uniqBy(textNodesToRemove, 'id')

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
