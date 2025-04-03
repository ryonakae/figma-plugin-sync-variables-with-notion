import {
  loadSettingsAsync,
  saveSettingsAsync,
} from '@create-figma-plugin/utilities'

import { CACHE_KEY } from '@/constants'

export async function saveCache(
  libraryCollectionKey: string,
  variables: Variable[],
) {
  console.log('saveCache: start', libraryCollectionKey, variables)

  const currentCache = await loadSettingsAsync<ClientStorageCache>(
    {},
    CACHE_KEY,
  )
  const newCache = {
    [libraryCollectionKey]: variables.map(
      v =>
        ({
          id: v.id,
          name: v.name,
          description: v.description,
          hiddenFromPublishing: v.hiddenFromPublishing,
          remote: v.remote,
          variableCollectionId: v.variableCollectionId,
          key: v.key,
          resolvedType: v.resolvedType,
          valuesByMode: v.valuesByMode,
          scopes: v.scopes,
        }) as Variable,
    ),
  }

  await saveSettingsAsync<ClientStorageCache>(
    { ...currentCache, ...newCache },
    CACHE_KEY,
  )

  console.log('saveCache: done')
}

export async function loadCache(
  libraryCollectionKey: string,
): Promise<Variable[] | undefined> {
  console.log('loadCache: start', libraryCollectionKey)

  const cache = await loadSettingsAsync<ClientStorageCache>({}, CACHE_KEY)

  console.log('loadCache: done', cache[libraryCollectionKey])

  return cache[libraryCollectionKey]
}

export async function clearCache(libraryCollectionKey: string) {
  console.log('clearCache: start', libraryCollectionKey)

  const currentCache = await loadSettingsAsync<ClientStorageCache>(
    {},
    CACHE_KEY,
  )

  if (!(libraryCollectionKey in currentCache)) {
    // Check if the key actually exists before proceeding
    console.log('clearCache: key not found, nothing to clear')
    return // Or throw an error, depending on desired behavior
  }

  // Create a new cache object excluding the specified key
  const newCache: ClientStorageCache = { ...currentCache }
  delete newCache[libraryCollectionKey]

  // Save the updated cache
  await saveSettingsAsync<ClientStorageCache>(newCache, CACHE_KEY)

  console.log('clearCache: done')
}
