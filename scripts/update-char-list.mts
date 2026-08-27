#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const charListFile = resolve(import.meta.dirname, "../public/char-list.json");
const charListData = JSON.parse(readFileSync(charListFile, "utf8")) as any[];

console.log(`parsed ${charListData.length} entries`);

console.log(`checking umapyoi...`);
const umapyoiData = (await fetch("https://umapyoi.net/api/v1/character/info").then((res) =>
  res.json(),
)) as any[];

const oldNames = charListData.map((x) => x.name_en);
const newNames = umapyoiData.map((x) => x.name_en);

const oldNamesSet = new Set(oldNames);
const newNamesSet = new Set(newNames);

const added = newNames.filter((x) => !oldNamesSet.has(x));
const removed = oldNames.filter((x) => !newNamesSet.has(x));

if (added.length > 0 || removed.length > 0) {
  console.warn("added in umapyoi", added);
  console.warn("removed in umapyoi", removed);
  process.exit(1);
}

const args = process.argv;
if (args.length !== 3) {
  console.warn("need exactly one arg, csv of umamusume names to update");
  process.exit(1);
}

const umaNames = String(args[2])
  .split(",")
  .map((x) => x.trim().toLowerCase())
  .filter(Boolean);

for (const uma of umaNames) {
  const existingDataIdx = umapyoiData.findIndex((x) => x.name_en.toLowerCase() === uma);
  if (existingDataIdx === -1) {
    console.warn(`unable to find uma named ${uma}`);
    continue;
  }

  const { id, name_en, name_jp, color_main, link } = umapyoiData[existingDataIdx];

  process.stdout.write(`processing ${name_en}... `);
  const payload = (await fetch(`${link}/_payload.json`).then((res) => res.json())) as any[];

  let images: string[] = payload.filter(
    (val) => typeof val === "string" && val.endsWith("_thumb.png"),
  );

  if (images.length === 0) {
    process.stdout.write("cannot find thumbs, ");

    images = payload.filter(
      (val) =>
        typeof val === "string" && val.endsWith("_icon.png") && !val.endsWith("app_icon.png"),
    );
  }

  process.stdout.write(`found ${images.length} images\n`);
  charListData[existingDataIdx] = {
    id,
    name_en,
    name_jp,
    color_main,
    images,
    link,
  };

  console.log("after", charListData[existingDataIdx]);
  await sleep(1000);
}

writeFileSync(charListFile, JSON.stringify(charListData, undefined, 2), "utf8");
