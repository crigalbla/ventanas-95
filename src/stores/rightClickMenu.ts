import { writable } from "svelte/store"
import { createDesktopIcon, createWindow, desktopIconIdPrefix } from "."
import { generateId } from "@/utils"
import NotepadBody from "@/components/windowBodies/NotepadBody.svelte"

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

const state: RightClickMenuType = undefined!

export const rightClickMenu = writable(state)

export const removeRightClickMenu = () => rightClickMenu.set(undefined!)

export const createRightClickMenuInDesktopScreen = (event: MouseEvent) => rightClickMenu.set({
	sections: [
		[
			{ text: "rightClickMenu.paste", isDisabled: true }
		],
		[
			{
				text: "rightClickMenu.new",
				sections: [
					[{
						text: "rightClickMenu.folder",
						onClick: () => createDesktopIcon({
							icon: "open-folder",
							name: "desktopIcon.newFolder",
							isFocused: true,
							top: event.clientY,
							left: event.clientX,
							onDblClick: () => window.alert("devolop in progress")
						})
					}],
					[{
						text: "rightClickMenu.textDocument",
						onClick: () => {
							const desktopIconId = generateId(desktopIconIdPrefix)
							createDesktopIcon({
								desktopIconId,
								icon: "notepad",
								name: "desktopIcon.newTextDocument",
								isFocused: true,
								properties: { text: "" },
								top: event.clientY,
								left: event.clientX,
								onDblClick: () => createWindow({
									title: "desktopIcon.newTextDocument",
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
						}
					}]
				]
			}
		]
	],
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
