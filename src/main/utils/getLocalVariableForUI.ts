export default async function getLocalVariableForUI(
  targetCollection: VariableCollectionForUI,
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
    // Variable[]はVariableForUI[]として扱える
    variablesForUI = localVariables.filter(
      variable => variable.variableCollectionId === collectionId,
    )
  }

  return variablesForUI
}
