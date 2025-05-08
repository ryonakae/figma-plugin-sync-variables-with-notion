import getVariable from '@/main//utils/getVariable'
import { applyVariableToTextNode } from '@/main/utils/applyVariableToTextNode'

export default async function applyVariable(variableForUI: VariableForUI) {
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
      const targetVariable = await getVariable(variableForUI)

      // まだtargetVariableが見つからなかったら処理を中断
      if (!targetVariable) {
        throw new Error(`Variable not found: ${variableForUI.id}`)
      }

      await applyVariableToTextNode(textNode, targetVariable)
    }),
  )
}
