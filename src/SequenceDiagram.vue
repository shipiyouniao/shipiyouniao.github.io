<script setup>
import { ref, watch, useId } from "vue";
import { useI18n } from "vue-i18n";
import { Maximize2, X } from "@lucide/vue";
const props = defineProps({ source: { type: String, required: true } });
const { t } = useI18n();
const svg = ref("");
const failed = ref(false);
const dialog = ref(null);
const expanded = ref(false);
const id = "sequence-" + useId().replace(/[^a-zA-Z0-9]/g, "");
watch(
  () => props.source,
  async (source, _, onCleanup) => {
    let stale = false;
    onCleanup(() => (stale = true));
    svg.value = "";
    failed.value = false;
    try {
      const { default: mermaid } = await import("mermaid");
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "base",
        themeVariables: {
          primaryColor: "#edf5ef",
          primaryTextColor: "#294b3b",
          primaryBorderColor: "#a9c5b4",
          lineColor: "#688b77",
          fontFamily: "Segoe UI, Microsoft YaHei, sans-serif",
          fontSize: "14px",
        },
        sequence: {
          useMaxWidth: true,
          wrap: true,
          actorMargin: 35,
          diagramMarginX: 20,
          diagramMarginY: 20,
        },
      });
      const result = await mermaid.render(id, source);
      if (!stale) svg.value = result.svg;
    } catch {
      if (!stale) failed.value = true;
    }
  },
  { immediate: true },
);
</script>
<template>
  <figure class="sequence-figure">
    <figcaption>
      <span>{{ t("sequenceDiagram") }}</span
      ><button
        class="code-copy"
        :aria-label="t('expandDiagram')"
        :title="t('expandDiagram')"
        :disabled="!svg"
        @click="
          expanded = true;
          dialog.showModal();
        "
      >
        <Maximize2 :size="17" />
      </button>
    </figcaption>
    <div
      v-if="svg && !expanded"
      class="sequence-canvas"
      role="img"
      :aria-label="t('sequenceDiagram')"
      v-html="svg"
    ></div>
    <p v-else-if="!svg && !failed" role="status">{{ t("loadingDiagram") }}</p>
    <pre v-else-if="failed" class="diagram-fallback">{{ source }}</pre>
    <dialog
      ref="dialog"
      class="diagram-dialog"
      @close="expanded = false"
      @click="
        (event) => {
          if (event.target === dialog) dialog.close();
        }
      "
    >
      <div class="diagram-dialog-header">
        <strong>{{ t("sequenceDiagram") }}</strong
        ><button
          class="icon-button"
          :aria-label="t('closeDiagram')"
          @click="dialog.close()"
        >
          <X :size="20" />
        </button>
      </div>
      <div
        v-if="expanded"
        class="sequence-canvas expanded-canvas"
        v-html="svg"
      ></div>
    </dialog>
  </figure>
</template>
