<script setup>
import { ref, nextTick, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { Languages, ChevronDown, Check } from "@lucide/vue";
import { changeLanguage } from "./i18n";

const { t, locale } = useI18n();
const expanded = ref(false);
const root = ref(null);
const trigger = ref(null);
const active = ref(0);
const options = [
  { code: "zh", label: "中文", detail: "Chinese" },
  { code: "en", label: "English", detail: "英语" },
];
async function show(
  index = options.findIndex((item) => item.code === locale.value),
) {
  active.value = index;
  expanded.value = true;
  await nextTick();
  root.value?.querySelectorAll('[role="menuitemradio"]')[index]?.focus();
}
function close(restore = false) {
  expanded.value = false;
  if (restore) trigger.value?.focus();
}
function choose(code) {
  changeLanguage(code);
  close(true);
}
function onKeys(event) {
  const key = event.key;
  if (key === "Escape") {
    event.preventDefault();
    close(true);
  } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) {
    event.preventDefault();
    const index =
      key === "Home"
        ? 0
        : key === "End"
          ? 1
          : (active.value + (key === "ArrowDown" ? 1 : -1) + options.length) %
            options.length;
    show(index);
  } else if (key.toLowerCase() === "e") {
    event.preventDefault();
    show(1);
  }
}
function outside(event) {
  if (!root.value?.contains(event.target)) close();
}
function focusOut(event) {
  if (!root.value?.contains(event.relatedTarget)) close();
}
onMounted(() => document.addEventListener("pointerdown", outside));
onUnmounted(() => document.removeEventListener("pointerdown", outside));
</script>

<template>
  <div ref="root" class="language-control" @focusout="focusOut">
    <button
      ref="trigger"
      class="language-trigger"
      data-testid="language"
      :aria-label="t('language')"
      aria-haspopup="menu"
      :aria-expanded="expanded"
      aria-controls="language-menu"
      @click="expanded ? close() : show()"
      @keydown.down.prevent="show()"
      @keydown.up.prevent="show(1)"
    >
      <Languages :size="16" class="language-icon" />
      <span>{{ locale === "zh" ? "中文" : "English" }}</span>
      <ChevronDown
        :size="13"
        class="language-chevron"
        :class="{ rotated: expanded }"
      />
    </button>
    <div
      v-if="expanded"
      id="language-menu"
      class="language-menu"
      role="menu"
      :aria-label="t('language')"
      @keydown="onKeys"
    >
      <button
        v-for="(option, index) in options"
        :key="option.code"
        type="button"
        role="menuitemradio"
        :aria-checked="locale === option.code"
        :tabindex="active === index ? 0 : -1"
        :lang="option.code"
        :class="{ chosen: locale === option.code }"
        @focus="active = index"
        @click="choose(option.code)"
      >
        <span class="language-option-text"
          ><strong>{{ option.label }}</strong
          ><small>{{ option.detail }}</small></span
        >
        <Check v-if="locale === option.code" :size="16" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>
