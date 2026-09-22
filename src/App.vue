<script setup>
import { Code2, ArrowUpRight, Menu, X } from "@lucide/vue";
import { ref, watch, watchEffect } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import LanguageSwitcher from "./LanguageSwitcher.vue";
import { bilibili, contributions } from "./content";
const { t, locale } = useI18n();
const open = ref(false);
const route = useRoute();
watch(
  () => route.path,
  () => {
    open.value = false;
  },
);
const links = [
  ["/", "home"],
  ["/notes", "notes"],
  ["/projects", "projects"],
  ["/about", "about"],
];
watchEffect(() => {
  document.documentElement.lang = locale.value === "zh" ? "zh-CN" : "en";
  const article = contributions.find((item) => item.slug === route.params.slug);
  const key = links.find(([path]) => path === route.path)?.[1] || "missing";
  document.title = `${article ? t(article.slug + ".title") : t(key)} · ${t("name")}`;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", t("description"));
});
function focusMain(event) {
  event.preventDefault();
  document.getElementById("main")?.focus();
}
</script>
<template>
  <a href="#main" class="skip-link" @click="focusMain">{{ t("skip") }}</a>
  <header class="site-header">
    <div class="nav-wrap">
      <RouterLink to="/" class="brand"
        ><span class="brand-mark">S<span>.</span></span
        ><span>{{ t("name") }}<small>shipiyouniao</small></span></RouterLink
      >
      <nav class="desktop-nav" :aria-label="t('nav')">
        <RouterLink
          v-for="[path, key] in links"
          :key="path"
          :to="path"
          :class="{
            selected:
              path === '/' ? route.path === '/' : route.path.startsWith(path),
          }"
          >{{ t(key) }}</RouterLink
        >
      </nav>
      <div class="nav-actions">
        <a
          class="github-nav"
          href="https://github.com/shipiyouniao"
          target="_blank"
          rel="noopener noreferrer"
          ><Code2 :size="17" /> GitHub <ArrowUpRight :size="14"
        /></a>
        <LanguageSwitcher />
        <button
          class="menu-button"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          :aria-label="t('toggleNav')"
          @click="open = !open"
        >
          <X v-if="open" :size="22" /><Menu v-else :size="22" />
        </button>
      </div>
    </div>
    <nav
      v-if="open"
      id="mobile-nav"
      class="mobile-nav"
      :aria-label="t('mobileNav')"
    >
      <RouterLink v-for="[path, key] in links" :key="path" :to="path">{{
        t(key)
      }}</RouterLink>
    </nav>
  </header>
  <main id="main" tabindex="-1"><RouterView /></main>
  <footer class="footer shell">
    <div>
      <strong>{{ t("name") }}<span class="text-emerald-700">.</span></strong>
      <p>{{ t("footer") }}</p>
    </div>
    <div class="footer-links">
      <a href="https://github.com/shipiyouniao"
        >GitHub <ArrowUpRight :size="13" /></a
      ><a :href="bilibili" target="_blank" rel="noopener noreferrer"
        >Bilibili <ArrowUpRight :size="13" /></a
      ><a href="mailto:2960474346@qq.com">Email <ArrowUpRight :size="13" /></a
      ><span>© {{ new Date().getFullYear() }} shipiyouniao</span>
    </div>
  </footer>
</template>
