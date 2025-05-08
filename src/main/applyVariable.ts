/**
 * 選択されたテキスト要素に対して変数を適用するモジュール
 */
import { applyVariableToTextNode } from '@/main/utils/applyVariableToTextNode'
import getVariable from '@/main/utils/getVariable'

/**
 * 選択されたテキスト要素に変数を適用する関数
 * @param variableForUI 適用する変数（UI用の形式）
 * @throws 変数が見つからない場合エラーをスロー
 */
export default async function applyVariable(variableForUI: VariableForUI) {
  console.log('applyVariable', applyVariable)

  // 選択がない場合は処理を終了
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
      // UI用の変数情報から実際の変数オブジェクトを取得
      const targetVariable = await getVariable(variableForUI)

      // まだtargetVariableが見つからなかったら処理を中断
      if (!targetVariable) {
        throw new Error(`Variable not found: ${variableForUI.id}`)
      }

      // テキストノードに変数を適用
      await applyVariableToTextNode(textNode, targetVariable)
    }),
  )
}
