import { emit } from '@create-figma-plugin/utilities'

import { loadCache, saveCache } from '@/main/cache'

export default async function getLibraryVariables(
  targetCollection: LibraryVariableCollection,
) {
  let importedVariables: Variable[] = []
  const variablesForUI: VariableForUI[] = []

  // キャッシュを検索
  const cachedVariables = await loadCache(targetCollection.key)

  // キャッシュがあればそれを使う
  if (cachedVariables) {
    importedVariables = cachedVariables
  } else {
    // キャッシュがなければ、Variablesを取得してインポート
    const libraryVariables =
      await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
        targetCollection.key,
      )

    await Promise.all(
      libraryVariables.map(async libraryVariable => {
        const importedVariable = await figma.variables.importVariableByKeyAsync(
          libraryVariable.key,
        )
        importedVariables.push(importedVariable)
      }),
    )

    // importedVariablesをキャッシュに保存
    await saveCache(targetCollection.key, importedVariables)
  }

  // importedVariablesの各要素をvariablesForUIに追加
  await Promise.all(
    importedVariables.map(async importedVariable => {
      variablesForUI.push({
        id: importedVariable.id,
        name: importedVariable.name,
        description: importedVariable.description,
        remote: importedVariable.remote,
        variableCollectionId: importedVariable.variableCollectionId,
        key: importedVariable.key,
        resolvedType: importedVariable.resolvedType,
        valuesByMode: importedVariable.valuesByMode,
        scopes: importedVariable.scopes,
      })
    }),
  )

  // variablesForUIをUIに送る
  emit<SetLibraryVariablesFromMain>(
    'SET_LIBRARY_VARIABLES_FROM_MAIN',
    variablesForUI,
  )
}
