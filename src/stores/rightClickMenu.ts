import { writable } from "svelte/store"

import { DESKTOP_ROUTE, NOTEPAD_ICON, RECYCLE_BIN_ROUTE } from "@/constants"
import { generateId } from "@/utils"

import { cleanRecycleBin, createDesktopIcon, desktopIconIdPrefix, updateDesktopIconParams, type IndividualDesktopIconType, removeDesktopIcon, cutDesktopIcons, copyDesktopIcons, moveDesktopIconsToNewRoute, isThereAnyCutOrCopiedDesktopIcon, getCutOrCopiedDesktopIcons, getNameForANewFile } from "./desktopIcons"
import { createDefaultFolderWindow, createDefaultNotepadWindow } from "./windows"

export type SubOptionInRightClickMenuType = {
  text: string,
  isDisabled?: boolean,
  icon?: string,
  onClick?: () => void
}

export type SubSectionInRightClickMenuType = SubOptionInRightClickMenuType[]

export type OptionInRightClickMenuType = {
  text: string,
  isDisabled?: boolean,
	isBold?: boolean,
  icon?: string,
  sections?: SubSectionInRightClickMenuType[]
  onClick?: () => void
}

export type SectionInRightClickMenuType = OptionInRightClickMenuType[]

export type RightClickMenuType = {
  sections: SectionInRightClickMenuType[],
  top: number,
  left: number,
  zIndex?: number
}

type SectionCoordinatesType = { top: number, left: number }

const state: RightClickMenuType = undefined!

export const rightClickMenu = writable(state)

export const removeRightClickMenu = () => rightClickMenu.set(undefined!)

const createNewFolderDesktopIcon = (event: MouseEvent, route: string, sectionCoordinates: SectionCoordinatesType) => {
	const desktopIconId = generateId(desktopIconIdPrefix)

	createDesktopIcon({
		desktopIconId,
		icon: "open-folder",
		name: getNameForANewFile("desktopIcon.newFolder", route),
		route,
		isFocused: false,
		isEditingName: true,
		top: event.clientY - sectionCoordinates.top,
		left: event.clientX - sectionCoordinates.left,
		onDblClick: () => createDefaultFolderWindow(desktopIconId)
	})
}

const createNewTextDocumentDesktopIcon = (event: MouseEvent, route: string, SectionCoordinates: SectionCoordinatesType) => {
	const desktopIconId = generateId(desktopIconIdPrefix)

	createDesktopIcon({
		desktopIconId,
		icon: NOTEPAD_ICON,
		name: getNameForANewFile("desktopIcon.newTextDocument", route),
		route,
		isFocused: false,
		isEditingName: true,
		properties: { text: "" },
		top: event.clientY - SectionCoordinates.top,
		left: event.clientX - SectionCoordinates.left,
		onDblClick: () => createDefaultNotepadWindow(desktopIconId)
	})
}

export const createRightClickMenuInScreen = (
	event: MouseEvent,
	sectionCoordinates: SectionCoordinatesType = { top: 0, left: 0 }
) => {
	const route = (event.target as HTMLElement).dataset.route as string
	const cutOrCopiedDesktopIcons = getCutOrCopiedDesktopIcons()
	let isTheSameDestination = false
	let top = event.clientY
	let left = event.clientX

	cutOrCopiedDesktopIcons.forEach((di) => {
		if (!isTheSameDestination && `${di.route}\\${di.name}` === route) isTheSameDestination = true
	})

	if (route !== DESKTOP_ROUTE) {
		top = 0
		left = 0
	}

	rightClickMenu.set({
		sections: [
			[
				{
					text: "rightClickMenu.paste",
					isDisabled: !isThereAnyCutOrCopiedDesktopIcon() || isTheSameDestination,
					onClick: () => moveDesktopIconsToNewRoute(
						getCutOrCopiedDesktopIcons().map(di => di.desktopIconId),
						{ route, top, left }
					)
				}
			],
			route === RECYCLE_BIN_ROUTE
				?	[
					{ text: "rightClickMenu.cleanRecycleBin", onClick: cleanRecycleBin }
				]
				: [
					{
						text: "rightClickMenu.new",
						sections: [
							[{
								text: "rightClickMenu.folder",
								onClick: () => createNewFolderDesktopIcon(event, route, sectionCoordinates)
							}],
							[{
								text: "rightClickMenu.textDocument",
								onClick: () => createNewTextDocumentDesktopIcon(event, route, sectionCoordinates)
							}]
						]
					}
				]
		].filter(x => x.length),
		top: event.clientY,
		left: event.clientX
	})
}

export const createRightClickMenuInDesktopIcon = ({
	event,
	desktopIcon,
	canBeEdited,
	canBeCutAndCopied,
	canBeDeleted,
	canBePasted,
	customSection,
	onDblClick
}: {
	event: MouseEvent,
	desktopIcon: IndividualDesktopIconType,
	canBeEdited: boolean,
	canBeCutAndCopied: boolean,
	canBeDeleted: boolean,
	canBePasted: boolean,
	customSection?: { position: number, section: SectionInRightClickMenuType },
	onDblClick: () => void,
}) => {
	const newRoute = (event.target as HTMLElement).dataset.route as string
	const { desktopIconId, route } = desktopIcon
	const isInRecycleBin = route === RECYCLE_BIN_ROUTE
	const onPasteDesktopIcon = () =>
		moveDesktopIconsToNewRoute(getCutOrCopiedDesktopIcons().map(di => di.desktopIconId), { route: newRoute })
	const onRemoveDesktopIcon = () => !isInRecycleBin
		? moveDesktopIconsToNewRoute([desktopIconId], { route: RECYCLE_BIN_ROUTE })
		: removeDesktopIcon(desktopIconId)
	const onChangeToIsEditingName = () => updateDesktopIconParams(desktopIconId, { isEditingName: true })

	const sections: SectionInRightClickMenuType[] = [
		[
			{ text: "rightClickMenu.open", isBold: true, onClick: onDblClick }
		]
	]
	const cut: OptionInRightClickMenuType = { text: "rightClickMenu.cut", onClick: () => cutDesktopIcons([desktopIconId]) }
	const copy: OptionInRightClickMenuType = { text: "rightClickMenu.copy", onClick: () => copyDesktopIcons([desktopIconId]) }
	const paste: OptionInRightClickMenuType =
		{ text: "rightClickMenu.paste", isDisabled: !isThereAnyCutOrCopiedDesktopIcon(), onClick: onPasteDesktopIcon }
	const remove: OptionInRightClickMenuType = { text: "rightClickMenu.remove", onClick: onRemoveDesktopIcon }
	const changeName: OptionInRightClickMenuType = { text: "rightClickMenu.changeName", onClick: onChangeToIsEditingName }

	if (canBeCutAndCopied) sections.push([cut, copy])
	if (canBePasted) {
		if (sections.length === 1) {
			sections.push([paste])
		} else {
			sections[1].push(paste)
		}
	}

	if (canBeDeleted && canBeEdited) {
		sections.push([remove, changeName])
	} else if (canBeDeleted) {
		sections.push([remove])
	} else if (canBeEdited) {
		sections.push([changeName])
	}

	if (customSection) sections.splice(customSection.position, 0, customSection.section)

	rightClickMenu.set({
		sections,
		top: event.clientY,
		left: event.clientX
	})
}
