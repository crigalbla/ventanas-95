import { aboutNotepadTextEnglish, aboutNotepadTextSpanish } from "@/stores/data"

type Translations = {
  [locale: string]: {
    [key: string]: string;
  };
};

const translations: Translations = {
	es: {
		accept: "Aceptar",
		cancel: "Cancelar",
		yes: "Sí",
		no: "No",
		ohNo: "Oh no...",
		usingTouchableDevice1: "Parece ser que estás usando un dispositivo tactil que no tiene un raton.",
		usingTouchableDevice2: "Recuerda que 'Ventanas 95' es un sistema operativo para ordenadores,",
		usingTouchableDevice3: "¡No funcionaría correctamente sin un ratón!",
		file: "Archivo",
		edition: "Edición",
		search: "Buscar",
		help: "Ayuda",
		see: "Ver",
		goTo: "Ir a",
		favourites: "Favoritos",
		direction: "Dirección",
		"login.title": "Escriba la contraseña de red",
		"login.description": "Escriba la contraseña de red 'Ventanas 95'. Es un login falso :)",
		"login.username": "Nombre de usuario:",
		"login.password": "Contraseña:",
		"navigationBar.start": "Inicio",
		"navigationBar.closeSession": "Cerrar la sesión",
		"navigationBar.suspend": "Suspender",
		"navigationBar.turnOff": "Apagar el sistema",
		"navigationBar.closeVentanas95Session": "Cerrar la sesión de 'Ventanas 95'",
		"navigationBar.sureCloseSession": "¿Seguro que desea cerrar la sesión?",
		"navigationBar.closeVentanas95": "Cerrar 'Ventanas 95'",
		"navigationBar.confirmWhatWant": "Confirme que desea",
		"navigationBar.turnOffSystem": "apagar el sistema",
		"navigationBar.restart": "reiniciar",
		"desktopIcon.copyOf": "Copia de",
		"desktopIcon.myPc": "Mi PC",
		"desktopIcon.recycleBin": "Papelera de reciclaje",
		"desktopIcon.newFolder": "Nueva carpeta",
		"desktopIcon.myFirstFolder": "Mi primera carpeta",
		"desktopIcon.newTextDocument": "Nuevo documento de texto",
		"desktopIcon.about": "Sobre mi",
		"desktopIcon.about.text": aboutNotepadTextSpanish,
		"subTitle.notepad": "Bloc de notas",
		"saveChangesBody.title": "El texto del archivo {{file}} ha cambiado.",
		"saveChangesBody.question": "¿Deseas guardar los cambios?",
		"rightClickMenu.paste": "Pegar",
		"rightClickMenu.new": "Nuevo",
		"rightClickMenu.folder": "Carpeta",
		"rightClickMenu.textDocument": "Documento de texto",
		"rightClickMenu.open": "Abrir",
		"rightClickMenu.cut": "Cortar",
		"rightClickMenu.copy": "Copiar",
		"rightClickMenu.remove": "Eliminar",
		"rightClickMenu.changeName": "Cambiar nombre",
		"rightClickMenu.cleanRecycleBin": "Vaciar Papelera de reciclaje",
		"route.desktop": "Escritorio",
		"nameAlreadyInUse.title": "Error al renombrar archivo",
		"nameAlreadyInUse.subtitle": "No se puede renombrar {{filename}}: Ya existe un archivo con este nombre. Especifica un nombre de archivo diferente.",
		"nameAlreadyInUseInNewRoute.title": "Error al mover archivo",
		"nameAlreadyInUseInNewRoute.subtitle": "No se puede mover {{filename}}: Ya existe un archivo con este nombre en la nueva ruta de destino."
	},
	en: {
		accept: "OK",
		cancel: "Cancel",
		yes: "Yes",
		no: "No",
		ohNo: "Oh no...",
		usingTouchableDevice1: "It appears that you are using a touch device that does not have a mouse.",
		usingTouchableDevice2: "Remember that 'Ventanas 95' is an operating system for computers,",
		usingTouchableDevice3: "Wouldn't work properly without a mouse!",
		file: "File",
		edition: "Edition",
		search: "Search",
		help: "Help",
		see: "See",
		goTo: "Go to",
		favourites: "Favourites",
		direction: "Direction",
		"login.title": "Enter Network Password",
		"login.description": "Enter your network password for 'Ventanas 95' Networking. It is a fake login :)",
		"login.username": "User name:",
		"login.password": "Password:",
		"navigationBar.start": "Start",
		"navigationBar.closeSession": "Close session",
		"navigationBar.suspend": "Suspend",
		"navigationBar.turnOff": "Shut down the system",
		"navigationBar.closeVentanas95Session": "Close 'Ventanas 95' session",
		"navigationBar.sureCloseSession": "Are you sure you want close session?",
		"navigationBar.closeVentanas95": "Close 'Ventanas 95'",
		"navigationBar.confirmWhatWant": "Confirm what you want",
		"navigationBar.turnOffSystem": "shut down the system",
		"navigationBar.restart": "restart",
		"desktopIcon.copyOf": "Copy of",
		"desktopIcon.myPc": "My PC",
		"desktopIcon.recycleBin": "Recycle bin",
		"desktopIcon.newFolder": "New folder",
		"desktopIcon.myFirstFolder": "My first folder",
		"desktopIcon.newTextDocument": "New text document",
		"desktopIcon.about": "About",
		"desktopIcon.about.text": aboutNotepadTextEnglish,
		"subTitle.notepad": "Notepad",
		"saveChangesBody.title": "The text of the {file} file has changed.",
		"saveChangesBody.question": "Do you want save the changes?",
		"rightClickMenu.paste": "Paste",
		"rightClickMenu.new": "New",
		"rightClickMenu.folder": "Folder",
		"rightClickMenu.textDocument": "Text document",
		"rightClickMenu.open": "Open",
		"rightClickMenu.cut": "Cut",
		"rightClickMenu.copy": "Copy",
		"rightClickMenu.remove": "Remove",
		"rightClickMenu.changeName": "Rename",
		"rightClickMenu.cleanRecycleBin": "Clean Recycle bin",
		"route.desktop": "Desktop",
		"nameAlreadyInUse.title": "Error renaming file",
		"nameAlreadyInUse.subtitle": "Cannot rename {{filename}}: A file with the name you specified already exists. Specify a different filename.",
		"nameAlreadyInUseInNewRoute.title": "Error moving file",
		"nameAlreadyInUseInNewRoute.subtitle": "Cannot move {{filename}}: A file with the name you specified already exists in the new destination route."
	}
}

export default translations
