import { writable } from "svelte/store"

export type MultiDragState = {
	isDragging: boolean
	fakeLeft: number
	fakeTop: number
	plusFakeLeft: number
	plusFakeTop: number
	draggingIconIds: string[]
	mainDraggingIconId: string | null
	canBeDropped: boolean
}

const initialState: MultiDragState = {
	isDragging: false,
	fakeLeft: 0,
	fakeTop: 0,
	plusFakeLeft: 0,
	plusFakeTop: 0,
	draggingIconIds: [],
	mainDraggingIconId: null,
	canBeDropped: true
}

export const multiDrag = writable<MultiDragState>(initialState)

export const startMultiDrag = (mainIconId: string, iconIds: string[]) => {
	multiDrag.set({
		isDragging: false,
		fakeLeft: 0,
		fakeTop: 0,
		plusFakeLeft: 0,
		plusFakeTop: 0,
		draggingIconIds: iconIds,
		mainDraggingIconId: mainIconId,
		canBeDropped: true
	})
}

export const updateMultiDragPosition = (fakeLeft: number, fakeTop: number, plusFakeLeft = 0, plusFakeTop = 0) => {
	multiDrag.update(state => ({
		...state,
		isDragging: true,
		fakeLeft,
		fakeTop,
		plusFakeLeft,
		plusFakeTop
	}))
}

export const updateMultiDragCanBeDropped = (canBeDropped: boolean) => {
	multiDrag.update(state => ({
		...state,
		canBeDropped
	}))
}

export const stopMultiDrag = () => {
	multiDrag.set(initialState)
}
