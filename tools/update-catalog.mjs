import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(scriptDir);
const tracksPath = path.join(root, "data", "tracks.csv");
const catalogPath = path.join(root, "data", "catalog.js");

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

const folderImages = {
  "[エールソング]": "./images/project-ailesong.png",
  "[愛・祈・癒]": "./images/project-healing.png",
  "[癒し]": "./images/project-healing.png",
  "[プロデュース]": "./images/project-produce.png",
  "[West]": "./images/project-west.png",
  "[洋楽]": "./images/project-west.png",
  "[インスト]": "./images/project-instrumental.png",
  "[Othes]": "./images/project-othes.png",
  "[Other]": "./images/project-othes.png",
  "[？]": "./images/project-othes.png",
  "[インスト曲]": "./images/project-instrumental.png",
  "Ds-movie": "./images/folder-ds-movie.svg",
  Lambda: "./images/folder-lambda.svg",
  Sigma: "./images/folder-sigma.svg",
  Omega5: "./images/folder-omega5.svg",
  "J-Pop Sketches": "./images/folder-jpop.svg",
  "Guitar Sessions": "./images/folder-guitar.svg",
  Fragments: "./images/folder-fragments.svg",
  "Cinematic / Art Pop": "./images/folder-cinematic.svg",
  "New Wave / Synth": "./images/folder-new-wave.svg",
  "City Pop / AOR": "./images/folder-city-aor.svg",
  "Ambient / Electronic": "./images/folder-ambient.svg",
  "J-Pop / Pop Rock": "./images/folder-pop-rock.svg",
  "Guitar Pop": "./images/folder-guitar.svg",
  男性: "./images/folder-male.svg",
  女性: "./images/folder-female.svg",
  男女: "./images/folder-duo.svg",
};

const folderDescriptions = {
  "[エールソング]": "背中を押す言葉や、前へ進む気持ちを軸にした楽曲。",
  "[愛・祈・癒]": "愛、祈り、喪失、回復の余韻を静かに描く楽曲。",
  "[プロデュース]": "架空のバンドやグループを想定して制作した、キャラクター性のある楽曲。",
  "[West]": "UKロック、ニューウェーブ、洋楽ポップの質感を意識した楽曲。",
  "[インスト]": "ギターやアンサンブルの響きを中心にしたインストゥルメンタル系の楽曲。",
  "[Othes]": "実験的な曲、ホラー、ゲーム音楽的な小品など、既存枠に収まりにくい楽曲。",
};

const allTracks = parseCsv(await fs.readFile(tracksPath, "utf8"));
function normalizeProject(project) {
  if (project === "[？]") {
    return "[Othes]";
  }
  if (project === "[インスト曲]") {
    return "[インスト]";
  }
  if (project === "[癒し]") {
    return "[愛・祈・癒]";
  }
  if (project === "[洋楽]") {
    return "[West]";
  }
  if (project === "[Other]") {
    return "[Othes]";
  }
  return project;
}

const tracks = allTracks
  .filter((track) => (track.publish ?? "1").trim() === "1")
  .map((track) => ({
    ...track,
    project: normalizeProject(track.project),
  }));
const folderInfo = {};

for (const track of tracks) {
  for (const name of [track.project, track.genreGroup, track.vocal]) {
    if (name && !folderInfo[name]) {
      folderInfo[name] = {
        description: folderDescriptions[name] || `${name} の楽曲フォルダーです。`,
        image: folderImages[name] || "./images/thumb-default.svg",
      };
    }
  }
}

const catalog = {
  defaultTrackImage: "./images/thumb-default.svg",
  folderModes: {
    project: {
      label: "Project",
      title: "Project Folders",
      description: "制作単位や音の方向性ごとにまとめています。",
      key: "project",
    },
    genre: {
      label: "Genre",
      title: "Genre Folders",
      description: "ジャンルや質感から楽曲を探せます。",
      key: "genreGroup",
    },
    vocal: {
      label: "Vocal",
      title: "Vocal Folders",
      description: "想定ボーカルのタイプごとにまとめています。",
      key: "vocal",
    },
  },
  folderInfo,
  tracks,
};

await fs.writeFile(
  catalogPath,
  `window.musicCatalog = ${JSON.stringify(catalog, null, 2)};\n`,
  "utf8",
);

console.log(`Updated data/catalog.js from data/tracks.csv (${tracks.length} tracks).`);
