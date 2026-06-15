import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(scriptDir);
const tracksPath = path.join(root, "data", "tracks.csv");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        value += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        value += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(value);
      value = "";
    } else if (char === "\n") {
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else if (char !== "\r") {
      value += char;
    }
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  const headers = rows.shift().map((header) => header.replace(/^\uFEFF/, ""));
  return rows
    .filter((items) => items.some((item) => item.trim() !== ""))
    .map((items) =>
      Object.fromEntries(headers.map((header, index) => [header, items[index] ?? ""])),
    );
}

function toCsvValue(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

const rows = parseCsv(await fs.readFile(tracksPath, "utf8"));
const headers = [
  "id",
  "publish",
  "title",
  "description",
  "project",
  "genre",
  "genreGroup",
  "style",
  "vocal",
  "mood",
  "audio",
  "image",
];

const csvRows = [
  headers.join(","),
  ...rows.map((row, index) =>
    headers
      .map((header) => {
        if (header === "id") {
          return toCsvValue(row.id || String(index + 1).padStart(3, "0"));
        }
        if (header === "publish") {
          return toCsvValue(row.publish || "1");
        }
        return toCsvValue(row[header]);
      })
      .join(","),
  ),
];

await fs.writeFile(tracksPath, `\uFEFF${csvRows.join("\r\n")}\r\n`, "utf8");
console.log(`Normalized tracks.csv with ${rows.length} rows.`);
