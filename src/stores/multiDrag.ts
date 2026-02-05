import { writable } from "svelte/store"

export type MultiDragState = {
	isDragging: boolean
	fakeLeft: number
	fakeTop: number
	plusFakeLeft: number
	plusFakeTop: number
	draggingIconIds: string[]
	mainDraggingIconId: string | null
}

const initialState: MultiDragState = {
	isDragging: false,
	fakeLeft: 0,
	fakeTop: 0,
	plusFakeLeft: 0,
	plusFakeTop: 0,
	draggingIconIds: [],
	mainDraggingIconId: null
}

export const multiDrag = writable<MultiDragState>(initialState)

export const startMultiDrag = (mainIconId: string, iconIds: string[]) => {
	multiDrag.set({
		isDragging: true,
		fakeLeft: 0,
		fakeTop: 0,
		plusFakeLeft: 0,
		plusFakeTop: 0,
		draggingIconIds: iconIds,
		mainDraggingIconId: mainIconId
	})
}

export const updateMultiDragPosition = (fakeLeft: number, fakeTop: number, plusFakeLeft = 0, plusFakeTop = 0) => {
	multiDrag.update(state => ({
		...state,
		fakeLeft,
		fakeTop,
		plusFakeLeft,
		plusFakeTop
	}))
}

export const stopMultiDrag = () => {
	multiDrag.set(initialState)
}
