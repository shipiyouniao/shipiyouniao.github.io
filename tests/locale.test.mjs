import test from "node:test";
import assert from "node:assert/strict";
import messages from "../src/locales/messages.js";
import { resolveLocale } from "../src/locale.js";
import { contributions } from "../src/content.js";

test("language selection respects explicit choice, browser order, and fallback", () => {
  assert.equal(resolveLocale("en", ["zh-CN"]), "en");
  assert.equal(resolveLocale(null, ["zh-TW"]), "zh");
  assert.equal(resolveLocale(null, ["en-GB", "zh"]), "en");
  assert.equal(resolveLocale(null, ["fr-FR", "zh-CN"]), "zh");
  assert.equal(resolveLocale("invalid", ["ja-JP"]), "en");
});

test("both languages have identical keys and interpolation parameters", () => {
  function compare(a, b) {
    assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort());
    for (const key of Object.keys(a)) {
      if (typeof a[key] === "object") compare(a[key], b[key]);
      else {
        assert.equal(typeof b[key], "string");
        assert.ok(a[key].length && b[key].length);
        assert.deepEqual(
          a[key].match(/\{\w+\}/g) || [],
          b[key].match(/\{\w+\}/g) || [],
        );
      }
    }
  }
  compare(messages.zh, messages.en);
});

test("each PR has bilingual summaries and a public source", () => {
  for (const item of contributions) {
    assert.match(item.url, /^https:\/\/github.com\/[^/]+\/[^/]+\/pull\/\d+$/);
    for (const language of ["zh", "en"]) {
      for (const key of ["title", "summary", "problem", "change", "evidence"])
        assert.ok(messages[language][item.slug][key]);
    }
  }
});
