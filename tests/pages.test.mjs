import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import test from "node:test";
import { resolveConfig } from "vite";

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
