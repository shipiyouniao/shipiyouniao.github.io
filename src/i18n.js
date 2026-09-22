import { createI18n } from "vue-i18n";
import messages from "./locales/messages";
import { resolveLocale } from "./locale";

let stored;
try {
  stored = localStorage.getItem("site-language");
} catch {
  /* Storage may be disabled. */
}
export const i18n = createI18n({
  legacy: false,
  locale: resolveLocale(stored, navigator.languages || [navigator.language]),
  fallbackLocale: "en",
  messages,
});
export function changeLanguage(language) {
  i18n.global.locale.value = resolveLocale(language);
  try {
    localStorage.setItem("site-language", i18n.global.locale.value);
  } catch {
    /* Keep the switch functional without persistence. */
  }
}
