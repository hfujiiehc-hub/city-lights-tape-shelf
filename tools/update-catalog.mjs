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
  "[Sweet]": "./images/osusume/osusume-Sweet.png",
  "[Bitter]": "./images/osusume/osusume-Bitter.png",
  "[エールソング]": "./images/project/project-ailesong.png",
  "[愛・祈り・癒し]": "./images/project/project-healing.png",
  "[愛・祈・癒]": "./images/project/project-healing.png",
  "[癒し]": "./images/project/project-healing.png",
  "[プロデュース作品]": "./images/project/project-produce.png",
  "[プロデュース]": "./images/project/project-produce.png",
  "[洋楽 / UK & Western]": "./images/project/project-west.png",
  "[West]": "./images/project/project-west.png",
  "[洋楽]": "./images/project/project-west.png",
  "[インストゥルメンタル]": "./images/project/project-instrumental.png",
  "[インスト]": "./images/project/project-instrumental.png",
  "[Others]": "./images/project/project-othes.png",
  "[Othes]": "./images/project/project-othes.png",
  "[Other]": "./images/project/project-othes.png",
  "[？]": "./images/project/project-othes.png",
  "[インスト曲]": "./images/project/project-instrumental.png",
  "Ds-movie": "./images/folders/folder-ds-movie.svg",
  Lambda: "./images/folders/folder-lambda.svg",
  Sigma: "./images/folders/folder-sigma.svg",
  Omega5: "./images/folders/folder-omega5.svg",
  "J-Pop Sketches": "./images/folders/folder-jpop.svg",
  "Guitar Sessions": "./images/folders/folder-guitar.svg",
  Fragments: "./images/folders/folder-fragments.svg",
  "Cinematic / Art Pop": "./images/folders/folder-cinematic.svg",
  "New Wave / Synth": "./images/folders/folder-new-wave.svg",
  "City Pop / AOR": "./images/folders/folder-city-aor.svg",
  "Ambient / Electronic": "./images/folders/folder-ambient.svg",
  "J-Pop / Pop Rock": "./images/folders/folder-pop-rock.svg",
  "Guitar Pop": "./images/folders/folder-guitar.svg",
  男性: "./images/folders/folder-male.svg",
  女性: "./images/folders/folder-female.svg",
  混声: "./images/folders/folder-duo.svg",
  電子音: "./images/thumb-default.svg",
};

const folderDescriptions = {
  "[Sweet]": "優しく、切なく、あるいは前向きな曲。",
  "[Bitter]": "ちょっとダークで大人の雰囲気の曲。",
  "[エールソング]": "旅立ち、変化、迷いの中で、少し前を向くための曲たち。",
  "[愛・祈り・癒し]": "愛、喪失、祈り、記憶の余韻を静かに描いた曲たち。",
  "[プロデュース作品]": "架空のバンドやユニットを想定して制作したポップ／ロック作品。",
  "[洋楽 / UK & Western]": "80年代UKロックやニューウェーブの質感を意識した洋楽系作品。",
  "[インストゥルメンタル]": "ギターとハーモニーで、朝や昼の風景を描いた器楽曲。",
  "[Others]": "ゲーム、ホラー、映画的楽曲、実験作など、分類しにくい小品集。",
};

const folderLongDescriptions = {
  "[Sweet]": "作者がピックアップしたお勧め曲。時々入れかえます。優しく、切なく、あるいは前向きな曲を集めています。",
  "[Bitter]": "作者がピックアップしたお勧め曲。時々入れかえます。ちょっとダークで大人の雰囲気の曲を集めています。",
  "[エールソング]":
    "爽やかなフォークポップから、学生の孤独や時代の変化を描いたインディーポップまで。大げさに励ますのではなく、日常の中でそっと背中を押してくれる曲を集めました。",
  "[愛・祈り・癒し]":
    "アンビエント、アートポップ、フォークバラードを中心に、言葉になる前の感情や、大切な人への想いを静かに描いた曲群です。夜明け、部屋に残る気配、祈りのようなハーモニーが軸になっています。",
  "[プロデュース作品]":
    "女性グループ、架空ロックバンド、男性ニューウェーブ系バンドなど、仮想アーティストを想定して制作した曲群です。ギターリフ、機械的なリズム、疾走感、クールな歌唱など、キャラクターごとの音像を楽しめます。",
  "[洋楽 / UK & Western]":
    "80年代UKポップ／ロック、ニューウェーブ、ソフィスティ・ポップ、ゴシックロックの質感をもとにした曲群です。都会的な明暗、抑えたボーカル、浮遊感、ダークな物語性など、洋楽的な響きを意識しています。",
  "[インストゥルメンタル]":
    "港の朝、海風、ガラスのような透明感など、風景や時間帯を音で描いたインストゥルメンタル曲です。ギター、ハーモニー、ジャズフュージョン的な明るさを中心に、リラックスして聴ける曲を集めました。",
  "[Others]":
    "レトロゲーム風の電子音楽、ホラー／ダークウェーブ、映画主題歌風デュエット、声のサウンドスケープなど、既存の棚に収まりにくい曲群です。実験的で奇妙なものから、ドラマチックなものまでを置いています。",
};

const allTracks = parseCsv(await fs.readFile(tracksPath, "utf8"));
function normalizeProject(project) {
  if (project === "[？]") {
    return "[Others]";
  }
  if (project === "[インスト曲]") {
    return "[インストゥルメンタル]";
  }
  if (project === "[癒し]") {
    return "[愛・祈り・癒し]";
  }
  if (project === "[洋楽]") {
    return "[洋楽 / UK & Western]";
  }
  if (project === "[Other]" || project === "[Othes]") {
    return "[Others]";
  }
  if (project === "[愛・祈・癒]") {
    return "[愛・祈り・癒し]";
  }
  if (project === "[プロデュース]") {
    return "[プロデュース作品]";
  }
  if (project === "[West]") {
    return "[洋楽 / UK & Western]";
  }
  if (project === "[インスト]") {
    return "[インストゥルメンタル]";
  }
  return project;
}

function normalizeVocal(vocal) {
  if (vocal === "男女") {
    return "混声";
  }
  return vocal;
}

const tracks = allTracks
  .filter((track) => (track.publish ?? "1").trim() === "1")
  .map((track) => ({
    ...track,
    project: normalizeProject(track.project),
    vocal: normalizeVocal(track.vocal),
  }));
const folderInfo = {};

[
  ["[Sweet]", "Sweet"],
  ["[Bitter]", "Bitter"],
].forEach(([folderName, key]) => {
  if (tracks.some((track) => String(track[key] || "").trim() !== "")) {
    folderInfo[folderName] = {
      description: folderDescriptions[folderName],
      longDescription: folderLongDescriptions[folderName],
      image: folderImages[folderName],
    };
  }
});

for (const track of tracks) {
  for (const name of [track.project, track.genreGroup, track.vocal]) {
    if (name && !folderInfo[name]) {
      folderInfo[name] = {
        description: folderDescriptions[name] || `${name} の楽曲フォルダーです。`,
        longDescription: folderLongDescriptions[name] || "",
        image: folderImages[name] || "./images/thumb-default.svg",
      };
    }
  }
}

const catalog = {
  defaultTrackImage: "./images/thumb-default.svg",
  folderModes: {
    recommend: {
      label: "おすすめ",
      title: "おすすめ",
      description: "作者がピックアップしたお勧め曲。時々入れかえます。",
      key: "recommend",
    },
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
