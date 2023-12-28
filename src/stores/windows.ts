import type { ComponentType } from "svelte"
import { writable } from "svelte/store"
import { INITIAL_WINDOW_Z_INDEX } from "@/constants"
import { generateId } from "@/utils"
import { user, type UserType } from "./user"

export type IndividualWindowType = {
  title: string
  windowId: string
  desktopIconId?: string
  subTitle?: string
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
  width?: number
	height?: number
  minWidth?: number
  minHeight?: number
  oldWidth?: number
  oldHeight?: number
  oldTop?: number
  oldLeft?: number
  closeCallBack?: (props?: unknown) => void | { preventCloseWindow: boolean }
}
export type CreateWindowParams = { windowId?: string } & Omit<IndividualWindowType, "windowId">
export type UpdatableWindowParams = Omit<Partial<IndividualWindowType>, "windowId">
export type WindowsType = IndividualWindowType[]

const state: WindowsType = []

export const windowIdPrefix = "w"

export const windows = writable(state)

export const createWindow = ({ windowId = generateId(windowIdPrefix), zIndex, isFocused, canLoseFocus, canBeDraggabled, canBeResized, ...rest }: CreateWindowParams) => {
	windows.update((ws: WindowsType) =>
		[...ws, {
			windowId,
			zIndex: zIndex ?? INITIAL_WINDOW_Z_INDEX + ws.length + 1,
			isFocused: isFocused ?? true,
			canLoseFocus: canLoseFocus ?? true,
			canBeDraggabled: canBeDraggabled ?? true,
			canBeResized: canBeResized ?? true,
			...rest
		}]
	)
}

export const updateWindowParams = (windowId: string, params: UpdatableWindowParams) => {
	windows.update((ws: WindowsType) =>
		ws.map((w: IndividualWindowType) =>
			w.windowId === windowId ? { ...w, ...params } : w
		))
}

export const removeWindow = (windowId: string) => windows.update((ws: WindowsType) => ws.filter(w => w.windowId !== windowId))

export const loginWindowId = `${windowIdPrefix}-login`

export const createLoginWindow = () => createWindow({
	title: "login.title",
	windowId: loginWindowId,
	hasQuestionButton: true,
	canLoseFocus: false,
	canBeDraggabled: true,
	canBeResized: false,
	initialWidth: 530,
	closeCallBack: () => user.update((u: UserType) => ({ ...u, isLoggedIn: true }))
})

export const createIsTouchableDeviceWindow = () => createWindow({
	title: "ohNo",
	canLoseFocus: false,
	canBeDraggabled: true,
	canBeResized: false,
	maxWidth: 450
})

export const createInitialWindows = () => {
	createWindow({
		title: "1",
		icon: "window",
		initialWidth: 300,
		initialHeight: 100,
		top: 200,
		left: 400,
		isFocused: false,
		canBeHidden: true,
		canBeMaximizedOrMinimized: true
	})
	createWindow({
		title: "2",
		icon: "window",
		initialWidth: 300,
		initialHeight: 100,
		top: 220,
		left: 420,
		isFocused: false,
		canBeHidden: true,
		canBeMaximizedOrMinimized: true
	})
	createWindow({
		title: "3",
		icon: "window",
		initialWidth: 300,
		initialHeight: 100,
		top: 240,
		left: 440,
		isFocused: false,
		canBeHidden: true,
		canBeMaximizedOrMinimized: true
	})
	createWindow({
		title: "4",
		icon: "window",
		initialWidth: 300,
		initialHeight: 100,
		top: 260,
		left: 460,
		isFocused: false,
		canBeHidden: true,
		canBeMaximizedOrMinimized: true
	})
}
