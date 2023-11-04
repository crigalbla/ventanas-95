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

export const waitingCursor = () => {
	const html = document.querySelector("html") as HTMLElement
	const body = document.querySelector("body") as HTMLElement

	const freezeWaitCursor = () => {
		html.style.cursor = "url('/cursors/wait.cur'), wait"
		body.style.pointerEvents = "none"
	}

	freezeWaitCursor()
	document.addEventListener("click", freezeWaitCursor)

	setTimeout(() => {
		document.removeEventListener("click", freezeWaitCursor)
		unfreezeCurrentCursor()
	}, 2000)
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

export const avaliableDimensions = () => {
	const body = document.querySelector("body") as HTMLElement
	const navigationBar = document.getElementById("navigation-bar") as HTMLElement
	const avaliableWidth = body.offsetWidth
	const avaliableHeight = body.offsetHeight - navigationBar.offsetHeight

	return { avaliableWidth, avaliableHeight }
}

// TODO: use when necessary
// export const doItIfClickOutOfElement = <T>(searchElement: string, callBack: (args: T) => void) => {
// 	document.addEventListener("click", (event) => {
// 		const menu = document.querySelector(searchElement)

// 		if (menu && !menu.contains(event.target)) callBack()
// 	})
// }

export const getCurrentTime = () => {
	const date = new Date()
	let hours = date.getHours()
	let minutes: number | string = date.getMinutes()
	const ampm = hours >= 12 ? "PM" : "AM"

	hours = hours % 12
	hours = hours || 12
	minutes = minutes < 10 ? "0" + minutes : minutes

	return hours + ":" + minutes + " " + ampm
}
