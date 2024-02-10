import { NAVIGATION_BAR_ID, DESKTOP_SCREEN_ID, DI_RECYCLE_BIN, DI_MY_PC, W_NAME_ALREADY_IN_USE } from "@/constants"
import { windows } from "@/stores"

type CustomMouseEvent = MouseEvent & {
  toElement: Element
}

type AudioPlayingsType = {
	[key: string]: { tracks: number }
}

const audioPlayings: AudioPlayingsType = {}

export const isMouseOutOfDesktopScreen = (e: MouseEvent) =>
	isMouseOutOfThisElement(e, document.getElementById(DESKTOP_SCREEN_ID) ?? document.body)

export const isMouseOutOfThisElement = (e: MouseEvent, targetElement: HTMLElement): boolean => {
	const rect = targetElement.getBoundingClientRect()
	const mouseX = e.clientX
	const mouseY = e.clientY

	return mouseX < rect.left || mouseX > rect.right || mouseY < rect.top || mouseY > rect.bottom
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
	document.addEventListener("contextmenu", freezeWaitCursor)

	setTimeout(() => {
		document.removeEventListener("click", freezeWaitCursor)
		document.removeEventListener("contextmenu", freezeWaitCursor)
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

export const thereIsWindowBlocking = (event?: Event) => {
	const blockingWindow = document.querySelector(`#${W_NAME_ALREADY_IN_USE}`)

	if (blockingWindow) {
		const navigationBar = document.querySelector(`#${NAVIGATION_BAR_ID}`)
		const isClickedInside = blockingWindow?.contains(event?.target as Node) || navigationBar?.contains(event?.target as Node)
		const isClickedOutside = event && !isClickedInside

		if (isClickedOutside) playAudio("/sounds/clickNotAllowed.mp3")
	}

	return Boolean(blockingWindow)
}

export const playAudio = (audioUrl: string) => {
	// eslint-disable-next-line no-undef
	const audio = new Audio(audioUrl)
	audioPlayings[audioUrl] = { tracks: (audioPlayings[audioUrl]?.tracks || 0) + 1 }

	audio.addEventListener("ended", () => delete audioPlayings[audioUrl])

	if (audioPlayings[audioUrl]?.tracks === 1) void audio?.play()
}

export const availableDimensions = () => {
	const body = document.querySelector("body") as HTMLElement
	const navigationBar = document.getElementById(NAVIGATION_BAR_ID) as HTMLElement
	const availableWidth = body?.offsetWidth
	const availableHeight = body?.offsetHeight - navigationBar?.offsetHeight

	return { availableWidth, availableHeight }
}

export const doItMouseDownEvent = ({
	searchElement,
	thisElementIsValid,
	avoidCallBacksIfThisElement,
	callBackMouseDownOutside,
	callBackInside
}: {
	searchElement: string,
	thisElementIsValid?: string,
	avoidCallBacksIfThisElement?: string,
	callBackMouseDownOutside: () => void,
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
				callBackMouseDownOutside()
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

export const generateId = (prefix: string) => `${prefix}-${Math.random().toString().replace("0.", "")}`

export const isMobileOrTablet = (): boolean => {
	if (typeof navigator !== "undefined") {
		const userAgent = navigator.userAgent.toLowerCase()
		const hasTouchstart = "ontouchstart" in document

		return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent) && hasTouchstart
	}

	return false
}

export const isDifferentOfRecycleBinAndMyPC = (id: string) => id !== DI_RECYCLE_BIN && id !== DI_MY_PC
