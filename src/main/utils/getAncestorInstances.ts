import { times } from 'es-toolkit/compat'

/**
 * nodeのidから先祖インスタンスの配列を返す関数（自分は含まない）
 * @param node 対象のシーンノード
 * @returns 先祖インスタンスの配列
 */
export default async function getAncestorInstances(
  node: SceneNode,
): Promise<InstanceNode[]> {
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
