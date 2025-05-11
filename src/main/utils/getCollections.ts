export default async function getCollections() {
  const localCollections =
    await figma.variables.getLocalVariableCollectionsAsync()
  console.log('[getCollections] localCollections', localCollections)

  const localCollectionsForUI: VariableCollectionForUI[] = localCollections.map(
    collection => ({
      id: collection.id,
      name: collection.name,
      modes: collection.modes,
    }),
  )

  const libraryCollections =
    await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()
  console.log('[getCollections] libraryCollections', libraryCollections)

  return {
    localCollections: localCollectionsForUI,
    libraryCollections,
  }
}
