/**
 * テキストノードに変数を適用するためのユーティリティモジュール
 */
import getAncestorInstances from '@/main/utils/getAncestorInstances'

/**
 * テキストノードに変数を適用する関数
 * テキストノードがコンポーネントインスタンス内にある場合と、そうでない場合で適切に処理
 *
 * @param node 変数を適用するテキストノード
 * @param variable 適用する変数
 */
export async function applyVariableToTextNode(
  node: TextNode,
  variable: Variable,
): Promise<void> {
  // 先祖インスタンスを取得（コンポーネントインスタンス内のテキストノードかどうかを判定）
  const ancestorInstances = await getAncestorInstances(node)

  // 先祖インスタンスがある場合 (nodeはインスタンスの子要素)
  if (ancestorInstances.length > 0) {
    // componentPropertyReferences.charactersがある場合
    // （テキストがインスタンスのプロパティにリンクされている場合）
    if (node.componentPropertyReferences?.characters) {
      // 一番近い先祖インスタンスの取得 (ancestorInstancesの最後の要素)
      const ancestorInstance = ancestorInstances[ancestorInstances.length - 1]

      // プロパティ名を取得
      const propertyName = node.componentPropertyReferences.characters

      // 先祖インスタンスの該当componentPropertyにVariableを割り当て
      ancestorInstance.setProperties({
        [propertyName]: {
          type: 'VARIABLE_ALIAS',
          id: variable.id,
        },
      })
    } else {
      // インスタンス内だがプロパティリンクがない場合、直接nodeにVariableを割り当て
      node.setBoundVariable('characters', variable)
    }
  } else {
    // 先祖インスタンスが無い場合（通常のテキストノード）、単純にnodeにVariableを割り当て
    node.setBoundVariable('characters', variable)
  }
}
