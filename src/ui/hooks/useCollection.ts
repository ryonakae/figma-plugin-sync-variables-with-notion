import { emit, once } from '@create-figma-plugin/utilities'

export default function useCollection() {
  function getCollections(): Promise<{
    localCollections: LocalVariableCollectionForUI[]
    libraryCollections: LibraryVariableCollection[]
  }> {
    return new Promise((resolve, reject) => {
      once<SetCollectionsFromMain>('SET_COLLECTIONS_FROM_MAIN', resolve)
      emit<GetCollectionsFromUI>('GET_COLLECTIONS_FROM_UI')
    })
  }

  return { getCollections }
}
