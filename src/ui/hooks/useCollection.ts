import { emit, once } from '@create-figma-plugin/utilities'

/**
 * コレクションと変数の操作を行うカスタムフック
 * ローカルおよびライブラリの変数コレクションを取得・管理
 */
export default function useCollection() {
  /**
   * ローカルとライブラリのコレクション一覧を取得する関数
   * @returns ローカルコレクションとライブラリコレクションの配列を含むオブジェクト
   */
  function getCollections(): Promise<{
    localCollections: VariableCollectionForUI[]
    libraryCollections: LibraryVariableCollection[]
  }> {
    return new Promise((resolve, _reject) => {
      once<SetCollectionsFromMain>('SET_COLLECTIONS_FROM_MAIN', resolve)
      emit<GetCollectionsFromUI>('GET_COLLECTIONS_FROM_UI')
    })
  }

  /**
   * 指定されたローカルコレクションの変数一覧を取得する関数
   * @param targetCollection 対象のローカルコレクション
   * @returns 変数の配列
   */
  function getLocalVariables(
    targetCollection: VariableCollectionForUI,
  ): Promise<VariableForUI[]> {
    return new Promise((resolve, _reject) => {
      once<SetLocalVariablesFromMain>('SET_LOCAL_VARIABLES_FROM_MAIN', resolve)
      emit<GetLocalVariablesFromUI>(
        'GET_LOCAL_VARIABLES_FROM_UI',
        targetCollection,
      )
    })
  }

  /**
   * 指定されたライブラリコレクションの変数一覧を取得する関数
   * @param targetCollection 対象のライブラリコレクション
   * @returns 変数の配列
   */
  function getLibraryVariables(
    targetCollection: LibraryVariableCollection,
  ): Promise<VariableForUI[]> {
    return new Promise((resolve, _reject) => {
      once<SetLibraryVariablesFromMain>(
        'SET_LIBRARY_VARIABLES_FROM_MAIN',
        resolve,
      )
      emit<GetLibraryVariablesFromUI>(
        'GET_LIBRARY_VARIABLES_FROM_UI',
        targetCollection,
      )
    })
  }

  /**
   * コレクションがローカルコレクションかどうかを判定する型ガード関数
   * @param collection 判定するコレクション
   * @returns ローカルコレクションの場合true
   */
  function isLocalCollection(
    collection: VariableCollectionForUI | LibraryVariableCollection,
  ): collection is VariableCollectionForUI {
    return 'id' in collection && !('libraryName' in collection)
  }

  /**
   * コレクションがライブラリコレクションかどうかを判定する型ガード関数
   * @param collection 判定するコレクション
   * @returns ライブラリコレクションの場合true
   */
  function isLibraryCollection(
    collection: VariableCollectionForUI | LibraryVariableCollection,
  ): collection is LibraryVariableCollection {
    return 'key' in collection
  }

  /**
   * 指定されたライブラリコレクションのキャッシュをクリアする関数
   * @param libraryCollectionKey クリアするライブラリコレクションのキー
   */
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
