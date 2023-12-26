import { writable } from "svelte/store"

export type SectionInRightClickMenuType = string[]

export type RightClickMenuType = {
  sections: SectionInRightClickMenuType[],
  top: number,
  left: number,
  zIndex?: number
}

const state: RightClickMenuType = undefined!

export const rightClickMenu = writable(state)

export const removeRightClickMenu = () => rightClickMenu.set(undefined!)
