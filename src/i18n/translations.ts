type Translations = {
  [locale: string]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  es: {
    "accept": "Aceptar",
    "cancel": "Cancelar",
    "login.title": "Escriba la contraseña de red",
    "login.description": "Escriba la contraseña de red 'Ventanas 95'. Es un login falso :)",
    "login.username": "Nombre de usuario:",
    "login.password": "Contraseña:",
  },
  en: {
    "accept": "OK",
    "cancel": "Cancel",
    "login.title": "Enter Network Password",
    "login.description": "Enter your network password for 'Ventanas 95' Networking. It is a fake login :)",
    "login.username": "User name:",
    "login.password": "Password:",
  },
};

export default translations;