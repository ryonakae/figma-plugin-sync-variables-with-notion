import getAncestorInstances from '@/main/utils/getAncestorInstances'
import getTextNodes from '@/main/utils/getTextNodes'

// ページにあるtextNodeの上にrectを作成し、ハイライトする関数
async function createHighlightRectOnPage(
  textNodes: TextNode[],
  pageNode: PageNode,
) {
  console.log('[highlightText] createHighlightRectOnPage', textNodes, pageNode)

  // textNodesが空の場合は処理を終了
  if (textNodes.length === 0) {
    throw new Error('No text was found.')
  }

  // Rectangleを格納する配列を用意
  let rectNodes: RectangleNode[] = []
  const correctRectNodes: RectangleNode[] = []
  const incorrectRectNodes: RectangleNode[] = []

  // 以前生成したgroupを探して、削除
  const generatedGroupId = pageNode.getPluginData('generatedGroupId')
  const previousGeneratedGroup = pageNode.findOne(
    node => node.id === generatedGroupId,
  )
  console.log('[highlightText] generatedGroupId', generatedGroupId)
  console.log('[highlightText] previousGeneratedGroup', previousGeneratedGroup)
  if (previousGeneratedGroup) {
    previousGeneratedGroup.remove()
  }

  // textNodeごとに処理を実行
  await Promise.all(
    textNodes.map(async textNode => {
      console.log('[highlightText] textNode', textNode, textNode.characters)

      // ハイライト用のrectを作る（レイヤーが表示されているものだけ）
      if (textNode.absoluteRenderBounds) {
        // rectを作って、サイズとかstrokeとか設定
        const rect = figma.createRectangle()
        rect.x = textNode.absoluteRenderBounds.x
        rect.y = textNode.absoluteRenderBounds.y
        rect.resize(
          textNode.absoluteRenderBounds.width,
          textNode.absoluteRenderBounds.height,
        )

        let hasVariable = false
        let variableName = ''

        // 先祖インスタンスを取得
        const ancestorInstances = await getAncestorInstances(textNode)

        // 先祖インスタンスがある場合 (nodeはインスタンスの子要素)
        if (
          ancestorInstances.length > 0 &&
          textNode.componentPropertyReferences?.characters
        ) {
          // 一番近い先祖インスタンスの取得
          const ancestorInstance =
            ancestorInstances[ancestorInstances.length - 1]
          const propertyName = textNode.componentPropertyReferences.characters

          // インスタンスのプロパティを取得
          const properties = ancestorInstance.componentProperties
          const property = properties[propertyName]

          // プロパティにVariableが割り当てられているか確認
          if (property?.boundVariables?.value) {
            const variable = await figma.variables.getVariableByIdAsync(
              property.boundVariables.value.id,
            )
            if (variable) {
              hasVariable = true
              variableName = variable.name
            }
          }
        } else if (textNode.boundVariables?.characters) {
          // 直接Variableが割り当てられている場合
          const variableId = textNode.boundVariables.characters.id
          const variable =
            await figma.variables.getVariableByIdAsync(variableId)
          if (variable) {
            hasVariable = true
            variableName = variable.name
          }
        }

        // 変数が割り当てられている場合は青、そうでない場合は赤で塗りつぶす
        if (hasVariable) {
          rect.fills = [
            { type: 'SOLID', color: { r: 0, g: 0, b: 1 }, opacity: 0.3 },
          ]
          rect.name = `⭕️ [${variableName}] ${textNode.characters}`
          correctRectNodes.push(rect)
        } else {
          rect.fills = [
            { type: 'SOLID', color: { r: 1, g: 0, b: 0 }, opacity: 0.3 },
          ]
          rect.name = `❌ ${textNode.characters}`
          incorrectRectNodes.push(rect)
        }
      }
    }),
  )

  // correctRectNodesとincorrectRectNodesをrectNodesにマージする
  rectNodes = [...correctRectNodes, ...incorrectRectNodes]
  console.log('[highlightText] rectNodes', rectNodes)

  // rectNodeが1つ以上ある場合、rectをグルーピングする
  if (rectNodes.length > 0) {
    const group = figma.group(rectNodes, pageNode)
    group.name = `${rectNodes.length} Highlights (⭕️ ${correctRectNodes.length} / ❌ ${incorrectRectNodes.length}) - Generated with Sync Message Studio`

    // をロック
    group.locked = true

    // 折りたたむ
    group.expanded = false

    // 生成したgroupのidをcurrentPageのgeneratedGroupIdに保存する
    pageNode.setPluginData('generatedGroupId', group.id)
  }
}

// メイン関数
export default async function highlightText(targetTextRange: TargetTextRange) {
  console.log('[highlightText] highlightText', targetTextRange)

  // ハイライトを実行
  // allPagesの場合、各ページごとに処理を実行
  if (targetTextRange === 'allPages') {
    for (const page of figma.root.children) {
      // まず対象のpageNodeに移動
      await figma.setCurrentPageAsync(page)

      // そのページ内のテキストを取得
      const textNodes = await getTextNodes('currentPage')

      // ハイライト
      await createHighlightRectOnPage(textNodes, page)
    }
  } else {
    // allPages以外の場合
    // targetTextRangeに基づいてテキストを取得
    const textNodes = await getTextNodes(targetTextRange)

    // ハイライト
    await createHighlightRectOnPage(textNodes, figma.currentPage)
  }
}
