import { emit, once } from '@create-figma-plugin/utilities'

export default function useCollection() {
  function getCollections(): Promise<{
    localCollections: LocalVariableCollectionForUI[]
    libraryCollections: LibraryVariableCollection[]
  }> {
    return new Promise((resolve, _reject) => {
      once<SetCollectionsFromMain>('SET_COLLECTIONS_FROM_MAIN', resolve)
      emit<GetCollectionsFromUI>('GET_COLLECTIONS_FROM_UI')
    })
  }

  function isLocalVariableCollection(
    collection: LocalVariableCollectionForUI | LibraryVariableCollection,
  ): collection is LocalVariableCollectionForUI {
    // LocalVariableCollectionForUIには'id'があり、LibraryVariableCollectionには'key'がある
    return 'id' in collection && !('libraryName' in collection)
  }

  return { getCollections, isLocalVariableCollection }
}
