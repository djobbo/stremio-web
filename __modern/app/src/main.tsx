import Bowser from "bowser"
import i18n from "i18next"
import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { initReactI18next } from "react-i18next"
import stremioTranslations from "stremio-translations"

import {App} from "./App"

const SENTRY_DSN = import.meta.env.SENTRY_DSN

if (typeof SENTRY_DSN === "string") {
  import("@sentry/browser").then((Sentry) => Sentry.init({ dsn: SENTRY_DSN }))
}

const browser = Bowser.parse(window.navigator?.userAgent || "")
if (browser?.platform?.type === "desktop") {
  document.querySelector('meta[name="viewport"]')?.setAttribute("content", "")
}

const translations = Object.fromEntries(
  Object.entries(stremioTranslations()).map(([key, value]) => [
    key,
    {
      translation: value,
    },
  ]),
)

i18n.use(initReactI18next).init({
  resources: translations,
  lng: "en-US",
  fallbackLng: "en-US",
  interpolation: {
    escapeValue: false,
  },
})

const rootNode = document.getElementById("app")!

ReactDOM.createRoot(rootNode).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (import.meta.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("service-worker.js")
      .catch((registrationError) => {
        console.error("SW registration failed: ", registrationError)
      })
  })
}
