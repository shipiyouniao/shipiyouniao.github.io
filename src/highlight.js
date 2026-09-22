import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
const highlighter = createHighlighterCore({
  themes: [import("shiki/themes/github-light.mjs")],
  langs: [import("shiki/langs/python.mjs"), import("shiki/langs/cpp.mjs")],
  engine: createJavaScriptRegexEngine(),
});
export async function highlight(code, language) {
  const instance = await highlighter;
  return instance.codeToHtml(code, {
    lang: ["python", "cpp"].includes(language) ? language : "text",
    theme: "github-light",
  });
}
