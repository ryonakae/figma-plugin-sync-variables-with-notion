export default async function getVariable(
  variable: VariableForUI,
): Promise<Variable | null> {
  // Variable.idから実際のバリアブルを探す
  let targetVariable = await figma.variables.getVariableByIdAsync(variable.id)
  console.log('targetVariable', targetVariable)

  // targetVariableが見つからなかったらimportVariableByKeyAsyncを実行
  if (!targetVariable) {
    targetVariable = await figma.variables.importVariableByKeyAsync(
      variable.key,
    )
    console.log('targetVariable (imported)', targetVariable)
  }

  return targetVariable
}
