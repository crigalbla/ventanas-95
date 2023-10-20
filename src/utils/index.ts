const mouseOutOfScreen = (e: Event) => {
	const { clientX, clientY } = e
	const windowWidth = window.innerWidth
	const windowHeight = window.innerHeight
	if (clientX < 0 || clientX > windowWidth || clientY < 0 || clientY > windowHeight) return true

	return false
}

export { mouseOutOfScreen }
