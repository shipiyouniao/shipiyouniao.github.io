import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/",
  plugins: [
    {
      name: "personal-pages-boundary",
      configResolved(config) {
        if (config.command === "build" && config.base !== "/") {
          throw new Error("The personal site must build at the account root");
        }
      },
    },
    vue(),
    tailwindcss(),
  ],
  publicDir: "site",
});
