import getLibraryVariablesWithCache from '@/main/utils/getLibraryVariablesWithCache'

/**
 * ライブラリコレクションからUI表示用の変数一覧を取得する関数
 *
 * @param targetCollection 対象のライブラリコレクション
 * @returns UI表示用の変数一覧とキャッシュ操作の結果
 */
export default async function getLibraryVariablesForUI(
  targetCollection: LibraryVariableCollection,
) {
  // キャッシュを利用して変数を取得
  const result = await getLibraryVariablesWithCache(targetCollection.key)

  // variablesをUI表示用に変換
  const variablesForUI: VariableForUI[] = result.variables.map(v => ({
    id: v.id,
    name: v.name,
    // description: v.description,
    // remote: v.remote,
    variableCollectionId: v.variableCollectionId,
    key: v.key,
    resolvedType: v.resolvedType,
    valuesByMode: v.valuesByMode,
    scopes: v.scopes,
  }))

  // 変数の配列とキャッシュ操作の結果を返す
  return {
    variablesForUI: variablesForUI,
    cacheResult: result.cacheResult,
  }
}
