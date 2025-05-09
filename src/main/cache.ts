/**
 * キャッシュ機能を提供するモジュール
 * ライブラリ変数を取得する際のパフォーマンス向上のためのキャッシュ機能を提供
 */
import {
  loadSettingsAsync,
  saveSettingsAsync,
} from '@create-figma-plugin/utilities'

import { CACHE_KEY } from '@/constants'

/**
 * キャッシュにライブラリ変数を保存する関数
 * @param libraryCollectionKey ライブラリコレクションのキー
 * @param variables 保存する変数の配列
 * @returns キャッシュ保存の結果
 */
export async function saveCache(
  libraryCollectionKey: string,
  variablesForUI: VariableForUI[],
): Promise<SaveCacheResult> {
  console.log('[cache] saveCache: start', libraryCollectionKey, variablesForUI)

  // 現在のキャッシュを読み込む
  const currentCache = await loadSettingsAsync<ClientStorageCache>(
    {},
    CACHE_KEY,
  )
  console.log('[cache] currentCache', currentCache)

  // 新しいキャッシュデータを作成（必要な属性のみを抽出して保存）
  // 配列を新しく作成しないと、idのみしか保存されないため
  const newCache = {
    [libraryCollectionKey]: variablesForUI.map(
      v =>
        ({
          id: v.id,
          name: v.name,
          // description: v.description,
          // hiddenFromPublishing: v.hiddenFromPublishing,
          // remote: v.remote,
          variableCollectionId: v.variableCollectionId,
          key: v.key,
          resolvedType: v.resolvedType,
          valuesByMode: v.valuesByMode,
          scopes: v.scopes,
        }) as Variable,
    ),
  }
  console.log('[cache] newCache', newCache)

  try {
    // 現在のキャッシュと新しいキャッシュをマージして保存
    await saveSettingsAsync<ClientStorageCache>(
      { ...currentCache, ...newCache },
      CACHE_KEY,
    )
    console.log('[cache] saveCache: success')
    return { success: true }
  } catch (error) {
    console.error('[cache] saveCache: failed to save settings', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * キャッシュからライブラリ変数を読み込む関数
 * @param libraryCollectionKey ライブラリコレクションのキー
 * @returns キャッシュされた変数の配列、またはundefined（キャッシュがない場合）
 */
export async function loadCache(
  libraryCollectionKey: string,
): Promise<VariableForUI[] | undefined> {
  console.log('[cache] loadCache: start', libraryCollectionKey)

  // キャッシュを読み込む
  const cache = await loadSettingsAsync<ClientStorageCache>({}, CACHE_KEY)

  console.log('[cache] loadCache: done', cache[libraryCollectionKey])

  return cache[libraryCollectionKey]
}

/**
 * 指定したライブラリコレクションのキャッシュをクリアする関数
 * @param libraryCollectionKey クリアするライブラリコレクションのキー
 */
export async function clearCache(libraryCollectionKey: string) {
  console.log('[cache] clearCache: start', libraryCollectionKey)

  // 現在のキャッシュを読み込む
  const currentCache = await loadSettingsAsync<ClientStorageCache>(
    {},
    CACHE_KEY,
  )

  // 指定されたキーが存在するか確認
  if (!(libraryCollectionKey in currentCache)) {
    // キーが存在しない場合は処理を終了
    console.log('[cache] clearCache: key not found, nothing to clear')
    return // または、必要に応じてエラーをスロー
  }

  // 指定されたキーを除いた新しいキャッシュオブジェクトを作成
  const newCache: ClientStorageCache = { ...currentCache }
  delete newCache[libraryCollectionKey]

  // 更新されたキャッシュを保存
  await saveSettingsAsync<ClientStorageCache>(newCache, CACHE_KEY)

  console.log('[cache] clearCache: done')
}
