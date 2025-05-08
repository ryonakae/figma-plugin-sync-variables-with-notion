import { create } from 'zustand'

import {
  DEFAULT_CLIENT_STORAGE_SETTINGS,
  DEFAULT_DOCUMENT_SETTINGS,
  DEFAULT_TMP_SETTINGS,
} from '@/constants'

const defaultSettings: Settings = {
  ...DEFAULT_DOCUMENT_SETTINGS,
  ...DEFAULT_CLIENT_STORAGE_SETTINGS,
}
export const useSettingsStore = create<Settings>(_set => defaultSettings)

export const useTmpSettingsStore = create<TmpSettings>(
  set => DEFAULT_TMP_SETTINGS,
)
