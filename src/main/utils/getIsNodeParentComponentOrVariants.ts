/**
 * nodeの親がコンポーネント or Variantsかどうかを返す再帰関数
 * @param node 確認対象のノード
 * @returns 親がコンポーネントまたはバリアントの場合true、それ以外の場合false
 */
export default function getIsNodeParentComponentOrVariants(
  node: SceneNode,
): boolean {
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
