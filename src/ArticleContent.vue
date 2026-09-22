<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import MarkdownIt from "markdown-it";
import CodeBlock from "./CodeBlock.vue";
import SequenceDiagram from "./SequenceDiagram.vue";
const props = defineProps({ slug: { type: String, required: true } });
const { locale, t } = useI18n();
const documents = import.meta.glob("./articles/*/*.md", {
  query: "?raw",
  import: "default",
});
const blocks = ref([]);
const toc = ref([]);
const state = ref("loading");
const md = new MarkdownIt({ html: false, linkify: false, typographer: false });
watch(
  () => [props.slug, locale.value],
  async ([slug, language], _, onCleanup) => {
    let stale = false;
    onCleanup(() => (stale = true));
    state.value = "loading";
    blocks.value = [];
    toc.value = [];
    try {
      const loader = documents[`./articles/${language}/${slug}.md`];
      if (!loader) throw new Error("Missing translation");
      const source = await loader();
      if (stale) return;
      const tokens = md.parse(source, {});
      const result = [];
      const headings = [];
      let pending = [];
      function flush() {
        if (pending.length) {
          result.push({
            type: "html",
            html: md.renderer.render(pending, md.options, {}),
          });
          pending = [];
        }
      }
      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.type === "heading_open" && token.tag === "h2") {
          const id = `article-section-${headings.length}`;
          token.attrSet("id", id);
          token.attrSet("tabindex", "-1");
          headings.push({ id, label: tokens[i + 1].content });
        }
        if (token.type === "fence") {
          flush();
          const language = token.info.trim().split(/\s/)[0] || "text";
          result.push({
            type: language === "mermaid" ? "diagram" : "code",
            language,
            code: token.content,
          });
        } else pending.push(token);
      }
      flush();
      blocks.value = result;
      toc.value = headings;
      state.value = "ready";
    } catch {
      if (!stale) state.value = "error";
    }
  },
  { immediate: true },
);
function jump(id) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ block: "start" });
  el?.focus({ preventScroll: true });
}
</script>
<template>
  <div class="article-body article-detail" :key="slug + '-' + locale">
    <p v-if="state === 'loading'" role="status">{{ t("loadingArticle") }}</p>
    <p v-else-if="state === 'error'" role="alert">{{ t("articleError") }}</p>
    <template v-else>
      <nav class="article-toc" :aria-label="t('contents')">
        <strong>{{ t("contents") }}</strong
        ><button
          v-for="heading in toc"
          :key="heading.id"
          @click="jump(heading.id)"
        >
          {{ heading.label }}
        </button>
      </nav>
      <template v-for="(block, index) in blocks" :key="index">
        <CodeBlock
          v-if="block.type === 'code'"
          :code="block.code"
          :language="block.language"
        />
        <SequenceDiagram
          v-else-if="block.type === 'diagram'"
          :source="block.code"
        />
        <div v-else class="article-prose" v-html="block.html"></div>
      </template>
    </template>
  </div>
</template>
