import { emit } from '@create-figma-plugin/utilities'

import { applyVariableToTextNode } from '@/main/applyVariableToTextNode'
import getLibraryVariablesWithCache from '@/main/getLibraryVariablesWithCache'
import { filterTextNodes, getTextNodes } from '@/main/util'

// ローカルコレクションにあるバリアブルを取得する関数
async function getLocalVariables(
  collection: LocalVariableCollectionForUI,
): Promise<Variable[]> {
  // ローカルCollectionを取得
  const localCollections =
    await figma.variables.getLocalVariableCollectionsAsync()

  // コレクションがなかったらエラーを投げて処理を終了
  if (localCollections.length === 0) {
    throw new Error('No local collections found.')
  }

  // localCollectionsからidがoptions.collectionと同じものを探してtargetCollectionに設定
  const targetCollection = localCollections.find(
    localCollection => localCollection.id === collection.id,
  )

  // targetCollectionが見つからなかったらエラーを投げて処理を終了
  if (!targetCollection) {
    throw new Error('Target local collection not found.')
  }

  // すべてのローカルVariablesを取得 (stringのみ)
  const localVariables = await figma.variables.getLocalVariablesAsync('STRING')

  // ローカルVariablesがなかったらエラーを投げて処理を終了
  if (localVariables.length === 0) {
    throw new Error('No local variables found.')
  }

  // ローカルVariablesからvariableCollectionIdがtargetCollectionと同じものを探して、配列に格納
  const variables = localVariables.filter(
    variable =>
      variable.variableCollectionId ===
      (targetCollection as VariableCollection).id,
  )

  return variables
}

// ライブラリコレクションにあるバリアブルを取得する関数
async function getLibraryVariables(
  collection: LibraryVariableCollection,
): Promise<Variable[]> {
  let importedVariables = await getLibraryVariablesWithCache(collection.key)

  // importedVariablesを、resolvedTypeがstringのもの &
  // scopeにTEXT_CONTENTが含まれるのものだけに絞り込む
  importedVariables = importedVariables.filter(
    variable =>
      variable.resolvedType === 'STRING' &&
      (variable.scopes.includes('ALL_SCOPES') ||
        variable.scopes.includes('TEXT_CONTENT')),
  )

  // バリアブルがなかったらエラーを投げて処理を終了
  if (importedVariables.length === 0) {
    throw new Error('No variables found.')
  }

  return importedVariables
}

// メイン関数
export default async function bulkApplyVariables(options: {
  collection: 'all' | LocalVariableCollectionForUI | LibraryVariableCollection
  targetTextRange: TargetTextRange
  isIncludeComponents: boolean
  isIncludeInstances: boolean
  includeKeyPropertyName?: string
}) {
  // textNodeを取得
  let textNodes = await getTextNodes(options.targetTextRange)

  console.log('textNodes', textNodes)

  if (!options.isIncludeComponents || !options.isIncludeInstances) {
    // isIncludeComponentsがfalse、またはisIncludeInstancesがfalseの場合、filterTextNodesを実行
    textNodes = await filterTextNodes(textNodes, {
      isIncludeComponents: options.isIncludeComponents,
      isIncludeInstances: options.isIncludeInstances,
    })
  }

  console.log('filterd textNodes', textNodes)

  // textNodeが1つもなかったら処理を終了
  if (textNodes.length === 0) {
    throw new Error('No text nodes found.')
  }

  // variablesInTargetCollectionを定義
  let variablesInTargetCollection: Variable[] = []

  if (options.collection === 'all') {
    // options.collectionに応じてバリアブルを取得
    // options.collectionが'all'の場合
    // すべてのローカルコレクションを取得
    const localCollections =
      await figma.variables.getLocalVariableCollectionsAsync()

    // localCollectionsをループして、ローカルコレクションにあるバリアブルを取得し、
    // variablesInTargetCollectionに追加
    if (localCollections.length > 0) {
      for (const localCollection of localCollections) {
        await getLocalVariables(localCollection)
          .then(localVariables => {
            variablesInTargetCollection = [
              ...variablesInTargetCollection,
              ...localVariables,
            ]
          })
          .catch((error: Error) => {
            throw new Error(error.message)
          })
      }
    }

    // すべてのライブラリコレクションを取得
    const libraryCollections =
      await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()

    // libraryCollectionsをループして、ライブラリコレクションにあるバリアブルを取得し、
    // variablesInTargetCollectionに追加
    if (libraryCollections.length > 0) {
      for (const libraryCollection of libraryCollections) {
        await getLibraryVariables(libraryCollection)
          .then(libraryVariables => {
            variablesInTargetCollection = [
              ...variablesInTargetCollection,
              ...libraryVariables,
            ]
          })
          .catch((error: Error) => {
            throw new Error(error.message)
          })
      }
    }
  }
  // options.collectionがLocalVariableCollectionForUIの場合
  else if ('id' in options.collection) {
    // ローカルコレクションにあるバリアブルを取得し、variablesInTargetCollectionに追加
    const localVariables = await getLocalVariables(options.collection).catch(
      (error: Error) => {
        throw new Error(error.message)
      },
    )
    variablesInTargetCollection = [
      ...variablesInTargetCollection,
      ...localVariables,
    ]
  }
  // options.collectionがLibraryVariableCollectionの場合
  else if ('key' in options.collection) {
    // ライブラリコレクションにあるバリアブルを取得し、variablesInTargetCollectionに追加
    const libraryVariables = await getLibraryVariables(
      options.collection,
    ).catch((error: Error) => {
      throw new Error(error.message)
    })
    variablesInTargetCollection = [
      ...variablesInTargetCollection,
      ...libraryVariables,
    ]
  }

  // variablesInTargetCollectionが空なら処理を終了
  if (variablesInTargetCollection.length === 0) {
    throw new Error('No variables found in the collection.')
  }

  // includeKeyPropertyNameが指定されている場合、variablesInTargetCollectionをフィルタリング
  const includeKeyPropertyName = options.includeKeyPropertyName
  if (includeKeyPropertyName) {
    variablesInTargetCollection = variablesInTargetCollection.filter(
      variable => {
        return variable.name.includes(includeKeyPropertyName)
      },
    )
  }

  console.log('variablesInTargetCollection', variablesInTargetCollection)

  // バリアブルを割り当てたテキストの数をカウントする変数
  let setBoundVariableCount = 0

  // textNodeごとに処理を実行
  await Promise.all(
    textNodes.map(async textNode => {
      // テキストの文字列を取得し、改行を除去
      const characters = textNode.characters.replace(/\s+/g, ' ').trim()

      // テキストノードの内容と一致するバリアブルを検索
      // バリアブルの各モードの値を確認し、文字列型で改行を除去した値が
      // テキストノードの文字列（改行除去済み）と一致するものを探す
      const targetVariable = variablesInTargetCollection.find(variable =>
        Object.values(variable.valuesByMode).some(
          value =>
            typeof value === 'string' &&
            value.replace(/\s+/g, ' ').trim() === characters,
        ),
      )
      console.log('targetVariable', targetVariable)

      // targetVariableが見つからなかったら処理をスキップ
      if (!targetVariable) {
        return
      }

      await applyVariableToTextNode(textNode, targetVariable)

      // バリアブルを割り当てたテキストの数をカウントアップ
      setBoundVariableCount++
    }),
  )

  // 処理終了
  emit<ProcessFinishFromMain>('PROCESS_FINISH_FROM_MAIN', {
    message: `Bulk applied variables to ${setBoundVariableCount} text elements.`,
  })
}
