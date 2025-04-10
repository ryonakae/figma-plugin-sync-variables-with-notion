import { getAncestorInstances } from '@/main/util'

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
  await Promise.all(
    textNodes.map(async textNode => {
      // VariableForUI.idから実際のバリアブルを探す
      const targetVariable = await figma.variables.getVariableByIdAsync(
        variable.id,
      )

      // targetVariableが見つからなかったら処理をスキップ
      if (!targetVariable) {
        return
      }

      // 先祖インスタンスを取得
      const ancestorInstances = await getAncestorInstances(textNode)
      console.log('ancestorInstances', ancestorInstances)

      // 先祖インスタンスがある場合 (nodeはインスタンスの子要素)
      if (ancestorInstances.length > 0) {
        // componentPropertyReferences.charactersがある場合
        if (textNode.componentPropertyReferences?.characters) {
          // 一番近い先祖インスタンスの取得 (ancestorInstancesの最後の要素)
          const ancestorInstance =
            ancestorInstances[ancestorInstances.length - 1]

          // プロパティ名を取得
          const propertyName = textNode.componentPropertyReferences.characters

          // 先祖インスタンスの該当componentPropertyにVariableを割り当て
          ancestorInstance.setProperties({
            [propertyName]: {
              type: 'VARIABLE_ALIAS',
              id: targetVariable.id,
            },
          })
        } else {
          // ない場合、textNodeにVariableを割り当て
          textNode.setBoundVariable('characters', targetVariable)
        }
      } else {
        // 先祖インスタンスが無い場合、単純にtextNodeにVariableを割り当て
        textNode.setBoundVariable('characters', targetVariable)
      }
    }),
  )
}
