import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

function keepPicomatchInBuildTools() {
  return {
    name: "keep-picomatch-in-build-tools",
    generateBundle(_, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (
          chunk.type === "chunk" &&
          Object.keys(chunk.modules).some((id) =>
            /[\\/]node_modules[\\/]picomatch[\\/]/.test(id),
          )
        ) {
          this.error(
            "The temporary picomatch audit exception is limited to build tooling.",
          );
        }
      }
    },
  };
}

export default defineConfig({
  base: "/",
  worker: { plugins: () => [keepPicomatchInBuildTools()] },
  plugins: [
    keepPicomatchInBuildTools(),
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
