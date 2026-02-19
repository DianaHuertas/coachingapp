import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      appName: "LIFTRIX",
      tagline: "Use the same routines and programs your coach assigns you.",
      login: "Log in",
      createAccount: "Create an account",
      email: "Email",
      password: "Password",
      name: "Name",
      continue: "CONTINUE",
      back: "Back",

      // Register chat
      regTitle: "CREATE YOUR ACCOUNT",
      regAskName: "Hey! What's your name?",
      regNiceToMeet: "Nice to meet you, {{name}}. Let's start your new lifestyle!",
      regAskEmail: "What's your email?",
      regAskPassword: "Create a password",

      // Questionnaire placeholders
      injuries: "Do you have any injuries?",
      yes: "Yes",
      no: "No",
    },
  },
  es: {
    translation: {
      appName: "LIFTRIX",
      tagline: "Usa las mismas rutinas y programas que tu coach te asigna.",
      login: "Iniciar sesión",
      createAccount: "Crear una cuenta",
      email: "Correo",
      password: "Contraseña",
      name: "Nombre",
      continue: "CONTINUAR",
      back: "Volver",

      // Register chat
      regTitle: "CREA TU CUENTA",
      regAskName: "¿Qué tal? ¿Cuál es tu nombre?",
      regNiceToMeet: "Un gusto, {{name}}. ¡Hoy empezamos con tu nuevo estilo de vida!",
      regAskEmail: "¿Cuál es tu correo?",
      regAskPassword: "Crea una contraseña",

      // Questionnaire placeholders
      injuries: "¿Tienes alguna lesión?",
      yes: "Sí",
      no: "No",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("lang") || "es",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
