import { emit } from '@create-figma-plugin/utilities'

export default async function getLibraryVariables(
  targetCollection: LibraryVariableCollection,
) {
  // Variablesを取得
  const libraryVariables =
    await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      targetCollection.key,
    )

  const variables: VariableForUI[] = []

  // Variableをインポートして、variablesに追加
  for (const libraryVariable of libraryVariables) {
    const importedVariable = await figma.variables.importVariableByKeyAsync(
      libraryVariable.key,
    )
    variables.push({
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
  }

  // variablesをUIに送る
  emit<SetLibraryVariablesFromMain>(
    'SET_LIBRARY_VARIABLES_FROM_MAIN',
    variables,
  )
}
