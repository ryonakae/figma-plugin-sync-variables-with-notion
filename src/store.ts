import { create } from 'zustand'

import { DEFAULT_SETTINGS, DEFAULT_TMP_SETTINGS } from '@/constants'

export const useSettingsStore = create<Settings>(_set => DEFAULT_SETTINGS)

export const useTmpSettingsStore = create<TmpSettings>(
  set => DEFAULT_TMP_SETTINGS,
)
