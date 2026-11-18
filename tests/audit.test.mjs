import assert from "node:assert/strict";
import test from "node:test";
import { onlyBuildTimePicomatch } from "../scripts/audit.mjs";

const cause = {
  url: "https://github.com/advisories/GHSA-fc5q-39xc-vjpf",
  name: "picomatch",
  range: "<=4.0.7",
  severity: "high",
};
const root = {
  isDirect: false,
  fixAvailable: false,
  nodes: ["node_modules/picomatch"],
  via: [cause],
};
const lock = { packages: { "node_modules/picomatch": { version: "4.0.7" } } };
function report(vulnerabilities) {
  return {
    auditReportVersion: 2,
    metadata: {
      vulnerabilities: { total: Object.keys(vulnerabilities).length },
    },
    vulnerabilities,
  };
}
test("accepts only the pinned picomatch advisory and dependents reporting it", () => {
  assert.ok(
    onlyBuildTimePicomatch(
      report({
        vite: { via: ["tinyglobby", "picomatch"] },
        tinyglobby: { via: ["picomatch"] },
        picomatch: root,
      }),
      lock,
    ),
  );
});
test("only a major downgrade of existing tooling is tolerated as an npm remediation", () => {
  const installed = {
    packages: { ...lock.packages, "node_modules/vite": { version: "8.3.8" } },
  };
  const fixAvailable = { name: "vite", version: "6.2.7", isSemVerMajor: true };
  assert.ok(
    onlyBuildTimePicomatch(
      report({ picomatch: { ...root, fixAvailable } }),
      installed,
    ),
  );
});

test("a new advisory, version, dependency or audit error blocks the exception", () => {
  for (const value of [
    report({
      picomatch: { ...root, via: [cause, { ...cause, url: "other" }] },
    }),
    report({
      picomatch: root,
      vite: { via: ["picomatch", { ...cause, name: "vite" }] },
    }),
    report({ picomatch: root, a: { via: ["b"] }, b: { via: ["a"] } }),
    report({ picomatch: { ...root, isDirect: true } }),
    report({ picomatch: { ...root, fixAvailable: true } }),
    report({
      picomatch: {
        ...root,
        fixAvailable: {
          name: "picomatch",
          version: "4.0.8",
          isSemVerMajor: false,
        },
      },
    }),
    report({ picomatch: root, vite: { via: ["unknown"] } }),
    { ...report({ picomatch: root }), error: { code: "ENETWORK" } },
    { auditReportVersion: 1 },
  ])
    assert.equal(onlyBuildTimePicomatch(value, lock), false);
  assert.equal(
    onlyBuildTimePicomatch(report({ picomatch: root }), {
      packages: { "node_modules/picomatch": { version: "4.0.8" } },
    }),
    false,
  );
});
