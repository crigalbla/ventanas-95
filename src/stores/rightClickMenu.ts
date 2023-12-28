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
			{ text: "Test1", isDisabled: true, sections: [[{ text: "section1" }]] },
			{ text: "Test2" },
			{ text: "Test3", isDisabled: true },
			{ text: "Pegar", isDisabled: true }
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
							isFocused: false,
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
								isFocused: false,
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
		],
		[
			{ text: "Test4", sections: [[{ text: "Test section1" }, { text: "Test section2" }, { text: "Test section3" }, { text: "Test section4" }, { text: "Test section5" }]] },
			{ text: "Test5", isDisabled: true }
		]
	],
	top: event.clientY,
	left: event.clientX
})
