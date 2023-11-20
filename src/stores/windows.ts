import type { ComponentType } from "svelte"
import { writable } from "svelte/store"

export type IndividualWindowType = {
  title: string
  windowId: string
  body?: ComponentType
  icon?: string
  hasQuestionButton?: boolean
  canBeHidden?: boolean
  canBeMaximizedOrMinimized?: boolean
  canBeResized?: boolean
  canBeDraggabled?: boolean
  canLoseFocus?: boolean
  isMinimized?: boolean
  isFullScreen?: boolean
  isFocused?: boolean
  initialWidth?: number
  initialHeight?: number
  left?: number
  top?: number
  maxWidth?: number
  zIndex?: number
  closeCallBack?: () => void
}
export type CreateWindowParams = { windowId?: string } & Omit<IndividualWindowType, "windowId">
export type UpdatableWindowParams = Omit<Partial<IndividualWindowType>, "windowId">
export type WindowsType = IndividualWindowType[]

const state: WindowsType = []

export const windows = writable(state)

export const createWindow = ({ windowId = `w-${Math.random().toString().replace("0.", "")}`, zIndex, isFocused, ...rest }: CreateWindowParams) => {
	windows.update((ws: WindowsType) =>
		[...ws, { windowId, zIndex: zIndex ?? ws.length + 1, isFocused: isFocused ?? true, ...rest }]
	)
}

export const updateWindowParams = (windowId: string, params: UpdatableWindowParams) => {
	windows.update((ws: WindowsType) =>
		ws.map((w: IndividualWindowType) =>
			w.windowId === windowId ? { ...w, ...params } : w
		))
}

export const removeWindow = (windowId: string) => windows.update((ws: WindowsType) => ws.filter(w => w.windowId !== windowId))
