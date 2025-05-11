/**
 * 指定された範囲のテキストノードを取得するユーティリティモジュール
 */

/**
 * targetTextRangeに応じてテキストノードを取得する関数
 * 現在のページ、すべてのページ、または選択範囲からテキストノードを収集
 *
 * @param targetTextRange 対象のテキスト範囲（'currentPage'|'allPages'|'selection'）
 * @returns テキストノードの配列
 * @throws 選択範囲が指定された場合で何も選択されていない場合、エラーをスロー
 */
export default async function getTextNodes(
  targetTextRange: TargetTextRange,
): Promise<TextNode[]> {
  // テキストノードを格納する配列を用意
  let textNodes: TextNode[] = []

  if (targetTextRange === 'currentPage') {
    // 現在のページ内のすべてのテキストノードを取得
    textNodes = figma.currentPage.findAllWithCriteria({ types: ['TEXT'] })
  } else if (targetTextRange === 'allPages') {
    // すべてのページのテキストノードを取得
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
    // 選択範囲からテキストノードを取得

    // 何も選択していない場合は処理を終了
    if (figma.currentPage.selection.length === 0) {
      throw new Error('Please select at least one element.')
    }

    // 選択要素ごとに処理を実行
    figma.currentPage.selection.forEach(node => {
      // 要素がテキストの場合、textNodesに追加
      if (node.type === 'TEXT') {
        textNodes.push(node)
      }

      // 要素がセクション、グループ、フレーム、コンポーネント、インスタンスなら、
      // 要素内のすべてのテキストをtextNodesに追加
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
