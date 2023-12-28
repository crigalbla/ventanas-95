import { writable } from "svelte/store"
import { DESKTOP_ICON_HEIGHT, DESKTOP_ICON_MARGIN, DESKTOP_ICON_WIDTH } from "@/constants"
import NotepadBody from "@/components/windowBodies/NotepadBody.svelte"
import { availableDimensions, generateId } from "@/utils"
import { createWindow } from "./windows"
import { aboutNotepadText } from "./data"

export type IndividualDesktopIconType = {
  desktopIconId: string,
  icon: string,
  name: string,
  isFocused?: boolean,
  zIndex?: number,
  top?: number,
  left?: number,
	properties?: unknown
  onDblClick: () => void
}
export type CreateDesktopIconParams = { desktopIconId?: string } & Omit<IndividualDesktopIconType, "desktopIconId" | "zIndex">
export type UpdatableDesktopIconParams = Omit<Partial<IndividualDesktopIconType>, "desktopIconId">
export type DesktopIconType = IndividualDesktopIconType[]

const state: DesktopIconType = []

export const desktopIconIdPrefix = "di"

export const desktopIcons = writable(state)

export const createDesktopIcon = ({ desktopIconId = generateId(desktopIconIdPrefix), isFocused, ...rest }: CreateDesktopIconParams) => {
	desktopIcons.update((dis: DesktopIconType) =>
		[...dis, { desktopIconId, zIndex: dis.length + 1, isFocused: isFocused ?? true, ...rest }]
	)
}

export const updateDesktopIconParams = (desktopIconId: string, params: UpdatableDesktopIconParams) => {
	desktopIcons.update((dis: DesktopIconType) =>
		dis.map((di: IndividualDesktopIconType) =>
			di.desktopIconId === desktopIconId ? { ...di, ...params } : di
		))
}

export const removeDesktopIcon = (desktopIconId: string) => desktopIcons.update((dis: DesktopIconType) => dis.filter(di => di.desktopIconId !== desktopIconId))

export const createInitialDesktopIcons = () => {
	createDesktopIcon({
		desktopIconId: "di-my-pc",
		icon: "my-computer-280px",
		name: "desktopIcon.myPc",
		isFocused: false,
		top: DESKTOP_ICON_MARGIN,
		left: DESKTOP_ICON_MARGIN,
		onDblClick: () => window.alert("my-pc")
	})
	createDesktopIcon({
		desktopIconId: "di-recycle-bin",
		icon: "recycle-bin",
		name: "desktopIcon.recycleBin",
		isFocused: false,
		top: (DESKTOP_ICON_MARGIN * 2) + DESKTOP_ICON_HEIGHT,
		left: DESKTOP_ICON_MARGIN,
		onDblClick: () => window.alert("recycle-bin")
	})
	createDesktopIcon({
		desktopIconId: "di-new-folder",
		icon: "open-folder",
		name: "desktopIcon.newFolder",
		isFocused: false,
		top: DESKTOP_ICON_MARGIN,
		left: (DESKTOP_ICON_MARGIN * 2) + DESKTOP_ICON_WIDTH,
		onDblClick: () => window.alert("new-folder")
	})
	setTimeout(() => {
		const { availableHeight, availableWidth } = availableDimensions()
		const desktopIconId = "di-about-notepad"
		createDesktopIcon({
			desktopIconId,
			icon: "notepad",
			name: "desktopIcon.about",
			isFocused: false,
			properties: { text: aboutNotepadText },
			top: availableHeight - DESKTOP_ICON_MARGIN - DESKTOP_ICON_HEIGHT,
			left: availableWidth - DESKTOP_ICON_MARGIN - DESKTOP_ICON_WIDTH,
			onDblClick: () => createWindow({
				title: "desktopIcon.about",
				subTitle: "subTitle.notepad",
				icon: "notepad",
				desktopIconId,
				initialWidth: 300,
				initialHeight: 150,
				canBeHidden: true,
				canBeMaximizedOrMinimized: true,
				body: NotepadBody
			})
		})
	}, 1)
}
