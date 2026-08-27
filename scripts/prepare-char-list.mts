#!/usr/bin/env node

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const umapyoiData = (await fetch("https://umapyoi.net/api/v1/character/info").then((res) =>
  res.json(),
)) as any[];

const assembledData: any[] = [];
const totalUmas = umapyoiData.length;
let countUma = 0;

for (const uma of umapyoiData) {
  countUma++;

  const { id, name_en, name_jp, color_main, link } = uma;
  process.stdout.write(`${countUma}/${totalUmas} processing ${name_en}... `);

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

  assembledData.push({
    id,
    name_en,
    name_jp,
    color_main,
    images,
    link,
  });
  process.stdout.write(`found ${images.length} images\n`);

  await sleep(1000);
}

const charListFile = resolve(import.meta.dirname, "../public/char-list.json");
writeFileSync(charListFile, JSON.stringify(assembledData, undefined, 2), "utf8");
