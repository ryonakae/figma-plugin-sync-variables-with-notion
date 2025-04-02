import { emit } from '@create-figma-plugin/utilities'

export default async function highlightText(targetTextRange: TargetTextRange) {
  console.log('highlightText', targetTextRange)

  // 処理終了
  emit<ProcessFinishFromMain>('PROCESS_FINISH_FROM_MAIN', {
    message: 'Hghlighted applied variables.',
  })
}
