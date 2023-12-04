import { writable } from "svelte/store"
import { generateId } from "@/utils"

export type IndividualDesktopIconType = {
  desktopIconId: string,
  icon: string,
  text: string,
  isFocused?: boolean,
  zIndex?: number,
  top?: number,
  left?: number,
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
