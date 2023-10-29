type CustomMouseEvent = MouseEvent & {
  toElement: Element
}

export const mouseOutOfScreen = (e: MouseEvent) => {
	const { clientX, clientY } = e
	const windowWidth = window.innerWidth
	const windowHeight = window.innerHeight
	if (clientX < 0 || clientX > windowWidth || clientY < 0 || clientY > windowHeight) return true

	return false
}

export const freezeCurrentCursor = (e: MouseEvent) => {
	const html = document.querySelector("html") as HTMLElement
	const body = document.querySelector("body") as HTMLElement
	const currentStyle = window.getComputedStyle((e as CustomMouseEvent).toElement)
	const cursor = currentStyle.cursor

	html.style.cursor = cursor
	body.style.pointerEvents = "none"
}

export const unfreezeCurrentCursor = () => {
	const html = document.querySelector("html") as HTMLElement
	const body = document.querySelector("body") as HTMLElement
	html.style.cursor = ""
	body.style.pointerEvents = ""
}
