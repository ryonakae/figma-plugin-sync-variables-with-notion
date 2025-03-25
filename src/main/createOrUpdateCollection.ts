import { emit } from '@create-figma-plugin/utilities'

// 対象のコレクションを取得する関数
async function getTargetCollection(collectionName: string) {
  console.log('getTargetCollection', collectionName)

  // ローカルCollectionを取得
  const localCollections =
    await figma.variables.getLocalVariableCollectionsAsync()

  // ローカルCollectionから名前がcollectionNameと同じものを探す
  const sameNameCollection = localCollections.find(
    collection => collection.name === collectionName,
  )

  // すでに同じ名前のCollectionがある場合はそれを使用
  if (sameNameCollection) {
    console.log('use existing collection', sameNameCollection)
    return sameNameCollection
  }
  // ない場合はコレクションを新規作成
  console.log('create new collection', collectionName)
  return figma.variables.createVariableCollection(collectionName)
}

// 言語の配列からmodeを追加・削除する関数
function updateModeFromValuePropertyNames(
  valuePropertyNames: string[],
  targetCollection: VariableCollection,
) {
  console.log('updateModeFromValuePropertyNames', valuePropertyNames)

  // valuePropertyNamesに含まれていないmodeを削除、含まれているものは残す
  // defaultModeは消せないのでスキップ
  const defaultModeId = targetCollection.defaultModeId
  const notExistModes = targetCollection.modes.filter(
    mode => !valuePropertyNames.includes(mode.name),
  )
  for (const mode of notExistModes) {
    if (mode.modeId !== defaultModeId) {
      targetCollection.removeMode(mode.modeId)
    }
  }

  // valuePropertyNamesごとに処理を実行し、modeを追加
  valuePropertyNames.forEach((valuePropertyName, index) => {
    // valuePropertyNameと同じ名前のmodeがすでにある場合は処理をスキップ
    const sameNameMode = targetCollection.modes.find(
      mode => mode.name === valuePropertyName,
    )
    if (sameNameMode) {
      console.log('this mode is already exist', sameNameMode)
      return
    }

    // 1つめの言語の場合はmodeを追加せず、名前を変更する
    if (index === 0) {
      const modeId = targetCollection.modes[0].modeId
      targetCollection.renameMode(modeId, valuePropertyName)
    }
    // それ以外の場合
    else {
      targetCollection.addMode(valuePropertyName)
    }
  })

  // valuePropertyNamesにないmodeがtargetCollectionに既にある場合は削除
  for (const mode of targetCollection.modes) {
    if (!valuePropertyNames.includes(mode.name)) {
      targetCollection.removeMode(mode.modeId)
    }
  }
}

// 対象のVariableを取得もしくは作成する関数
function getOrCreateTargetVariable(
  key: string,
  targetCollection: VariableCollection,
  variablesInTargetCollection: Variable[],
) {
  console.log(
    'getOrCreateTargetVariable',
    key,
    targetCollection,
    variablesInTargetCollection,
  )

  let targetVariable: Variable

  // variablesInTargetCollectionから名前がkeyNameと一致するものを探す
  const sameNameVariable = variablesInTargetCollection.find(
    variable => variable.name === key,
  )

  // 一致するものが無い場合、Variableを作成
  if (!sameNameVariable) {
    targetVariable = figma.variables.createVariable(
      key,
      targetCollection,
      'STRING',
    )
  }
  // 一致するものがある場合はそれを使う
  else {
    targetVariable = sameNameVariable
  }

  // variableのスコープを変更
  targetVariable.scopes = ['TEXT_CONTENT']

  return targetVariable
}

export default async function createOrUpdateCollection(options: {
  collectionName: string
  notionKeyValues: NotionKeyValue[]
  notionValuePropertyNames: string[]
}) {
  console.log('createOrUpdateCollection', options)

  // コレクションを取得
  const targetCollection = await getTargetCollection(options.collectionName)

  // valuePropertyNamesからmodeを追加・削除
  updateModeFromValuePropertyNames(
    options.notionValuePropertyNames,
    targetCollection,
  )

  // すべてのローカルVariablesを取得 (stringのみ)
  const localVariables = await figma.variables.getLocalVariablesAsync('STRING')

  // ローカルVariablesからvariableCollectionIdがtargetCollectionと同じものを探して、variablesInTargetCollectionに格納
  const variablesInTargetCollection = localVariables.filter(
    variable => variable.variableCollectionId === targetCollection.id,
  )
  console.log('variablesInTargetCollection', variablesInTargetCollection)

  // notionKeyValuesの各要素に対して処理を実行
  for (const notionKeyValue of options.notionKeyValues) {
    // 対象のVariableを取得もしくは作成
    const targetVariable = getOrCreateTargetVariable(
      notionKeyValue.key,
      targetCollection,
      variablesInTargetCollection,
    )

    // 各modeに対応するvaluePropertyNameの値をセット
    for (const mode of targetCollection.modes) {
      const valuePropertyName = mode.name
      const value = notionKeyValue.values[valuePropertyName]
      targetVariable.setValueForMode(mode.modeId, value)
    }
  }

  // 処理終了
  emit<ProcessFinishFromMain>('PROCESS_FINISH_FROM_MAIN', {
    message: 'Create or update collection done.',
  })
}
