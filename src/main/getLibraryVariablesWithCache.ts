import { loadCache, saveCache } from '@/main/cache'

export default async function getLibraryVariablesWithCache(
  libraryCollectionKey: string,
): Promise<Variable[]> {
  // キャッシュを検索
  const cachedVariables = await loadCache(libraryCollectionKey)

  // キャッシュがあればそれを使う
  if (cachedVariables) {
    console.log('Cache hit for:', libraryCollectionKey)
    return cachedVariables
  }

  // キャッシュがなければ、Variablesを取得してインポート
  console.log('Cache miss for:', libraryCollectionKey, '. Fetching from API...')
  const libraryVariables =
    await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      libraryCollectionKey,
    )

  const importedVariables: Variable[] = []
  await Promise.all(
    libraryVariables.map(async libraryVariable => {
      const importedVariable = await figma.variables.importVariableByKeyAsync(
        libraryVariable.key,
      )
      importedVariables.push(importedVariable)
    }),
  )

  // importedVariablesをキャッシュに保存
  await saveCache(libraryCollectionKey, importedVariables)
  console.log('Saved fetched variables to cache for:', libraryCollectionKey)

  return importedVariables
}
