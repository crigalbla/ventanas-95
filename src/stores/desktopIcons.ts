import { DESKTOP_ICON_HEIGHT, DESKTOP_ICON_MARGIN, DESKTOP_ICON_WIDTH, DI_ABOUT_NOTEPAD, DI_MY_PC, DI_FIRST_FOLDER, DI_RECYCLE_BIN, DESKTOP_ROUTE, RECYCLE_BIN_NAME, MY_PC_NAME, RECYCLE_BIN_ICON, FULL_RECYCLE_BIN_ICON, RECYCLE_BIN_ROUTE, NOTEPAD_ICON, W_NAME_ALREADY_IN_USE } from "@/constants"
import { createDefaultFolderWindow, createDefaultNotepadWindow, createNameAlreadyInUseWindow } from "./windows"
import { availableDimensions, generateId } from "@/utils"
import { writable } from "svelte/store"
import { translateKey } from "@/i18n"

export type IndividualDesktopIconType = {
  desktopIconId: string,
  icon: string,
  name: string,
	route: string,
	canBeDropped?: boolean
  isFocused?: boolean,
	isEditingName?: boolean,
	isMoving?: boolean,
	isCut?: boolean,
	isCopied?: boolean,
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

export const getDesktopIcons = () => {
	let result: DesktopIconsType = []
	const unsubscribe = desktopIcons.subscribe((dis) => { result = dis })
	unsubscribe()

	return result
}

const pasteACopyOfDesktopIcons = (params: UpdatableDesktopIconParams) => {
	const allDesktopIcons = getDesktopIcons()
	const copiedDesktopIcons = allDesktopIcons.filter((di) => di.isCopied)
	const routesOfCopiedDesktopIcons = copiedDesktopIcons.map((di) => di.route)
	const routesWithNameOfCopiedDIs = copiedDesktopIcons.map((di) => `${di.route}\\${di.name}`)
	const copyOf = translateKey("desktopIcon.copyOf")
	const pastedDesktopIcons: IndividualDesktopIconType[] = []
	let newName = ""

	copiedDesktopIcons.forEach((di) => {
		const desktopIconId = generateId(desktopIconIdPrefix)
		const isNotepad = di.icon === NOTEPAD_ICON

		if (routesOfCopiedDesktopIcons.includes(params.route as string)) newName = `${copyOf} ${translateKey(di.name)}`

		// Creating the copy
		const newPastedDesktopIcon = {
			...di,
			...params,
			name: newName || di.name,
			desktopIconId,
			onDblClick: () => isNotepad ? createDefaultNotepadWindow(desktopIconId) : createDefaultFolderWindow(desktopIconId)
		}
		pastedDesktopIcons.push(newPastedDesktopIcon)
		createDesktopIcon(pastedDesktopIcons[pastedDesktopIcons.length - 1])

		// Creating the copies of the element inside of the main folder/s
		allDesktopIcons.forEach((di2) => {
			const oldRoute = routesWithNameOfCopiedDIs.find((x) => di2.route.includes(x))
			if (oldRoute) {
				const desktopIconId2 = generateId(desktopIconIdPrefix)
				const newRoute = `${newPastedDesktopIcon.route}\\${newPastedDesktopIcon.name}`
				const isNotepad = di2.icon === NOTEPAD_ICON

				createDesktopIcon({
					...di2,
					desktopIconId: desktopIconId2,
					route: di2.route.replace(oldRoute, newRoute),
					onDblClick: () => isNotepad ? createDefaultNotepadWindow(desktopIconId2) : createDefaultFolderWindow(desktopIconId2)
				})
			}
		})
	})
}

export const createDesktopIcon = ({ desktopIconId = generateId(desktopIconIdPrefix), isFocused, ...rest }: CreateDesktopIconParams) => {
	desktopIcons.update((dis: DesktopIconsType) =>
		[...dis, { desktopIconId, zIndex: dis.length + 1, isFocused: isFocused ?? true, ...rest }]
	)
}

export const updateDesktopIconParams = (desktopIconId: string, params: UpdatableDesktopIconParams) => {
	let oldDesktopIcon: IndividualDesktopIconType | undefined

	desktopIcons.update((dis: DesktopIconsType) => {
		const isChangingNameOrRoute = Boolean(params.name ?? params.route)
		let oldRoute: string
		if (isChangingNameOrRoute) {
			oldDesktopIcon = dis.find(di => di.desktopIconId === desktopIconId) as IndividualDesktopIconType
			oldRoute = `${oldDesktopIcon.route}\\${oldDesktopIcon.name}`
		}
		if (params.name) {
			const thereIsADesktopIconWithSameName =
				Boolean(dis.find((di) =>
					di.route === oldDesktopIcon?.route &&
					(di?.name === params.name || translateKey(di?.name) === params.name)
				))

			if (thereIsADesktopIconWithSameName) {
				createNameAlreadyInUseWindow(desktopIconId)
				return dis
			}
		}

		return dis.map((di: IndividualDesktopIconType) => {
			// Update routes of files inside of the folder that will change the name or will be moved
			if (oldDesktopIcon && di.route.includes(oldRoute) && di.desktopIconId !== desktopIconId) {
				const newRoute = params.name
					? `${oldDesktopIcon.route}\\${params.name}`
					: `${params.route}\\${oldDesktopIcon.name}`
				return { ...di, route: di.route.replace(oldRoute, newRoute) }
			}

			 // Update in normal cases
			return di.desktopIconId === desktopIconId ? { ...di, ...params } : di
		})
	})
	if (params.route === RECYCLE_BIN_ROUTE || oldDesktopIcon?.route === RECYCLE_BIN_ROUTE) updateRecycleBinIcon()
}

export const updateDesktopIconsParams = (desktopIconIds: string[], params: UpdatableDesktopIconParams) => {
	desktopIconIds.forEach((desktopIconId) => updateDesktopIconParams(desktopIconId, params))
}

export const removeDesktopIcon = (desktopIconId: string) => {
	desktopIcons.update((dis: DesktopIconsType) => {
		const desktopIconWillBeRemoved = dis.find(di => di.desktopIconId === desktopIconId) as IndividualDesktopIconType
		const routeWillBeRemoved = `${desktopIconWillBeRemoved.route}\\${desktopIconWillBeRemoved.name}`

		return dis.filter(di => di.desktopIconId !== desktopIconId && !di.route.includes(routeWillBeRemoved))
	})
	updateRecycleBinIcon()
}

export const cutDesktopIcons = (desktopIconIds: string[]) => {
	desktopIcons.update((dis: DesktopIconsType) =>
		dis.map(di =>
			desktopIconIds.includes(di.desktopIconId)
				? { ...di, isCut: true, isCopied: false }
				: { ...di, isCut: false, isCopied: false }
		)
	)
}

export const copyDesktopIcons = (desktopIconIds: string[]) => {
	desktopIcons.update((dis: DesktopIconsType) =>
		dis.map(di =>
			desktopIconIds.includes(di.desktopIconId)
				? { ...di, isCopied: true, isCut: false }
				: { ...di, isCopied: false, isCut: false }
		)
	)
}

export const getCutOrCopiedDesktopIcons = () => {
	let result: DesktopIconsType = []
	const unsubscribe = desktopIcons.subscribe((dis) => {
		result = dis.filter((di) => di.isCopied || di.isCut)
	})
	unsubscribe()

	return result
}

export const isThereAnyCutOrCopiedDesktopIcon = () => Boolean(getCutOrCopiedDesktopIcons().length)

export const cleanRecycleBin = () => {
	desktopIcons.update((dis: DesktopIconsType) => dis.filter(di => !di.route.includes(RECYCLE_BIN_ROUTE)))
	updateRecycleBinIcon()
}

export const moveDesktopIconsToNewRoute = (
	desktopIconIds: string[],
	params: { route: string, top?: number, left?: number }
) => {
	const cutOrCopiedDesktopIcons = getCutOrCopiedDesktopIcons()
	const wereCut = cutOrCopiedDesktopIcons.find((di) => di.isCut)
	const wereCopied = cutOrCopiedDesktopIcons.find((di) => di.isCopied)
	let newParams: UpdatableDesktopIconParams = { route: params.route, top: params.top ?? 0, left: params.left ?? 0 }

	if (wereCut) newParams = { ...newParams, isCut: false }
	if (wereCopied) {
		newParams = { ...newParams, isCopied: false }
		pasteACopyOfDesktopIcons(newParams)

		delete newParams.route
		delete newParams.top
		delete newParams.left
	}

	updateDesktopIconsParams(desktopIconIds, newParams)
}

export const getDesktopIconName = (desktopIconId: string) => {
	let title = ""
	const unsubscribe = desktopIcons.subscribe(dis => title = dis.find(di => di.desktopIconId === desktopIconId)?.name as string)
	unsubscribe()

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
		onDblClick: () => createDefaultFolderWindow(DI_MY_PC)
	})
	createDesktopIcon({
		desktopIconId: DI_RECYCLE_BIN,
		icon: RECYCLE_BIN_ICON,
		name: RECYCLE_BIN_NAME,
		route: DESKTOP_ROUTE,
		isFocused: false,
		top: (DESKTOP_ICON_MARGIN * 2) + DESKTOP_ICON_HEIGHT,
		left: DESKTOP_ICON_MARGIN,
		onDblClick: () => createDefaultFolderWindow(DI_RECYCLE_BIN)
	})
	createDesktopIcon({
		desktopIconId: DI_FIRST_FOLDER,
		icon: "open-folder",
		name: "desktopIcon.myFirstFolder",
		route: DESKTOP_ROUTE,
		isFocused: false,
		top: DESKTOP_ICON_MARGIN,
		left: (DESKTOP_ICON_MARGIN * 2) + DESKTOP_ICON_WIDTH,
		onDblClick: () => createDefaultFolderWindow(DI_FIRST_FOLDER)
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
			onDblClick: () => createDefaultNotepadWindow(DI_ABOUT_NOTEPAD)
		})
	}, 1)
}
