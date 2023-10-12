import { writable } from 'svelte/store';

export type WindowsHiddenType = {
  [key: string]: boolean;
}

const state: WindowsHiddenType = {};

export const windowsHidden = writable(state);