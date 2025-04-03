export default async function getCollections() {
  const localCollections =
    await figma.variables.getLocalVariableCollectionsAsync()
  console.log('localCollections', localCollections)
  const localCollectionsForUI = localCollections.map(collection => ({
    id: collection.id,
    name: collection.name,
    modes: collection.modes,
  }))

  const libraryCollections =
    await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()
  console.log('libraryCollections', libraryCollections)

  return {
    localCollections: localCollectionsForUI,
    libraryCollections,
  }
}
