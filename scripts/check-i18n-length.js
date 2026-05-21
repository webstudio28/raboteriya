#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");

function codepointLength(s) {
  return [...String(s)].length;
}

function isPlainObject(x) {
  return x && typeof x === "object" && !Array.isArray(x);
}

function parseArgs(argv) {
  const out = {
    maxRatio: null,
    maxRatioShort: 1.05, // EN <= 20 chars
    maxRatioMedium: 1.12, // EN <= 60 chars
    maxRatioLong: 1.2, // EN > 60 chars
    strict: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--strict") out.strict = true;
    else if (a === "--maxRatio") out.maxRatio = Number(argv[++i]);
    else if (a === "--maxRatioShort") out.maxRatioShort = Number(argv[++i]);
    else if (a === "--maxRatioMedium") out.maxRatioMedium = Number(argv[++i]);
    else if (a === "--maxRatioLong") out.maxRatioLong = Number(argv[++i]);
  }

  if (out.strict) {
    out.maxRatioShort = 1.05;
    out.maxRatioMedium = 1.05;
    out.maxRatioLong = 1.05;
  }

  return out;
}

function allowedRatio(enLen, opts) {
  if (opts.maxRatio != null && Number.isFinite(opts.maxRatio)) return opts.maxRatio;
  if (enLen <= 20) return opts.maxRatioShort;
  if (enLen <= 60) return opts.maxRatioMedium;
  return opts.maxRatioLong;
}

function compareDeep(en, bg, basePath, rows, problems) {
  if (typeof en === "string" && typeof bg === "string") {
    const enLen = codepointLength(en);
    const bgLen = codepointLength(bg);
    rows.push({ path: basePath, en, bg, enLen, bgLen });
    return;
  }

  if (Array.isArray(en) && Array.isArray(bg)) {
    if (en.length !== bg.length) {
      problems.push({
        type: "array_length_mismatch",
        path: basePath,
        enLen: en.length,
        bgLen: bg.length,
      });
    }
    const n = Math.max(en.length, bg.length);
    for (let i = 0; i < n; i++) {
      compareDeep(en[i], bg[i], `${basePath}[${i}]`, rows, problems);
    }
    return;
  }

  if (isPlainObject(en) && isPlainObject(bg)) {
    const keys = new Set([...Object.keys(en), ...Object.keys(bg)]);
    for (const k of [...keys].sort()) {
      if (!(k in en)) problems.push({ type: "missing_in_en", path: basePath ? `${basePath}.${k}` : k });
      if (!(k in bg)) problems.push({ type: "missing_in_bg", path: basePath ? `${basePath}.${k}` : k });
      compareDeep(en[k], bg[k], basePath ? `${basePath}.${k}` : k, rows, problems);
    }
    return;
  }
}

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const repoRoot = process.cwd();

  const homeEn = loadJson(path.join(repoRoot, "src", "_data", "home.json"));
  const homeBg = loadJson(path.join(repoRoot, "src", "_data", "home.bg.json"));
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const i18n = require(path.join(repoRoot, "src", "_data", "i18n.js"));

  const rows = [];
  const problems = [];

  compareDeep(homeEn, homeBg, "home", rows, problems);
  compareDeep(i18n.ui.en, i18n.ui.bg, "ui", rows, problems);
  compareDeep(i18n.modals.en, i18n.modals.bg, "modals", rows, problems);

  // Compare nav labels only (arrays of objects)
  for (const where of ["header", "footer"]) {
    const enArr = i18n.nav.en[where] || [];
    const bgArr = i18n.nav.bg[where] || [];
    if (enArr.length !== bgArr.length) {
      problems.push({ type: "array_length_mismatch", path: `nav.${where}`, enLen: enArr.length, bgLen: bgArr.length });
    }
    const n = Math.max(enArr.length, bgArr.length);
    for (let i = 0; i < n; i++) {
      const en = enArr[i]?.label;
      const bg = bgArr[i]?.label;
      if (typeof en === "string" && typeof bg === "string") {
        rows.push({
          path: `nav.${where}[${i}].label`,
          en,
          bg,
          enLen: codepointLength(en),
          bgLen: codepointLength(bg),
        });
      }
    }
  }
  if (i18n.nav.en.headerCta?.label && i18n.nav.bg.headerCta?.label) {
    const en = i18n.nav.en.headerCta.label;
    const bg = i18n.nav.bg.headerCta.label;
    rows.push({
      path: "nav.headerCta.label",
      en,
      bg,
      enLen: codepointLength(en),
      bgLen: codepointLength(bg),
    });
  }

  const offenders = rows
    .filter((r) => r.enLen > 0)
    .map((r) => ({ ...r, ratio: r.bgLen / r.enLen, max: allowedRatio(r.enLen, opts) }))
    .filter((r) => r.bgLen > r.enLen * r.max)
    .sort((a, b) => b.ratio - a.ratio);

  if (problems.length) {
    console.error("Structure problems:");
    for (const p of problems) console.error(`- ${p.type}: ${p.path}${p.enLen != null ? ` (en=${p.enLen}, bg=${p.bgLen})` : ""}`);
    console.error("");
  }

  if (offenders.length) {
    console.error(`Length offenders (bg > allowed ratio). Showing top ${Math.min(40, offenders.length)}:`);
    offenders.slice(0, 40).forEach((o) => {
      console.error(
        `- ${(o.ratio).toFixed(2)} > ${o.max} @ ${o.path} (en ${o.enLen} → bg ${o.bgLen})\n  EN: ${o.en}\n  BG: ${o.bg}\n`
      );
    });
  }

  if (problems.length || offenders.length) {
    process.exit(1);
  }

  console.log("OK: Bulgarian copy length is within configured thresholds.");
}

main();

