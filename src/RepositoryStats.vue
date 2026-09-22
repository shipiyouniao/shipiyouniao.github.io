<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import { Star, GitFork, RefreshCw } from "@lucide/vue";
import { fetchRepositoryStats } from "./repositoryStats";
const props = defineProps({ repo: { type: String, required: true } });
const { t, locale } = useI18n();
const stats = ref(null);
const busy = ref(false);
const failed = ref(false);
let alive = true;
let timer;
async function refresh(force = false) {
  if (busy.value) return;
  busy.value = true;
  try {
    const value = await fetchRepositoryStats(props.repo, force);
    if (alive) {
      stats.value = value;
      failed.value = false;
    }
  } catch {
    if (alive) failed.value = true;
  } finally {
    if (alive) busy.value = false;
  }
}
onMounted(() => {
  refresh();
  timer = setInterval(
    () => {
      if (document.visibilityState === "visible") refresh();
    },
    5 * 60 * 1000,
  );
});
onUnmounted(() => {
  alive = false;
  clearInterval(timer);
});
</script>
<template>
  <div
    class="repository-stats"
    :aria-label="t('repositoryStats')"
    :data-repo="repo"
  >
    <div class="repo-stats-main">
      <a
        :href="'https://github.com/' + repo"
        target="_blank"
        rel="noopener noreferrer"
        class="repo-stats-name"
        >{{ repo }}</a
      >
      <a
        :href="'https://github.com/' + repo + '/stargazers'"
        target="_blank"
        rel="noopener noreferrer"
        ><Star :size="15" /><span>{{
          stats ? stats.stars.toLocaleString(locale) : "—"
        }}</span
        ><span>Stars</span></a
      >
      <a
        :href="'https://github.com/' + repo + '/forks'"
        target="_blank"
        rel="noopener noreferrer"
        ><GitFork :size="15" /><span>{{
          stats ? stats.forks.toLocaleString(locale) : "—"
        }}</span
        ><span>Forks</span></a
      >
      <button
        class="code-copy"
        :disabled="busy"
        :aria-label="t('refreshStats')"
        :title="t('refreshStats')"
        @click="refresh(true)"
      >
        <RefreshCw :size="15" :class="{ 'is-refreshing': busy }" />
      </button>
    </div>
    <small role="status">{{
      failed
        ? t(stats ? "statsStale" : "statsUnavailable")
        : stats
          ? t("statsUpdated", {
              time: new Date(stats.checkedAt).toLocaleTimeString(locale, {
                hour: "2-digit",
                minute: "2-digit",
              }),
            })
          : t("statsLoading")
    }}</small>
  </div>
</template>
