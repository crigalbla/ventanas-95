import { createWindow } from "@/stores"

type CustomMouseEvent = MouseEvent & {
  toElement: Element
}

export const mouseOutOfScreen = (e: MouseEvent) => {
	const { clientX, clientY } = e
	const navigationBar = document.getElementById("navigation-bar") as HTMLElement
	const windowWidth = window.innerWidth
	const windowHeight = window.innerHeight - (navigationBar?.offsetHeight || 0)
	if (clientX < 0 || clientX > windowWidth || clientY < 0 || clientY > windowHeight) return true

	return false
}

export const waitingCursor = (miliseconds: number = 2000) => {
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
	}, miliseconds)
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

export const doItClickEvent = ({
	searchElement,
	thisElementIsValid,
	avoidCallBacksIfThisElement,
	callBackClickOutside,
	callBackInside
}: {
	searchElement: string,
	thisElementIsValid?: string,
	avoidCallBacksIfThisElement?: string,
	callBackClickOutside: () => void,
	callBackInside?: () => void
}) => {
	const doIt = (event: Event) => {
		const myElement = document.querySelector(searchElement)
		const elementAcceptedAsInside = thisElementIsValid ? document.querySelector(thisElementIsValid) : null
		const elementThatAvoidCallBacks = avoidCallBacksIfThisElement ? document.querySelector(avoidCallBacksIfThisElement) : null

		if (myElement && !elementThatAvoidCallBacks?.contains(event.target as Node)) {
			if (myElement.contains(event.target as Node) || elementAcceptedAsInside?.contains(event.target as Node)) {
				callBackInside?.()
			} else {
				callBackClickOutside()
			}
		}
	}
	if (typeof document !== "undefined") document.addEventListener("mousedown", doIt)

	return { removeEvent: () => document.removeEventListener("mousedown", doIt) }
}

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

export const createLoginWindow = () => createWindow({
	title: "login.title",
	windowId: "login",
	hasQuestionButton: true,
	canLoseFocus: false,
	initialWidth: 530
})
