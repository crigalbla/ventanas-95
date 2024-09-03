type Translations = {
  [locale: string]: {
    [key: string]: string;
  };
};

const aboutNotepadTextSpanish = `
¡Hola! ¿Qué tal?

Antes de nada, gracias por entrar en mi proyecto.
Como puedes ver, está basado en un famoso sistema operativo del año 1995, para ello he usado y estudiado el comportamiento de dicho sistema operativo.
Lo he hecho todo con Astro y Svelte, no tienes nada de backend ni ninguna persistencia de datos, espero que te guste. Puedes ver el código si te apetece, está aquí:
----------------------------------
https://github.com/crigalbla/ventanas-95
----------------------------------

Soy Cristian, estoy graduado en ingeniería informática del software en la ETSII de Sevilla. En septiembre de 2018 comencé en el sector. Si quieres saber mas sobre mí te dejo mi perfil de linkedIn:
---------------------------------------
https://es.linkedin.com/in/cristian-galan-blanco
---------------------------------------

          ¡Si ves
            algún bug
              házmelo saber!
`

const aboutNotepadTextEnglish = `
Hello! How are you?

First of all, thank you for visiting my project.
As you can see, it is based on a famous operating system from 1995, for this I have used and studied the behavior of this operating system.
I've done it all with Astro and Svelte, it has no backend or data persistence, I hope you like it. You can see the code if you want, it is here:
----------------------------------
https://github.com/crigalbla/ventanas-95
----------------------------------

I am Cristian, I have a degree in computer software engineering from the ETSII in Seville, Spain. In September 2018 I started in the sector. If you want to know more about me, I leave you my linkedIn profile:
---------------------------------------
https://es.linkedin.com/in/cristian-galan-blanco
---------------------------------------

           If you see
             some bug
               let me know!
`

const tooltipSpanish = `Para poder usar 'Ventanas 95' tienes 2 opciones:
  * Puedes usar un nombre de usuario (el input de contraseña será ignorado).
  * Cancelar o cerrar esta ventana si quieres entrar como invitado.

Tu sesión siempre será la misma, solo que podrás cambiar tu nombre de usuario y verlo en el menú del botón de 'Inicio'.
`

const tooltipEnglish = `To use 'Ventanas 95', you have 2 options:
  * You can use a user name (the password input will be ignored).
  * Cancel or close this window if you want to log in as a guest.

Your session will always be the same, but you can change your username and see it in the 'Start' button menu.
`

const translations: Translations = {
	es: {
		accept: "Aceptar",
		cancel: "Cancelar",
		yes: "Sí",
		no: "No",
		ohWow: "Oh, vaya...",
		usingTouchableDevice1: "Parece ser que estás usando un dispositivo tactil. Úsalo en horizontal para poder continuar.",
		usingTouchableDevice2: "'Ventanas 95' es un sistema operativo para ordenadores, no podrás ver toda su funcionalidad,",
		usingTouchableDevice3: "¡Para ver todas las funcionalidades, usa un ordenador o un ratón!",
		file: "Archivo",
		edition: "Edición",
		search: "Buscar",
		help: "Ayuda",
		see: "Ver",
		goTo: "Ir a",
		favourites: "Favoritos",
		direction: "Dirección",
		"tetrisGame.score": "Puntuación",
		"tetrisGame.level": "Nivel",
		"tetrisGame.lines": "Lineas",
		"tetrisGame.next": "Siguiente",
		"tetrisGame.pause": "Pausar",
		"tetrisGame.resume": "Reanudar",
		"tetrisGame.mute": "Mutear",
		"tetrisGame.unmute": "Desmutear",
		"tetrisGame.gameOver": "¡Fin de la partida!",
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
		"desktopIcon.tetrisGame": "Tetris juego",
		"desktopIcon.about.text": aboutNotepadTextSpanish,
		"tooltip.text": tooltipSpanish,
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
		"nameAlreadyInUseInNewRoute.subtitle": "No se puede mover {{filename}}: Ya existe un archivo con este nombre en la nueva ruta de destino.",
		"charactersNotAllowed.title": "Renombrar archivo",
		"charactersNotAllowed.subtitle": "El nombre de archivo no puede contener ninguno de los siguientes caracteres: \\/:*?\"<>|"
	},
	en: {
		accept: "OK",
		cancel: "Cancel",
		yes: "Yes",
		no: "No",
		ohWow: "Oh, wow...",
		usingTouchableDevice1: "It appears that you are using a touch device. Use it in horizontal to continue.",
		usingTouchableDevice2: "'Ventanas 95' is an operating system for computers, you will not be able to see all its functionality,",
		usingTouchableDevice3: "To see all the functionality, use a computer or mouse!",
		file: "File",
		edition: "Edition",
		search: "Search",
		help: "Help",
		see: "See",
		goTo: "Go to",
		favourites: "Favourites",
		direction: "Direction",
		"tetrisGame.score": "Score",
		"tetrisGame.level": "Level",
		"tetrisGame.lines": "Lines",
		"tetrisGame.next": "Next",
		"tetrisGame.pause": "Pause",
		"tetrisGame.resume": "Resume",
		"tetrisGame.mute": "Mute",
		"tetrisGame.unmute": "Unmute",
		"tetrisGame.gameOver": "Game Over!",
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
		"desktopIcon.tetrisGame": "Tetris game",
		"desktopIcon.about.text": aboutNotepadTextEnglish,
		"tooltip.text": tooltipEnglish,
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
		"nameAlreadyInUseInNewRoute.subtitle": "Cannot move {{filename}}: A file with the name you specified already exists in the new destination route.",
		"charactersNotAllowed.title": "Rename",
		"charactersNotAllowed.subtitle": "A filename cannot contain any of the following characters: \\/:*?\"<>|"
	}
}

export default translations
