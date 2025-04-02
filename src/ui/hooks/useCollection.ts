import { emit, once } from '@create-figma-plugin/utilities'

import useSettings from '@/ui/hooks/useSettings'

export default function useCollection() {
  const { updateTmpSettings } = useSettings()

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
      updateTmpSettings({
        loadingVariables: true,
      })

      once<SetLibraryVariablesFromMain>(
        'SET_LIBRARY_VARIABLES_FROM_MAIN',
        variables => resolve(variables),
      )
      emit<GetLibraryVariablesFromUI>(
        'GET_LIBRARY_VARIABLES_FROM_UI',
        targetCollection,
      )

      updateTmpSettings({
        loadingVariables: false,
      })
    })
  }

  function isLocalVariableCollection(
    collection: LocalVariableCollectionForUI | LibraryVariableCollection,
  ): collection is LocalVariableCollectionForUI {
    // LocalVariableCollectionForUIには'id'があり、LibraryVariableCollectionには'key'がある
    return 'id' in collection && !('libraryName' in collection)
  }

  return {
    getCollections,
    getLocalVariables,
    getLibraryVariables,
    isLocalVariableCollection,
  }
}
