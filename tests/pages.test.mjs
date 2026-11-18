import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import test from "node:test";
import { build, resolveConfig } from "vite";
import { createRequire } from "node:module";

test("a production chunk cannot ship the excepted build dependency", async () => {
  const input = createRequire(import.meta.url).resolve("picomatch");
  await assert.rejects(
    build({
      logLevel: "silent",
      build: {
        write: false,
        lib: { entry: input, formats: ["es"], fileName: "matcher" },
      },
    }),
    /picomatch audit exception is limited to build tooling/,
  );
});

test("a bundled worker cannot ship the excepted build dependency", async () => {
  await assert.rejects(
    build({
      logLevel: "silent",
      build: {
        write: false,
        lib: {
          entry: "tests/fixtures/worker-entry.mjs",
          formats: ["es"],
          fileName: "worker-test",
        },
      },
    }),
    /picomatch audit exception is limited to build tooling/,
  );
});

test("personal site owns only the account root, not the game build", async () => {
  const config = await resolveConfig({ logLevel: "silent" }, "build");
  assert.equal(config.base, "/");
  await assert.rejects(
    resolveConfig({ base: "/minefarer/", logLevel: "silent" }, "build"),
    /personal site must build at the account root/,
  );
  const publicFiles = (await readdir("site")).map((name) => name.toLowerCase());
  for (const name of ["index.html", "minefarer", "cname"]) {
    assert.ok(
      !publicFiles.includes(name),
      `Public files would override site ownership: ${name}`,
    );
  }
});
