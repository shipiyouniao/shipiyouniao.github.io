export function startWorker() {
  return new Worker(new URL("./matcher-worker.mjs", import.meta.url), {
    type: "module",
  });
}
