/**
 * targetTextRangeに応じてtextNodeを取得する関数
 * @param targetTextRange 対象のテキスト範囲
 * @returns テキストノードの配列
 */
export default async function getTextNodes(
  targetTextRange: TargetTextRange,
): Promise<TextNode[]> {
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

      // 要素がセクション、グループ、フレーム、コンポーネント、インスタンスなら、要素内のすべてのテキストをtextNodesに追加
      else if (
        node.type === 'SECTION' ||
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
