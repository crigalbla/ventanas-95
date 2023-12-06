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
		"desktopIcon.myPc": "Mi PC",
		"desktopIcon.recycleBin": "Papelera de reciclaje",
		"desktopIcon.newFolder": "Nueva carpeta",
		"desktopIcon.about": "Sobre mi",
		"notepadBody.file": "Archivo",
		"notepadBody.edition": "Edición",
		"notepadBody.search": "Buscar",
		"notepadBody.help": "Ayuda"
	},
	en: {
		accept: "OK",
		cancel: "Cancel",
		yes: "Yes",
		no: "No",
		"login.title": "Enter Network Password",
		"login.description": "Enter your network password for 'Ventanas 95' Networking. It is a fake login :)",
		"login.username": "User name:",
		"login.password": "Password:",
		"navigationBar.start": "Start",
		"navigationBar.closeSession": "Close session",
		"navigationBar.suspend": "Suspend",
		"navigationBar.turnOff": "Turn off the system",
		"navigationBar.closeVentanas95Session": "Close 'Ventanas 95' session",
		"navigationBar.sureCloseSession": "Are you sure you want close session?",
		"navigationBar.closeVentanas95": "Close 'Ventanas 95'",
		"navigationBar.confirmWhatWant": "Confirm what you want",
		"navigationBar.turnOffSystem": "turn off the system",
		"navigationBar.restart": "restart",
		"desktopIcon.myPc": "My PC",
		"desktopIcon.recycleBin": "Recycle bin",
		"desktopIcon.newFolder": "New folder",
		"desktopIcon.about": "About",
		"notepadBody.file": "File",
		"notepadBody.edition": "Edition",
		"notepadBody.search": "Search",
		"notepadBody.help": "Help"
	}
}

export default translations
