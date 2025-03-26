import { emit } from '@create-figma-plugin/utilities'

export default async function getVariablesInLibraryCollection(
  targetCollection: LibraryVariableCollection,
) {
  // Variablesを取得
  const variables =
    await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
      targetCollection.key,
    )

  const importedVariables: VariableForUI[] = []

  // Variableをインポート
  for (const variable of variables) {
    const importedVariable = await figma.variables.importVariableByKeyAsync(
      variable.key,
    )
    importedVariables.push({
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

  // variableの配列をUIに送る
  emit<SetVariablesInLibraryCollectionFromMain>(
    'SET_VARIABLES_IN_LIBRARY_COLLECTION_FROM_MAIN',
    importedVariables,
  )
}
