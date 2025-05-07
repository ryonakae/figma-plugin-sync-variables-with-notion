export default async function getLocalVariables(
  targetCollection: LocalVariableCollectionForUI,
) {
  // Variablesを定義
  let variablesForUI: VariableForUI[] = []

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
    variablesForUI = taretVariables.map(v => ({
      id: v.id,
      name: v.name,
      // description: v.description,
      // remote: v.remote,
      variableCollectionId: v.variableCollectionId,
      key: v.key,
      resolvedType: v.resolvedType,
      valuesByMode: v.valuesByMode,
      scopes: v.scopes,
    }))
  }

  return variablesForUI
}
