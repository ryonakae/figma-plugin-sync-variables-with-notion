import { emit, once } from '@create-figma-plugin/utilities'

import useSettings from '@/ui/hooks/useSettings'
import { useTmpSettingsStore } from '@/ui/store'

/**
 * コレクションと変数の操作を行うカスタムフック
 * ローカルおよびライブラリの変数コレクションを取得・管理
 */
export default function useCollection() {
  const { tmpSettings, updateTmpSettings } = useSettings()

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
   * tmpSettingsStoreにキャッシュがある場合はそれを使用し、なければメインプロセスから取得
   * @param targetCollection 対象のライブラリコレクション
   * @returns 変数の配列とキャッシュ結果を含むオブジェクト
   */
  function getLibraryVariables(
    targetCollection: LibraryVariableCollection,
  ): Promise<{
    variablesForUI: VariableForUI[]
    cacheResult: SaveCacheResult
  }> {
    console.log(
      '[useCollection] getLibraryVariables: Getting library variables for',
      targetCollection.name,
    )
    return new Promise((resolve, _reject) => {
      const libraryCollectionCache =
        useTmpSettingsStore.getState().libraryCollectionCache

      // キャッシュチェック
      const cache = libraryCollectionCache[targetCollection.key]
      if (cache) {
        console.log(
          '[useCollection] getLibraryVariables: Using cache for library collection',
          targetCollection.key,
        )
        // キャッシュが存在する場合はそれを使用
        resolve({
          variablesForUI: cache.variables,
          cacheResult: cache.cacheResult,
        })
        return
      }

      console.log(
        '[useCollection] getLibraryVariables: Cache not found, fetching from main process',
        targetCollection.key,
      )
      // キャッシュがない場合はメインプロセスから取得
      once<SetLibraryVariablesFromMain>(
        'SET_LIBRARY_VARIABLES_FROM_MAIN',
        result => {
          console.log(
            '[useCollection] getLibraryVariables: Received variables from main process',
            {
              count: result.variablesForUI.length,
              cacheResult: result.cacheResult,
            },
          )
          // 取得結果をキャッシュに保存
          updateTmpSettings({
            libraryCollectionCache: {
              ...libraryCollectionCache,
              [targetCollection.key]: {
                variables: result.variablesForUI,
                cacheResult: result.cacheResult,
              },
            },
          })
          resolve(result)
        },
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
   * メインプロセスへのキャッシュクリア要求と、UI側のtmpSettingsStoreからのキャッシュ削除を行う
   * @param libraryCollectionKey クリアするライブラリコレクションのキー
   */
  function clearCache(libraryCollectionKey: string) {
    // メインプロセスへキャッシュクリア要求を送信
    emit<clearCacheFromUI>('CLEAR_CACHE_FROM_UI', libraryCollectionKey)

    // tmpSettingsStoreからキャッシュを削除
    const newCache = { ...tmpSettings.libraryCollectionCache }
    delete newCache[libraryCollectionKey]
    updateTmpSettings({
      libraryCollectionCache: newCache,
    })

    console.log(
      `[useCollection] clearCache: Cleared cache for library collection ${libraryCollectionKey}`,
    )
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
