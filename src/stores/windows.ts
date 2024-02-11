import type { ComponentType } from "svelte"
import { writable } from "svelte/store"

import NameAlreadyInUse from "@/components/windowBodies/NameAlreadyInUse.svelte"
import NotepadBody from "@/components/windowBodies/NotepadBody.svelte"
import FolderBody from "@/components/windowBodies/FolderBody.svelte"
import { INITIAL_WINDOW_Z_INDEX, W_BLOCKING } from "@/constants"
import { generateId } from "@/utils"

import { getDesktopIconName } from "./desktopIcons"
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
	isBlocking?: boolean
  initialWidth?: number
  initialHeight?: number
  left?: number
  top?: number
  maxWidth?: number
  zIndex?: number // from 500 to 999 (only specil windows has numbers above 999)
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
	minWidth: 300,
	maxWidth: 450
})

export const createDefaultFolderWindow = (desktopIconId: string) => createWindow({
	title: getDesktopIconName(desktopIconId),
	desktopIconId,
	initialWidth: 600,
	initialHeight: 400,
	canBeHidden: true,
	canBeMaximizedOrMinimized: true,
	body: FolderBody
})

export const createDefaultNotepadWindow = (desktopIconId: string) => createWindow({
	title: getDesktopIconName(desktopIconId),
	subTitle: "subTitle.notepad",
	desktopIconId,
	initialWidth: 300,
	initialHeight: 150,
	canBeHidden: true,
	canBeMaximizedOrMinimized: true,
	body: NotepadBody
})

export const createNameAlreadyInUseWindow = (desktopIconId: string, isByRename?: boolean) => {
	const blockingWindow = document.querySelector(`#${W_BLOCKING}`)
	!blockingWindow && createWindow({
		title: isByRename ? "nameAlreadyInUse.title" : "nameAlreadyInUseInNewRoute.title",
		windowId: W_BLOCKING,
		desktopIconId,
		isBlocking: true,
		canBeResized: false,
		canLoseFocus: false,
		maxWidth: 600,
		body: NameAlreadyInUse
	})
}
