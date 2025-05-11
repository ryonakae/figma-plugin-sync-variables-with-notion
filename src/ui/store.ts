/**
 * アプリケーションの状態管理
 * Zustandを使用した設定と一時データの状態管理を行う
 */
import { create } from 'zustand'

import {
  DEFAULT_CLIENT_STORAGE_SETTINGS,
  DEFAULT_DOCUMENT_SETTINGS,
  DEFAULT_TMP_SETTINGS,
} from '@/constants'

// 永続的な設定のデフォルト値
const defaultSettings: Settings = {
  ...DEFAULT_DOCUMENT_SETTINGS,
  ...DEFAULT_CLIENT_STORAGE_SETTINGS,
}

/**
 * 永続的な設定を管理するZustandストア
 * Figmaに保存され、プラグイン再起動時にも維持される
 */
export const useSettingsStore = create<Settings>(_set => defaultSettings)

/**
 * 一時的な設定を管理するZustandストア
 * セッション中のみ有効で、プラグイン再起動時にはリセットされる
 */
export const useTmpSettingsStore = create<TmpSettings>(
  set => DEFAULT_TMP_SETTINGS,
)
