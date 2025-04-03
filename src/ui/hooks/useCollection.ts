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

  function getLocalVariables(
    targetCollection: LocalVariableCollectionForUI,
  ): Promise<VariableForUI[]> {
    return new Promise((resolve, _reject) => {
      once<SetLocalVariablesFromMain>(
        'SET_LOCAL_VARIABLES_FROM_MAIN',
        variables => resolve(variables),
      )
      emit<GetLocalVariablesFromUI>(
        'GET_LOCAL_VARIABLES_FROM_UI',
        targetCollection,
      )
    })
  }

  function getLibraryVariables(
    targetCollection: LibraryVariableCollection,
  ): Promise<VariableForUI[]> {
    return new Promise((resolve, _reject) => {
      once<SetLibraryVariablesFromMain>(
        'SET_LIBRARY_VARIABLES_FROM_MAIN',
        variables => resolve(variables),
      )
      emit<GetLibraryVariablesFromUI>(
        'GET_LIBRARY_VARIABLES_FROM_UI',
        targetCollection,
      )
    })
  }

  function isLocalCollection(
    collection: LocalVariableCollectionForUI | LibraryVariableCollection,
  ): collection is LocalVariableCollectionForUI {
    return 'id' in collection && !('libraryName' in collection)
  }

  function isLibraryCollection(
    collection: LocalVariableCollectionForUI | LibraryVariableCollection,
  ): collection is LibraryVariableCollection {
    return 'key' in collection
  }

  function clearCache(libraryCollectionKey: string) {
    emit<clearCacheFromUI>('CLEAR_CACHE_FROM_UI', libraryCollectionKey)
  }

  return {
    getCollections,
    getLocalVariables,
    getLibraryVariables,
    isLocalCollection,
    isLibraryCollection,
    clearCache,
  }
}
