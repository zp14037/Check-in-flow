#!/usr/bin/env node
/**
 * Patches ajv-keywords v3 _formatLimit.js files that crash on Node 22
 * because ajv v8 no longer exposes ._formats.
 */
const fs = require("fs");
const path = require("path");

const targets = [
  "frontend/node_modules/fork-ts-checker-webpack-plugin/node_modules/ajv-keywords/keywords/_formatLimit.js",
  "frontend/node_modules/babel-loader/node_modules/ajv-keywords/keywords/_formatLimit.js",
  "frontend/node_modules/file-loader/node_modules/ajv-keywords/keywords/_formatLimit.js",
];

const OLD = "var formats = ajv._formats;";
const NEW = "var formats = ajv._formats || {};";

const root = path.resolve(__dirname, "..");

for (const rel of targets) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) continue;
  const src = fs.readFileSync(abs, "utf8");
  if (src.includes(NEW)) continue; // already patched
  if (!src.includes(OLD)) continue; // doesn't match — skip
  fs.writeFileSync(abs, src.replace(OLD, NEW), "utf8");
  console.log(`patched: ${rel}`);
}
