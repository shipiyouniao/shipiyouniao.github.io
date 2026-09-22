import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";
import Page from "./Page.vue";
import "./style.css";
import { i18n } from "./i18n";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", component: Page },
    { path: "/notes", component: Page },
    { path: "/notes/:slug", component: Page },
    { path: "/projects", component: Page },
    { path: "/about", component: Page },
    { path: "/:pathMatch(.*)*", component: Page },
  ],
  scrollBehavior: () => ({ top: 0 }),
});
createApp(App).use(router).use(i18n).mount("#app");
