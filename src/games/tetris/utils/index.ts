const rgbToArray = (rgb: string) => {
	return rgb.match(/\d+/g)?.map(Number) || []
}

const arrayToRgb = (arr: number[]) => {
	return `rgb(${arr[0]}, ${arr[1]}, ${arr[2]})`
}

export const lightenColorRgb = (rgb: string, percent: number) => {
	const [r, g, b] = rgbToArray(rgb)
	const factor = (percent / 100) + 1
	const newR = Math.min(255, Math.floor(r * factor) || percent * 1.5)
	const newG = Math.min(255, Math.floor(g * factor) || percent * 1.5)
	const newB = Math.min(255, Math.floor(b * factor) || percent * 1.5)
	return arrayToRgb([newR, newG, newB])
}

export const darkenColorRgb = (rgb: string, percent: number) => {
	const [r, g, b] = rgbToArray(rgb)
	const factor = 1 - (percent / 100)
	const newR = Math.max(0, Math.floor(r * factor))
	const newG = Math.max(0, Math.floor(g * factor))
	const newB = Math.max(0, Math.floor(b * factor))
	return arrayToRgb([newR, newG, newB])
}
