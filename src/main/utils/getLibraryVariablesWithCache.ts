/**
 * キャッシュを利用してライブラリ変数を取得するユーティリティモジュール
 * パフォーマンス向上のため、一度取得した変数をキャッシュし再利用
 */
import { loadCache, saveCache } from '@/main/cache'

/**
 * キャッシュを利用してライブラリの変数を取得する関数
 * キャッシュにある場合はキャッシュから、ない場合はAPIから取得して
 * キャッシュに保存
 *
 * @param libraryCollectionKey ライブラリコレクションのキー
 * @returns 変数の配列
 */
export default async function getLibraryVariablesWithCache(
  libraryCollectionKey: string,
): Promise<Variable[]> {
  // キャッシュから変数を検索
  const cachedVariables = await loadCache(libraryCollectionKey)

  // キャッシュがあればそれを使用（キャッシュヒット）
  if (cachedVariables) {
    console.log('Cache hit for:', libraryCollectionKey)
    return cachedVariables
  }

  // キャッシュがなければAPIから取得（キャッシュミス）
  console.log('Cache miss for:', libraryCollectionKey, '. Fetching from API...')

  // ライブラリコレクションから変数リストを取得
  const libraryVariables =
    await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      libraryCollectionKey,
    )
  console.log('Fetched variables:', libraryVariables)

  // ライブラリの変数をインポート
  const importedVariables: Variable[] = []
  await Promise.all(
    libraryVariables.map(async libraryVariable => {
      const importedVariable = await figma.variables.importVariableByKeyAsync(
        libraryVariable.key,
      )
      importedVariables.push(importedVariable)
    }),
  )
  console.log('Imported variables:', importedVariables)

  // インポートした変数をキャッシュに保存
  await saveCache(libraryCollectionKey, importedVariables)
  console.log('Saved fetched variables to cache for:', libraryCollectionKey)

  return importedVariables
}
