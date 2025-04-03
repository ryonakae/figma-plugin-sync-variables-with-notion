import { emit } from '@create-figma-plugin/utilities'

export default function handleError(error: Error) {
  emit<ProcessFinishFromMain>('PROCESS_FINISH_FROM_MAIN', {
    message: error.message,
    options: {
      error: true,
    },
  })
}
