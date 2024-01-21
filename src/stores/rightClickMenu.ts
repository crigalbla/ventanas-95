import { createDesktopIcon, createWindow, desktopIconIdPrefix, getDesktopIconName } from "."
import NotepadBody from "@/components/windowBodies/NotepadBody.svelte"
import FolderBody from "@/components/windowBodies/FolderBody.svelte"
import { writable } from "svelte/store"
import { generateId } from "@/utils"
import { NOTEPAD_ICON, RECYCLE_BIN_ROUTE } from "@/constants"

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

const createNewFolderDesktopIcon = (event: MouseEvent, route: string, SectionCoordinates: SectionCoordinatesType) => {
	const desktopIconId = generateId(desktopIconIdPrefix)

	createDesktopIcon({
		desktopIconId,
		icon: "open-folder",
		name: "desktopIcon.newFolder",
		route,
		isFocused: false,
		isEditingName: true,
		top: event.clientY - SectionCoordinates.top,
		left: event.clientX - SectionCoordinates.left,
		onDblClick: () => createWindow({
			title: getDesktopIconName(desktopIconId),
			desktopIconId,
			initialWidth: 600,
			initialHeight: 400,
			canBeHidden: true,
			canBeMaximizedOrMinimized: true,
			body: FolderBody
		})
	})
}

const createNewTextDocumentDesktopIcon = (event: MouseEvent, route: string, SectionCoordinates: SectionCoordinatesType) => {
	const desktopIconId = generateId(desktopIconIdPrefix)
	// TODO avoid duplicate names
	// const arrayNames = []
	// desktopIcons.subscribe((dis: DesktopIconsType) =>
	// 	dis.forEach((di: IndividualDesktopIconType) => di.route === route && arrayNames.push(di.name)))
	// console.log(arrayNames)

	createDesktopIcon({
		desktopIconId,
		icon: NOTEPAD_ICON,
		name: "desktopIcon.newTextDocument",
		route,
		isFocused: false,
		isEditingName: true,
		properties: { text: "" },
		top: event.clientY - SectionCoordinates.top,
		left: event.clientX - SectionCoordinates.left,
		onDblClick: () => createWindow({
			title: getDesktopIconName(desktopIconId),
			subTitle: "subTitle.notepad",
			desktopIconId,
			initialWidth: 300,
			initialHeight: 150,
			canBeHidden: true,
			canBeMaximizedOrMinimized: true,
			body: NotepadBody
		})
	})
}

export const createRightClickMenuInScreen = (
	event: MouseEvent,
	route: string,
	SectionCoordinates: SectionCoordinatesType = { top: 0, left: 0 }
) => rightClickMenu.set({
	sections: [
		[
			{ text: "rightClickMenu.paste", isDisabled: true }
		],
		route !== RECYCLE_BIN_ROUTE
			? [
				{
					text: "rightClickMenu.new",
					sections: [
						[{
							text: "rightClickMenu.folder",
							onClick: () => createNewFolderDesktopIcon(event, route, SectionCoordinates)
						}],
						[{
							text: "rightClickMenu.textDocument",
							onClick: () => createNewTextDocumentDesktopIcon(event, route, SectionCoordinates)
						}]
					]
				}
			]
			: []
	].filter(x => x.length),
	top: event.clientY,
	left: event.clientX
})

export const createRightClickMenuInDesktopIcon = ({
	event,
	canBeEdited,
	canBeCutAndCopy,
	canBeDeleted,
	customSection,
	onDblClick,
	removeDesktopIcon,
	changeToEditingName
}: {
	event: MouseEvent,
	canBeEdited: boolean,
	canBeCutAndCopy: boolean,
	canBeDeleted: boolean,
	customSection?: { position: number, section: SectionInRightClickMenuType },
	onDblClick: () => void,
	removeDesktopIcon: () => void,
	changeToEditingName: () => void
}) => {
	const sections: SectionInRightClickMenuType[] = [
		[
			{ text: "rightClickMenu.open", isBold: true, onClick: onDblClick }
		]
	]
	const cut = { text: "rightClickMenu.cut", isDisabled: true }
	const copy = { text: "rightClickMenu.copy", isDisabled: true }
	const remove = { text: "rightClickMenu.remove", onClick: removeDesktopIcon }
	const changeName = { text: "rightClickMenu.changeName", onClick: changeToEditingName }

	if (canBeCutAndCopy) sections.push([cut, copy])

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
