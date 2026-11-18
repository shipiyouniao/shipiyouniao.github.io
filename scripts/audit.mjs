import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const advisory = "https://github.com/advisories/GHSA-fc5q-39xc-vjpf";

// npm reports one entry per affected dependent as well as the root advisory.
export function onlyBuildTimePicomatch(report, lock) {
  if (report?.error || report?.auditReportVersion !== 2) return false;
  const entries = Object.entries(report.vulnerabilities ?? {});
  if (
    !entries.length ||
    entries.length !== report.metadata?.vulnerabilities?.total
  )
    return false;
  const root = report.vulnerabilities.picomatch;
  if (
    root?.isDirect !== false ||
    !root.nodes?.length ||
    !root.nodes.every(
      (path) =>
        /(?:^|\/)node_modules\/picomatch$/.test(path) &&
        lock.packages[path]?.version === "4.0.7",
    )
  )
    return false;
  if (
    root.via?.length !== 1 ||
    root.via[0]?.url !== advisory ||
    root.via[0].name !== "picomatch" ||
    root.via[0].range !== "<=4.0.7" ||
    root.via[0].severity !== "high"
  )
    return false;

  // npm can propose downgrading the entire router or bundler even when
  // no patched picomatch exists. A compatible fix ends the exception.
  const fix = root.fixAvailable;
  if (fix !== false) {
    const installed = lock.packages["node_modules/" + fix?.name]?.version;
    if (
      fix?.isSemVerMajor !== true ||
      !["vite", "vue-router"].includes(fix.name) ||
      !(parseInt(fix.version, 10) < parseInt(installed, 10))
    )
      return false;
  }
  const covered = new Set(["picomatch"]);
  let count;
  do {
    count = covered.size;
    for (const [name, item] of entries) {
      if (item.via?.length && item.via.every((cause) => covered.has(cause)))
        covered.add(name);
    }
  } while (count !== covered.size);
  return covered.size === entries.length;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const audit = spawnSync(
    process.execPath,
    [
      process.env.npm_execpath,
      "audit",
      "--json",
      "--include=dev",
      "--audit-level=low",
    ],
    { encoding: "utf8" },
  );
  if (audit.error) throw audit.error;
  if (audit.stderr) process.stderr.write(audit.stderr);
  const report = JSON.parse(audit.stdout);
  if (
    audit.status === 0 &&
    report.auditReportVersion === 2 &&
    !report.error &&
    report.metadata?.vulnerabilities?.total === 0 &&
    Object.keys(report.vulnerabilities).length === 0
  ) {
    console.log("npm audit found no vulnerabilities.");
  } else if (
    audit.status === 1 &&
    onlyBuildTimePicomatch(
      report,
      JSON.parse(readFileSync("package-lock.json", "utf8")),
    )
  ) {
    console.warn(
      "Temporary build-only exception for picomatch 4.0.7: " + advisory,
    );
    console.warn(
      "npm remediation:",
      report.vulnerabilities.picomatch.fixAvailable,
    );
  } else {
    console.error(audit.stdout);
    process.exitCode = 1;
  }
}
