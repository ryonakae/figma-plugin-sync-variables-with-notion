import getLibraryVariablesWithCache from '@/main/getLibraryVariablesWithCache'

export default async function getLibraryVariablesForUI(
  targetCollection: LibraryVariableCollection,
) {
  const importedVariables = await getLibraryVariablesWithCache(
    targetCollection.key,
  )

  const variablesForUI: VariableForUI[] = []

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

  return variablesForUI
}
