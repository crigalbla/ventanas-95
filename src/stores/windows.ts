import { writable } from "svelte/store"

type IndividualWindowType = {
  title: string
  windowId?: string
  icon?: string
  hasQuestionButton?: boolean
  canBeHidden?: boolean
  canBeMaximizedOrMinimized?: boolean
  canBeResized?: boolean
  isMinimized?: boolean
  isFullScreen?: boolean
  initialWidth?: number
  initialHeight?: number
  left?: number
  top?: number
  maxWidth?: number
  zIndex?: number
}
export type WindowsType = IndividualWindowType[]

const state: WindowsType = []

export const windows = writable(state)

export const createWindow = ({ windowId = Math.random().toString().replace("0.", ""), ...rest }: IndividualWindowType) => {
	windows.update((ws: WindowsType) => [...ws, { windowId, ...rest }])
}

export const removeWindow = (windowId: string) => windows.update((ws: WindowsType) => ws.filter(w => w.windowId !== windowId))
