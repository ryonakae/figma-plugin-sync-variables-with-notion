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

  // 変数の配列とキャッシュ操作の結果を返す
  return {
    variablesForUI: result.variablesForUI,
    cacheResult: result.cacheResult,
  }
}
