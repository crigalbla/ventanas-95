import { DESKTOP_ICON_HEIGHT, DESKTOP_ICON_MARGIN, DESKTOP_ICON_WIDTH, DI_ABOUT_NOTEPAD, DI_MY_PC, DI_FIRST_FOLDER, DI_RECYCLE_BIN, DESKTOP_ROUTE, RECYCLE_BIN_NAME, MY_PC_NAME, RECYCLE_BIN_ICON, FULL_RECYCLE_BIN_ICON, RECYCLE_BIN_ROUTE, NOTEPAD_ICON } from "@/constants"
import NotepadBody from "@/components/windowBodies/NotepadBody.svelte"
import FolderBody from "@/components/windowBodies/FolderBody.svelte"
import { availableDimensions, generateId } from "@/utils"
import { createWindow } from "./windows"
import { writable } from "svelte/store"

export type IndividualDesktopIconType = {
  desktopIconId: string,
  icon: string,
  name: string,
	route: string,
	canBeDropped?: boolean
  isFocused?: boolean,
	isEditingName?: boolean,
  zIndex?: number, // from 1 to 499
  top?: number,
  left?: number,
	properties?: unknown
  onDblClick: () => void
}
export type CreateDesktopIconParams = { desktopIconId?: string } & Omit<IndividualDesktopIconType, "desktopIconId" | "zIndex">
export type UpdatableDesktopIconParams = Omit<Partial<IndividualDesktopIconType>, "desktopIconId">
export type DesktopIconsType = IndividualDesktopIconType[]

const state: DesktopIconsType = []

export const desktopIconIdPrefix = "di"

export const desktopIcons = writable(state)

const updateRecycleBinIcon = () => {
	desktopIcons.update((dis: DesktopIconsType) => {
		const isRecycleBinFull = dis.some(di => di.route === RECYCLE_BIN_ROUTE)

		return dis.map((di: IndividualDesktopIconType) => {
			if (isRecycleBinFull) {
				if (di.icon === RECYCLE_BIN_ICON) return { ...di, icon: FULL_RECYCLE_BIN_ICON }
			} else if (di.icon === FULL_RECYCLE_BIN_ICON) return { ...di, icon: RECYCLE_BIN_ICON }

			return di
		})
	})
}

export const createDesktopIcon = ({ desktopIconId = generateId(desktopIconIdPrefix), isFocused, ...rest }: CreateDesktopIconParams) => {
	desktopIcons.update((dis: DesktopIconsType) =>
		[...dis, { desktopIconId, zIndex: dis.length + 1, isFocused: isFocused ?? true, ...rest }]
	)
}

export const updateDesktopIconParams = (desktopIconId: string, params: UpdatableDesktopIconParams) => {
	desktopIcons.update((dis: DesktopIconsType) => {
		const isChangingNameOrRoute = Boolean(params.name ?? params.route)
		let oldDesktopIcon: IndividualDesktopIconType
		let oldRoute: string
		if (isChangingNameOrRoute) {
			oldDesktopIcon = dis.find(di => di.desktopIconId === desktopIconId) as IndividualDesktopIconType
			oldRoute = `${oldDesktopIcon.route}\\${oldDesktopIcon.name}`
		}

		return dis.map((di: IndividualDesktopIconType) => {
			// Update routes of files inside of the folder that will change the name o will be moved
			if (isChangingNameOrRoute && di.route.includes(oldRoute) && di.desktopIconId !== desktopIconId) {
				const newRoute = params.name
					? `${oldDesktopIcon.route}\\${params.name}`
					: `${params.route}\\${oldDesktopIcon.name}`
				return { ...di, route: di.route.replace(oldRoute, newRoute) }
			}

			 // Update in normal cases
			return di.desktopIconId === desktopIconId ? { ...di, ...params } : di
		})
	})
}

export const removeDesktopIcon = (desktopIconId: string) => {
	desktopIcons.update((dis: DesktopIconsType) => {
		const desktopIconWillBeRemoved = dis.find(di => di.desktopIconId === desktopIconId) as IndividualDesktopIconType
		const routeWillBeRemoved = `${desktopIconWillBeRemoved.route}\\${desktopIconWillBeRemoved.name}`

		return dis.filter(di => di.desktopIconId !== desktopIconId && !di.route.includes(routeWillBeRemoved))
	})
	updateRecycleBinIcon()
}

export const cleanRecycleBin = () => {
	desktopIcons.update((dis: DesktopIconsType) => dis.filter(di => !di.route.includes(RECYCLE_BIN_ROUTE)))
	updateRecycleBinIcon()
}

export const moveDesktopIconToNewRoute = (desktopIconId: string, newRoute: string) => {
	updateDesktopIconParams(desktopIconId, { route: newRoute, top: 108, left: 12 })
	updateRecycleBinIcon()
}

export const getDesktopIconName = (desktopIconId: string) => {
	let title = ""
	desktopIcons.subscribe(dis => title = dis.find(di => di.desktopIconId === desktopIconId)?.name as string)

	return title
}

export const createInitialDesktopIcons = () => {
	createDesktopIcon({
		desktopIconId: DI_MY_PC,
		icon: "my-computer-280px",
		name: MY_PC_NAME,
		route: DESKTOP_ROUTE,
		isFocused: false,
		top: DESKTOP_ICON_MARGIN,
		left: DESKTOP_ICON_MARGIN,
		onDblClick: () => createWindow({
			title: getDesktopIconName(DI_MY_PC),
			desktopIconId: DI_MY_PC,
			initialWidth: 600,
			initialHeight: 400,
			canBeHidden: true,
			canBeMaximizedOrMinimized: true,
			body: FolderBody
		})
	})
	createDesktopIcon({
		desktopIconId: DI_RECYCLE_BIN,
		icon: RECYCLE_BIN_ICON,
		name: RECYCLE_BIN_NAME,
		route: DESKTOP_ROUTE,
		isFocused: false,
		top: (DESKTOP_ICON_MARGIN * 2) + DESKTOP_ICON_HEIGHT,
		left: DESKTOP_ICON_MARGIN,
		onDblClick: () => createWindow({
			title: getDesktopIconName(DI_RECYCLE_BIN),
			desktopIconId: DI_RECYCLE_BIN,
			initialWidth: 600,
			initialHeight: 400,
			canBeHidden: true,
			canBeMaximizedOrMinimized: true,
			body: FolderBody
		})
	})
	createDesktopIcon({
		desktopIconId: DI_FIRST_FOLDER,
		icon: "open-folder",
		name: "desktopIcon.myFirstFolder",
		route: DESKTOP_ROUTE,
		isFocused: false,
		top: DESKTOP_ICON_MARGIN,
		left: (DESKTOP_ICON_MARGIN * 2) + DESKTOP_ICON_WIDTH,
		onDblClick: () => createWindow({
			title: getDesktopIconName(DI_FIRST_FOLDER),
			desktopIconId: DI_FIRST_FOLDER,
			initialWidth: 600,
			initialHeight: 400,
			canBeHidden: true,
			canBeMaximizedOrMinimized: true,
			body: FolderBody
		})
	})
	setTimeout(() => {
		const { availableHeight, availableWidth } = availableDimensions()

		createDesktopIcon({
			desktopIconId: DI_ABOUT_NOTEPAD,
			icon: NOTEPAD_ICON,
			name: "desktopIcon.about",
			route: DESKTOP_ROUTE,
			isFocused: false,
			properties: { text: "desktopIcon.about.text" },
			top: availableHeight - DESKTOP_ICON_MARGIN - DESKTOP_ICON_HEIGHT,
			left: availableWidth - DESKTOP_ICON_MARGIN - DESKTOP_ICON_WIDTH,
			onDblClick: () => createWindow({
				title: getDesktopIconName(DI_ABOUT_NOTEPAD),
				subTitle: "subTitle.notepad",
				desktopIconId: DI_ABOUT_NOTEPAD,
				initialWidth: 300,
				initialHeight: 150,
				canBeHidden: true,
				canBeMaximizedOrMinimized: true,
				body: NotepadBody
			})
		})
	}, 1)
}
