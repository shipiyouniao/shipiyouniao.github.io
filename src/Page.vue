<script setup>
import { computed, ref, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  GitPullRequest,
  Gamepad2,
  MapPin,
  Mail,
  Search,
  ArrowLeft,
  Printer,
  Check,
  Copy,
  Tv,
  Music2,
  Play,
} from "@lucide/vue";
import { contributions, stack, bilibili } from "./content";
import RepositoryStats from "./RepositoryStats.vue";
import { defineAsyncComponent } from "vue";
const ArticleContent = defineAsyncComponent(
  () => import("./ArticleContent.vue"),
);
const { t, tm, rt, locale } = useI18n();
const route = useRoute();
const home = computed(() => route.path === "/");
const article = computed(() =>
  contributions.find((item) => item.slug === route.params.slug),
);
const query = ref("");
const filteredNotes = computed(() =>
  contributions.filter((item) =>
    `${t(item.slug + ".title")} ${t(item.slug + ".summary")} ${item.repo} ${item.number}`
      .toLowerCase()
      .includes(query.value.toLowerCase()),
  ),
);
const copied = ref(false);
const copyError = ref(false);
let timer;
onUnmounted(() => clearTimeout(timer));
async function copyEmail() {
  try {
    await navigator.clipboard.writeText("2960474346@qq.com");
    copied.value = true;
    copyError.value = false;
    clearTimeout(timer);
    timer = setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    copyError.value = true;
  }
}
function printResume() {
  window.print();
}
function dateLabel(date) {
  return new Intl.DateTimeFormat(locale.value === "zh" ? "zh-CN" : "en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(date + "T00:00:00Z"));
}
</script>
<template>
  <template v-if="home">
    <section class="hero">
      <img
        class="hero-image"
        src="/images/mountains.jpg"
        :alt="t('mountainAlt')"
        fetchpriority="high"
      />
      <div class="hero-wash"></div>
      <div class="shell hero-content">
        <div class="eyebrow">
          <span class="status-dot"></span>{{ t("eyebrow") }}
        </div>
        <h1>{{ t("name") }}<span class="name-dot">.</span></h1>
        <p class="hero-handle">
          {{ locale === "zh" ? "shipiyouniao" : "石皮幼鸟" }}
        </p>
        <p class="hero-description">{{ t("hero1") }}<br />{{ t("hero2") }}</p>
        <p class="hero-detail">{{ t("role") }}<br />{{ t("focus") }}</p>
        <div class="flex flex-wrap items-center gap-3 mt-7">
          <RouterLink class="button primary" to="/projects"
            >{{ t("seeWork") }} <ArrowUpRight :size="17" /></RouterLink
          ><RouterLink class="button glass" to="/about"
            >{{ t("about") }} <ArrowRight :size="16"
          /></RouterLink>
        </div>
        <div class="hero-foot">
          <span><MapPin :size="13" />{{ t("location") }}</span
          ><span>{{ t("curious") }}</span>
        </div>
      </div>
      <a
        class="photo-credit"
        href="https://unsplash.com"
        target="_blank"
        rel="noopener noreferrer"
        >{{ t("photoCredit") }} <ArrowUpRight :size="11"
      /></a>
    </section>
    <section class="shell section home-intro">
      <div class="section-heading">
        <div>
          <span class="eyebrow">{{ t("introEyebrow") }}</span>
          <h2>{{ t("introTitle") }}</h2>
        </div>
        <RouterLink class="text-link" to="/about"
          >{{ t("meet") }} <ArrowUpRight :size="16"
        /></RouterLink>
      </div>
      <div class="intro-grid">
        <p class="intro-lead">{{ t("introLead") }}</p>
        <div>
          <p>{{ t("introBody") }}</p>
          <p class="mt-3">{{ t("introFun") }}</p>
        </div>
      </div>
    </section>
  </template>
  <section
    v-if="home || route.path === '/notes'"
    class="shell section notes-section"
  >
    <div class="section-heading">
      <div>
        <span class="eyebrow">{{ t("notesEyebrow") }}</span
        ><component :is="home ? 'h2' : 'h1'"
          >{{ t("notesTitle") }}<span class="heading-dot"> / </span></component
        >
      </div>
      <RouterLink v-if="home" class="text-link" to="/notes"
        >{{ t("allNotes") }} <ArrowUpRight :size="16" /></RouterLink
      ><span v-else class="muted">{{
        t("notesCount", { count: contributions.length })
      }}</span>
    </div>
    <div v-if="!home" class="filter-bar">
      <label class="search"
        ><Search :size="16" /><input
          v-model="query"
          :aria-label="t('search')"
          :placeholder="t('search')"
          type="search"
      /></label>
    </div>
    <div class="notes-grid">
      <RouterLink
        v-for="item in home ? contributions.slice(-3) : filteredNotes"
        :key="item.slug"
        :to="`/notes/${item.slug}`"
        class="note-card"
        ><div class="note-meta">
          <span>{{ item.repo }} #{{ item.number }}</span
          ><span>{{ t("merged") }}</span>
        </div>
        <div class="note-symbol"><GitPullRequest :size="25" /></div>
        <h3>{{ t(item.slug + ".title") }}</h3>
        <p>{{ t(item.slug + ".summary") }}</p>
        <div class="note-bottom">
          <time :datetime="item.date">{{ dateLabel(item.date) }}</time
          ><ArrowUpRight :size="19" /></div
      ></RouterLink>
    </div>
    <p v-if="!home && !filteredNotes.length" class="empty">{{ t("empty") }}</p>
  </section>
  <section
    v-if="home || route.path === '/projects'"
    class="shell section projects-section"
  >
    <div class="section-heading">
      <div>
        <span class="eyebrow">{{ t("workEyebrow") }}</span
        ><component :is="home ? 'h2' : 'h1'"
          >{{ t("workTitle") }}<span class="heading-dot"> / </span></component
        >
      </div>
      <span class="muted">{{ t("workSubtitle") }}</span>
    </div>
    <div class="project-row game-project">
      <a class="project-image" href="https://shipiyouniao.github.io/minefarer/"
        ><img src="/images/minefarer.png" :alt="t('gameAlt')" loading="lazy"
      /></a>
      <div class="project-copy">
        <span class="project-kicker"
          ><Gamepad2 :size="15" />{{ t("gameLabel") }}</span
        >
        <h3>Minefarer</h3>
        <p>{{ t("gameText") }}</p>
        <div class="tags">
          <span>TypeScript</span><span>{{ t("gameDesign") }}</span>
        </div>
        <div class="flex flex-wrap gap-5 mt-6">
          <a class="text-link" href="https://shipiyouniao.github.io/minefarer/"
            >{{ t("play") }} <ArrowUpRight :size="16" /></a
          ><a
            class="subtle-link"
            href="https://github.com/shipiyouniao/minefarer"
            >{{ t("code") }} <ArrowUpRight :size="14"
          /></a>
        </div>
      </div>
    </div>
    <div class="opensource-row">
      <div>
        <span class="project-kicker"
          ><Code2 :size="15" />{{ t("openSource") }}</span
        >
        <h3>KVCached</h3>
        <p>{{ t("kvText") }}</p>
        <RepositoryStats repo="ovg-project/kvcached" />
        <a class="text-link mt-5" href="https://github.com/ovg-project/kvcached"
          >{{ t("repo") }} <ArrowUpRight :size="16"
        /></a>
      </div>
      <div class="contribution-list">
        <a
          v-for="item in [402, 385, 443].map((number) =>
            contributions.find(
              (item) => item.repo === 'KVCached' && item.number === number,
            ),
          )"
          :key="item.slug"
          :href="item.url"
          target="_blank"
          rel="noopener noreferrer"
          ><GitPullRequest :size="18" />
          <div>
            <span class="contribution-label"
              >{{ item.repo }} #{{ item.number }} · {{ t("merged") }}</span
            >
            <h4>{{ t(item.slug + ".title") }}</h4>
            <p>{{ t(item.slug + ".summary") }}</p>
          </div>
          <ArrowUpRight :size="17"
        /></a>
      </div>
    </div>
    <div v-if="!home" class="other-projects">
      <a href="https://github.com/NagareWorks"
        ><h3>NNRP <ArrowUpRight :size="18" /></h3>
        <p>{{ t("nnrpText") }}</p></a
      ><a href="https://github.com/shipiyouniao/UnityEasyInject"
        ><h3>UnityEasyInject <ArrowUpRight :size="18" /></h3>
        <p>{{ t("unityText") }}</p></a
      >
    </div>
  </section>
  <section v-if="route.path === '/about'" class="shell section about-page">
    <div class="section-heading">
      <div>
        <span class="eyebrow">{{ t("behind") }}</span>
        <h1>{{ t("hello") }}</h1>
      </div>
      <button
        class="icon-button print-button"
        :title="t('print')"
        :aria-label="t('print')"
        @click="printResume"
      >
        <Printer :size="20" />
      </button>
    </div>
    <div class="about-lead">
      <img
        src="/images/avatar.png"
        :alt="t('avatar')"
        width="112"
        height="112"
      />
      <div>
        <h2>{{ t("fullstack") }}</h2>
        <p>{{ t("company") }}</p>
        <p>{{ t("contributor") }}</p>
      </div>
    </div>
    <p class="about-description">{{ t("aboutBody") }}</p>
    <section class="experience-section">
      <h2>{{ t("experience") }}</h2>
      <p class="experience-company">{{ t("joined") }}</p>
      <div class="experience-row">
        <span class="experience-period">{{ t("current") }}</span>
        <div>
          <h3>{{ t("sccTitle") }}</h3>
          <p>{{ t("sccBody") }}</p>
        </div>
      </div>
      <div class="experience-row">
        <span class="experience-period">{{ t("previous") }}</span>
        <div>
          <h3>{{ t("scpTitle") }}</h3>
          <p v-for="(paragraph, index) in tm('scpBody')" :key="index">
            {{ rt(paragraph) }}
          </p>
          <p>{{ t("dslBody") }}</p>
        </div>
      </div>
    </section>
    <section class="experience-section" aria-labelledby="opensource-experience">
      <h2 id="opensource-experience">{{ t("openExperience") }}</h2>
      <div class="about-repositories">
        <RepositoryStats repo="ovg-project/kvcached" />
        <RepositoryStats repo="vllm-project/vllm" />
      </div>
      <div class="experience-row">
        <span class="experience-period">KVCached</span>
        <div>
          <h3>{{ t("openMemoryTitle") }}</h3>
          <p v-for="(paragraph, index) in tm('openMemoryBody')" :key="index">
            {{ rt(paragraph) }}
          </p>
        </div>
      </div>
      <div class="experience-row">
        <span class="experience-period">vLLM · SGLang</span>
        <div>
          <h3>{{ t("openEngineTitle") }}</h3>
          <p v-for="(paragraph, index) in tm('openEngineBody')" :key="index">
            {{ rt(paragraph) }}
          </p>
        </div>
      </div>
      <div class="experience-row">
        <span class="experience-period">{{ t("openCollaboration") }}</span>
        <div>
          <h3>{{ t("openObservabilityTitle") }}</h3>
          <p
            v-for="(paragraph, index) in tm('openObservabilityBody')"
            :key="index"
          >
            {{ rt(paragraph) }}
          </p>
        </div>
      </div>
    </section>
    <section class="education-section">
      <h2>{{ t("education") }}</h2>
      <h3>{{ t("university") }}</h3>
      <p>{{ t("degree") }}</p>
      <div class="mt-7">
        <h3>{{ t("studioTitle") }}</h3>
        <p>{{ t("studioBody") }}</p>
      </div>
      <div class="mt-7">
        <h3>{{ t("labTitle") }}</h3>
        <p v-for="(paragraph, index) in tm('labBody')" :key="index">
          {{ rt(paragraph) }}
        </p>
      </div>
    </section>
    <h2 class="mt-12 mb-5">{{ t("stack") }}</h2>
    <div class="stack-table">
      <div v-for="[key, ...items] in stack" :key="key">
        <h3>{{ t(key) }}</h3>
        <p>
          <span v-for="item in items" :key="item">{{ item }}</span>
        </p>
      </div>
    </div>
    <div class="contact-strip">
      <div>
        <h2>{{ t("contactTitle") }}</h2>
        <a href="mailto:2960474346@qq.com">2960474346@qq.com</a
        ><span v-if="copyError" role="status">{{ t("copyFallback") }}</span>
      </div>
      <button
        class="icon-button"
        :title="t(copied ? 'copied' : 'copy')"
        :aria-label="t(copied ? 'copied' : 'copy')"
        @click="copyEmail"
      >
        <Check v-if="copied" :size="20" /><Copy v-else :size="20" /></button
      ><span role="status" class="sr-only">{{
        copied ? t("copied") : ""
      }}</span>
    </div>
  </section>
  <article v-else-if="article" class="article shell section">
    <RouterLink class="text-link" to="/notes"
      ><ArrowLeft :size="16" />{{ t("backNotes") }}</RouterLink
    >
    <div class="article-meta">
      {{ article.repo }} #{{ article.number }} ·
      {{ t("mergedOn", { date: dateLabel(article.date) }) }}
    </div>
    <h1>{{ t(article.slug + ".title") }}</h1>
    <p class="article-summary">{{ t(article.slug + ".summary") }}</p>
    <ArticleContent :slug="article.slug" />
    <a
      class="text-link"
      :href="article.url"
      target="_blank"
      rel="noopener noreferrer"
      >{{ t("source") }} <ArrowUpRight :size="16"
    /></a>
  </article>
  <section
    v-else-if="!home && !['/notes', '/projects', '/about'].includes(route.path)"
    class="shell section empty"
  >
    <h1>{{ t("missing") }}</h1>
    <RouterLink to="/" class="text-link"
      >{{ t("backHome") }} <ArrowRight :size="16"
    /></RouterLink>
  </section>
  <section
    v-if="home || route.path === '/about'"
    class="shell section video-section"
  >
    <div class="section-heading">
      <div>
        <span class="eyebrow">{{ t("biliEyebrow") }}</span>
        <h2>{{ t("biliTitle") }}</h2>
      </div>
      <Tv :size="25" class="bili-icon" />
    </div>
    <div class="video-layout">
      <div>
        <p>{{ t("biliBody") }}</p>
        <p class="video-history">{{ t("biliHistory") }}</p>
        <a
          class="button bili-button mt-6"
          :href="bilibili"
          target="_blank"
          rel="noopener noreferrer"
          ><Tv :size="18" />{{ t("biliVisit") }} <ArrowUpRight :size="17"
        /></a>
      </div>
      <div class="video-links">
        <a
          href="https://www.bilibili.com/video/BV1ZsxmeHEW8/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Code2 :size="22" />
          <div>
            <small>{{ t("biliCourse") }}</small>
            <h3>{{ t("biliCourseTitle") }}</h3>
          </div>
          <ArrowUpRight :size="18" />
        </a>
        <a
          href="https://www.bilibili.com/read/mobile-readlist/rl17559"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Gamepad2 :size="22" />
          <div>
            <small>{{ t("biliGuide") }}</small>
            <h3>{{ t("biliGuideTitle") }}</h3>
          </div>
          <ArrowUpRight :size="18" />
        </a>
        <a
          href="https://www.bilibili.com/video/BV1Xzea6vEn8/"
          target="_blank"
          rel="noopener noreferrer"
          ><Music2 :size="22" />
          <div>
            <small>{{ t("biliRhythm") }}</small>
            <h3>{{ t("biliVideo1") }}</h3>
          </div>
          <Play :size="18" /></a
        ><a
          href="https://www.bilibili.com/video/BV1Kr4y1J7wc/"
          target="_blank"
          rel="noopener noreferrer"
          ><Gamepad2 :size="22" />
          <div>
            <small>{{ t("biliGuide") }}</small>
            <h3>{{ t("biliVideo2") }}</h3>
          </div>
          <Play :size="18"
        /></a>
      </div>
    </div>
  </section>
  <section v-if="home" class="shell closing">
    <span class="eyebrow">{{ t("connect") }}</span>
    <h2>{{ t("closing") }}</h2>
    <a class="text-link" href="mailto:2960474346@qq.com"
      ><Mail :size="17" />{{ t("sayHi") }} <ArrowUpRight :size="16"
    /></a>
  </section>
</template>
