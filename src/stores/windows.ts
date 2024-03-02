import type { ComponentType } from "svelte"
import { writable } from "svelte/store"

import { DEFAULT_FOLDER_WINDOW_HEIGHT, DEFAULT_FOLDER_WINDOW_WIDTH, INITIAL_WINDOW_Z_INDEX, W_BLOCKING } from "@/constants"
import BlockingBody from "@/components/windowBodies/BlockingBody.svelte"
import NotepadBody from "@/components/windowBodies/NotepadBody.svelte"
import FolderBody from "@/components/windowBodies/FolderBody.svelte"
import { generateId, isMobileOrTablet } from "@/utils"

import { getDesktopIconName } from "./desktopIcons"
import { user, type UserType } from "./user"
import LoginBody from "@/components/windowBodies/LoginBody.svelte"
import TouchableDeviceBody from "@/components/windowBodies/TouchableDeviceBody.svelte"

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
  zIndex?: number // from 500 to 999 (only special windows has numbers above 999)
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
	body: LoginBody,
	closeCallBack: () => user.update((u: UserType) => ({ ...u, isLoggedIn: true }))
})

export const createIsTouchableDeviceWindow = () => createWindow({
	title: "ohWow",
	canLoseFocus: false,
	canBeDraggabled: true,
	canBeResized: false,
	minWidth: 300,
	maxWidth: 500,
	body: TouchableDeviceBody
})

export const createDefaultFolderWindow = (desktopIconId: string) => createWindow({
	title: getDesktopIconName(desktopIconId),
	desktopIconId,
	initialWidth: DEFAULT_FOLDER_WINDOW_WIDTH,
	initialHeight: isMobileOrTablet() ? 300 : DEFAULT_FOLDER_WINDOW_HEIGHT,
	canBeHidden: true,
	canBeMaximizedOrMinimized: true,
	minWidth: 360,
	minHeight: 200,
	body: FolderBody
})

export const createDefaultNotepadWindow = (desktopIconId: string) => createWindow({
	title: getDesktopIconName(desktopIconId),
	subTitle: "subTitle.notepad",
	desktopIconId,
	initialWidth: 350,
	initialHeight: 200,
	minWidth: 250,
	minHeight: 150,
	canBeHidden: true,
	canBeMaximizedOrMinimized: true,
	body: NotepadBody
})

export const createBlockingWindow = (desktopIconId: string, title: string) => {
	const blockingWindow = document.querySelector(`#${W_BLOCKING}`)
	!blockingWindow && createWindow({
		title,
		windowId: W_BLOCKING,
		desktopIconId,
		canBeResized: false,
		canLoseFocus: false,
		maxWidth: 600,
		body: BlockingBody
	})
}
