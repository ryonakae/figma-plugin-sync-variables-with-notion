/**
 * テキスト要素に一括で変数を適用するモジュール
 * テキストの内容と一致する変数を自動的に適用
 */
import { emit } from '@create-figma-plugin/utilities'

import { applyVariableToTextNode } from '@/main/utils/applyVariableToTextNode'
import filterTextNodes from '@/main/utils/filterTextNodes'
import getLibraryVariablesForUI from '@/main/utils/getLibraryVariablesForUI'
import getLocalVariableForUI from '@/main/utils/getLocalVariableForUI'
import getTextNodes from '@/main/utils/getTextNodes'
import getVariable from '@/main/utils/getVariable'

/**
 * テキスト要素に一括で変数を適用するメイン関数
 * @param options 一括適用オプション（コレクション、テキスト範囲、フィルタリング設定など）
 * @throws テキストノードが見つからない場合、または変数が見つからない場合エラーをスロー
 */
export default async function bulkApplyVariables(options: {
  collection: 'all' | VariableCollectionForUI | LibraryVariableCollection
  targetTextRange: TargetTextRange
  isIncludeComponents: boolean
  isIncludeInstances: boolean
  includeKeyPropertyName?: string
}) {
  // 指定された範囲のテキストノードを取得
  let textNodes = await getTextNodes(options.targetTextRange)

  console.log('[bulkApplyVariables] textNodes', textNodes)

  // フィルタリングオプションが指定されている場合、テキストノードをフィルタリング
  if (!options.isIncludeComponents || !options.isIncludeInstances) {
    // isIncludeComponentsがfalse、またはisIncludeInstancesがfalseの場合、filterTextNodesを実行
    textNodes = await filterTextNodes(textNodes, {
      isIncludeComponents: options.isIncludeComponents,
      isIncludeInstances: options.isIncludeInstances,
    })
  }

  console.log('[bulkApplyVariables] filterd textNodes', textNodes)

  // テキストノードが見つからない場合はエラーをスロー
  if (textNodes.length === 0) {
    throw new Error('No text nodes found.')
  }

  // 対象コレクションの変数を格納する配列
  let variablesInTargetCollection: VariableForUI[] = []

  // コレクションオプションに応じて処理を分岐
  if (options.collection === 'all') {
    // すべてのコレクションから変数を取得する場合
    // すべてのローカルコレクションを取得
    const localCollections =
      await figma.variables.getLocalVariableCollectionsAsync()

    // localCollectionsをループして、ローカルコレクションにあるバリアブルを取得し、
    // variablesInTargetCollectionに追加
    if (localCollections.length > 0) {
      for (const localCollection of localCollections) {
        await getLocalVariableForUI(localCollection)
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
        await getLibraryVariablesForUI(libraryCollection)
          .then(libraryVariables => {
            variablesInTargetCollection = [
              ...variablesInTargetCollection,
              ...libraryVariables.variablesForUI,
            ]
          })
          .catch((error: Error) => {
            throw new Error(error.message)
          })
      }
    }
  }
  // options.collectionがVariableCollectionForUIの場合
  else if ('id' in options.collection) {
    // ローカルコレクションにあるバリアブルを取得し、variablesInTargetCollectionに追加
    const localVariables = await getLocalVariableForUI(
      options.collection,
    ).catch((error: Error) => {
      throw new Error(error.message)
    })
    variablesInTargetCollection = [
      ...variablesInTargetCollection,
      ...localVariables,
    ]
  }
  // options.collectionがLibraryVariableCollectionの場合
  else if ('key' in options.collection) {
    // ライブラリコレクションにあるバリアブルを取得し、variablesInTargetCollectionに追加
    const libraryVariables = await getLibraryVariablesForUI(
      options.collection,
    ).catch((error: Error) => {
      throw new Error(error.message)
    })
    variablesInTargetCollection = [
      ...variablesInTargetCollection,
      ...libraryVariables.variablesForUI,
    ]
  }

  // variablesInTargetCollectionが空なら処理を終了
  if (variablesInTargetCollection.length === 0) {
    throw new Error('No variables found in the collection.')
  }

  // includeKeyPropertyNameが指定されている場合、変数をフィルタリング
  const includeKeyPropertyName = options.includeKeyPropertyName
  if (includeKeyPropertyName) {
    variablesInTargetCollection = variablesInTargetCollection.filter(
      variable => {
        return variable.name.includes(includeKeyPropertyName)
      },
    )
  }

  console.log(
    '[bulkApplyVariables] variablesInTargetCollection',
    variablesInTargetCollection,
  )

  // バリアブルを割り当てたテキストの数をカウントする変数
  let setBoundVariableCount = 0

  // 各テキストノードに対して変数適用処理を実行
  await Promise.all(
    textNodes.map(async textNode => {
      // テキストの文字列を取得し、改行とスペースを正規化
      const characters = textNode.characters.replace(/\s+/g, ' ').trim()

      // テキストノードの内容と一致するバリアブルを検索
      // バリアブルの各モードの値を確認し、文字列型で改行を除去した値が
      // テキストノードの文字列（改行除去済み）と一致するものを探す
      const targetVariableForUI = variablesInTargetCollection.find(variable =>
        Object.values(variable.valuesByMode).some(
          value =>
            typeof value === 'string' &&
            value.replace(/\s+/g, ' ').trim() === characters,
        ),
      )
      console.log(
        '[bulkApplyVariables] targetVariableForUI',
        targetVariableForUI,
      )

      // 一致する変数が見つからない場合はスキップ
      if (!targetVariableForUI) {
        return
      }

      // UI用の変数情報から実際の変数オブジェクトを取得
      const targetVariable = await getVariable(targetVariableForUI)
      console.log('[bulkApplyVariables] targetVariable', targetVariable)

      // まだtargetVariableが見つからなかったらスキップ
      if (!targetVariable) {
        return
      }

      // テキストノードに変数を適用
      await applyVariableToTextNode(textNode, targetVariable)

      // バリアブルを割り当てたテキストの数をカウントアップ
      setBoundVariableCount++
    }),
  )

  // 処理完了メッセージを送信
  emit<ProcessFinishFromMain>('PROCESS_FINISH_FROM_MAIN', {
    message: `Bulk applied variables to ${setBoundVariableCount} text elements.`,
  })
}
