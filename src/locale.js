export function resolveLocale(stored, languages = []) {
  if (stored === "zh" || stored === "en") return stored;
  for (const language of languages) {
    const code = language.toLowerCase().split(/[-_]/)[0];
    if (code === "zh" || code === "en") return code;
  }
  return "en";
}
