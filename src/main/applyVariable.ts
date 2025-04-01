export default async function applyVariable(variable: VariableForUI) {
  console.log('applyVariable', applyVariable)

  if (figma.currentPage.selection.length === 0) {
    // 何も選択していない場合は処理を終了
    figma.notify('Please select at least one element.')
    return
  }

  // textNodeを格納する配列を用意
  const textNodes: TextNode[] = []

  // 選択要素ごとに処理を実行
  figma.currentPage.selection.forEach(node => {
    // 要素がテキストの場合、textNodesに追加
    if (node.type === 'TEXT') {
      textNodes.push(node)
    }
  })

  console.log('textNodes', textNodes)

  // textNodeが1つも無かったら処理を中断
  if (textNodes.length === 0) {
    figma.notify('No text elements are selected.')
    return
  }

  // textNodeごとに処理を実行
  for (const textNode of textNodes) {
    // VariableForUI.idから実際のバリアブルを探す
    const targetVariable = await figma.variables.getVariableByIdAsync(
      variable.id,
    )

    // targetVariableが見つからなかったら処理をスキップ
    if (!targetVariable) {
      return
    }

    // textNodeにVariableを割り当て
    textNode.setBoundVariable('characters', targetVariable)
  }

  // 完了通知
  figma.notify('Variable assigned to selected text.')
}
