/**
 * Figma変数とNotionを同期するためのプラグインのメインファイル
 * イベントハンドラの登録とUIの初期化を行う
 */
import {
  emit,
  on,
  setRelaunchButton,
  showUI,
} from '@create-figma-plugin/utilities'

import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@/constants'
import applyVariable from '@/main/applyVariable'
import bulkApplyVariables from '@/main/bulkApplyVariables'
import { clearCache } from '@/main/cache'
import handleError from '@/main/handleError'
import highlightText from '@/main/highlightText'
import { loadSettings, saveSettings } from '@/main/settings'
import syncCollection from '@/main/syncCollection'

import getCollections from '@/main/utils/getCollections'
import getLibraryVariablesForUI from '@/main/utils/getLibraryVariablesForUI'
import getLocalVariableForUI from '@/main/utils/getLocalVariableForUI'

/**
 * プラグインのエントリーポイント
 * UIの表示とイベントハンドラの登録を行う
 */
export default async function () {
  // set relaunch button
  setRelaunchButton(figma.root, 'open')

  // show ui
  showUI({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  })

  // イベントハンドラの登録
  /**
   * 設定の保存イベントハンドラ
   * UI側からの設定保存要求を処理
   */
  on<SaveSettingsFromUI>('SAVE_SETTINGS_FROM_UI', saveSettings)

  /**
   * 通知イベントハンドラ
   * UI側からの通知要求を処理し、Figmaの通知機能を使ってユーザーに通知
   */
  on<NotifyFromUI>('NOTIFY_FROM_UI', options => {
    figma.notify(options.message || 'Something went wrong', options.options)
  })

  /**
   * ウィンドウサイズ変更イベントハンドラ
   * UI側からのウィンドウサイズ変更要求を処理
   */
  on<ResizeWindowFromUI>('RESIZE_WINDOW_FROM_UI', windowSize => {
    figma.ui.resize(windowSize.width, windowSize.height)
  })

  /**
   * コレクション同期イベントハンドラ
   * UI側からのコレクション同期要求を処理し、結果を通知
   */
  on<SyncCollectionFromUI>('SYNC_COLLECTION_FROM_UI', async options => {
    await syncCollection(options).catch((error: Error) => {
      handleError(error)
      throw new Error(error.message)
    })

    emit<ProcessFinishFromMain>('PROCESS_FINISH_FROM_MAIN', {
      message: 'Collection synced successfully.',
    })
  })

  /**
   * コレクション取得イベントハンドラ
   * UI側からのコレクション取得要求を処理し、結果をUI側に送信
   */
  on<GetCollectionsFromUI>('GET_COLLECTIONS_FROM_UI', async () => {
    const collections = await getCollections().catch((error: Error) => {
      handleError(error)
      throw new Error(error.message)
    })

    emit<SetCollectionsFromMain>('SET_COLLECTIONS_FROM_MAIN', collections)
  })

  /**
   * ライブラリ変数取得イベントハンドラ
   * UI側からのライブラリ変数取得要求を処理し、結果をUI側に送信
   * @param targetCollection 対象のコレクション
   */
  on<GetLibraryVariablesFromUI>(
    'GET_LIBRARY_VARIABLES_FROM_UI',
    async targetCollection => {
      const variablesForUI = await getLibraryVariablesForUI(
        targetCollection,
      ).catch((error: Error) => {
        handleError(error)
        throw new Error(error.message)
      })

      emit<SetLibraryVariablesFromMain>(
        'SET_LIBRARY_VARIABLES_FROM_MAIN',
        variablesForUI,
      )
    },
  )

  /**
   * ローカル変数取得イベントハンドラ
   * UI側からのローカル変数取得要求を処理し、結果をUI側に送信
   * @param targetCollection 対象のコレクション
   */
  on<GetLocalVariablesFromUI>(
    'GET_LOCAL_VARIABLES_FROM_UI',
    async targetCollection => {
      const variablesForUI = await getLocalVariableForUI(
        targetCollection,
      ).catch((error: Error) => {
        handleError(error)
        throw new Error(error.message)
      })

      emit<SetLocalVariablesFromMain>(
        'SET_LOCAL_VARIABLES_FROM_MAIN',
        variablesForUI,
      )
    },
  )

  /**
   * 変数適用イベントハンドラ
   * UI側からの変数適用要求を処理し、結果を通知
   * @param variable 適用する変数
   */
  on<ApplyVariableFromUI>('APPLY_VARIABLE_FROM_UI', async variable => {
    await applyVariable(variable).catch((error: Error) => {
      handleError(error)
      throw new Error(error.message)
    })

    emit<ProcessFinishFromMain>('PROCESS_FINISH_FROM_MAIN', {
      message: 'Variable applied successfully.',
    })
  })

  /**
   * 一括変数適用イベントハンドラ
   * UI側からの一括変数適用要求を処理
   * @param options 一括適用オプション
   */
  on<BulkApplyVariablesFromUI>(
    'BULK_APPLY_VARIABLES_FROM_UI',
    async options => {
      await bulkApplyVariables(options).catch((error: Error) => {
        handleError(error)
        throw new Error(error.message)
      })
    },
  )

  /**
   * テキストハイライトイベントハンドラ
   * UI側からのテキストハイライト要求を処理し、結果を通知
   * @param targetTextRange ハイライト対象のテキスト範囲
   */
  on<HighlightTextFromUI>('HIGHLIGHT_TEXT_FROM_UI', async targetTextRange => {
    await highlightText(targetTextRange).catch((error: Error) => {
      handleError(error)
      throw new Error(error.message)
    })

    emit<ProcessFinishFromMain>('PROCESS_FINISH_FROM_MAIN', {
      message: 'Highlighted applied variables.',
    })
  })

  /**
   * キャッシュクリアイベントハンドラ
   * UI側からのキャッシュクリア要求を処理
   */
  on<clearCacheFromUI>('CLEAR_CACHE_FROM_UI', clearCache)

  /**
   * 設定読み込み処理
   * UI側に設定を送信する前に少し遅延させることでエラーを回避
   */
  setTimeout(() => {
    loadSettings()
  }, 100)
}
