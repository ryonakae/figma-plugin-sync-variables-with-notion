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
    importedVariables.map(async v => {
      variablesForUI.push({
        id: v.id,
        name: v.name,
        // description: v.description,
        // remote: v.remote,
        variableCollectionId: v.variableCollectionId,
        key: v.key,
        resolvedType: v.resolvedType,
        valuesByMode: v.valuesByMode,
        scopes: v.scopes,
      })
    }),
  )

  return variablesForUI
}
