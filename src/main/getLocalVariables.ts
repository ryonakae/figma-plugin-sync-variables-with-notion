import { emit } from '@create-figma-plugin/utilities'

export default async function getLocalVariables(
  targetCollection: LocalVariableCollectionForUI,
) {
  // Variablesを定義
  let variables: VariableForUI[] = []

  // Variablesを絞り込むためのコレクションIDを定義
  let collectionId: string | null = null

  // ローカルコレクションを取得
  const localCollections =
    await figma.variables.getLocalVariableCollectionsAsync()

  // ローカルコレクションからtargetCollectionと同じものを探す
  const sameNameCollection = localCollections.find(
    collection => collection.id === targetCollection.id,
  )

  // 同じ名前のローカルコレクションがある場合、コレクションIDを設定
  if (sameNameCollection) {
    collectionId = sameNameCollection.id
  }

  // コレクションIDがある場合、ローカルバリアブルを取得し、コレクションIDが一致するものを配列に追加
  if (collectionId) {
    const localVariables =
      await figma.variables.getLocalVariablesAsync('STRING')
    const taretVariables = localVariables.filter(
      variable => variable.variableCollectionId === collectionId,
    )
    variables = taretVariables.map(variable => ({
      id: variable.id,
      name: variable.name,
      description: variable.description,
      remote: variable.remote,
      variableCollectionId: variable.variableCollectionId,
      key: variable.key,
      resolvedType: variable.resolvedType,
      valuesByMode: variable.valuesByMode,
      scopes: variable.scopes,
    }))
  }

  // Variableの配列をUIに送信
  emit<SetLocalVariablesFromMain>('SET_LOCAL_VARIABLES_FROM_MAIN', variables)
}
