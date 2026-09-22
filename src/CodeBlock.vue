<script setup>
import { ref, watch, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { Copy, Check } from "@lucide/vue";
import { highlight } from "./highlight";
const props = defineProps({
  code: { type: String, required: true },
  language: { type: String, default: "text" },
});
const { t } = useI18n();
const html = ref("");
const copied = ref(false);
const failed = ref(false);
let timer;
watch(
  () => [props.code, props.language],
  async ([code, language], _, onCleanup) => {
    let stale = false;
    onCleanup(() => {
      stale = true;
    });
    html.value = "";
    try {
      const result = await highlight(code, language);
      if (!stale) html.value = result;
    } catch {
      /* Plain code remains readable if highlighting cannot load. */
    }
  },
  { immediate: true },
);
async function copy() {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    failed.value = false;
    clearTimeout(timer);
    timer = setTimeout(() => (copied.value = false), 2000);
  } catch {
    failed.value = true;
  }
}
onUnmounted(() => clearTimeout(timer));
</script>
<template>
  <div class="code-block">
    <div class="code-toolbar">
      <span>{{ language }}</span
      ><button
        class="code-copy"
        :aria-label="t(copied ? 'codeCopied' : 'copyCode')"
        :title="t(copied ? 'codeCopied' : 'copyCode')"
        @click="copy"
      >
        <Check v-if="copied" :size="16" /><Copy v-else :size="16" />
      </button>
    </div>
    <div v-if="html" class="highlighted-code" v-html="html"></div>
    <pre v-else><code>{{ code }}</code></pre>
    <span class="sr-only" role="status">{{
      copied ? t("codeCopied") : ""
    }}</span>
    <p v-if="failed" class="copy-error" role="status">
      {{ t("codeCopyFailed") }}
    </p>
  </div>
</template>
