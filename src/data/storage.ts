/**
 * The single module that talks to the device's key/value store (AsyncStorage).
 *
 * Everything persistence-related funnels through here, so swapping the backing
 * store later (SQLite, MMKV, an API) means changing this file + the repository
 * — not the store or the screens.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';

/** Adapter shaped for zustand's `persist` middleware. */
export const deviceStorage: StateStorage = {
  getItem: (name) => AsyncStorage.getItem(name),
  setItem: (name, value) => AsyncStorage.setItem(name, value),
  removeItem: (name) => AsyncStorage.removeItem(name),
};
