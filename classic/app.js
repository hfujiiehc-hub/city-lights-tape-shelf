const catalog = window.musicCatalog;
const { defaultTrackImage, folderModes, folderInfo, tracks } = catalog;

const folderList = document.querySelector("#folder-list");
const trackList = document.querySelector("#track-list");
const viewKicker = document.querySelector("#view-kicker");
const viewTitle = document.querySelector("#view-title");
const viewDescription = document.querySelector("#view-description");
const backButton = document.querySelector("#back-button");
const tabButtons = document.querySelectorAll(".tab-button");
const player = document.querySelector("#audio-player");
const currentTitle = document.querySelector("#current-title");
const currentMeta = document.querySelector("#current-meta");
const sharedAssetBase = "../";

let currentMode = "project";
let backHandler = () => renderFolders(currentMode);
let producerProjectItems = [];

const folderOrder = {
  recommend: ["[Sweet]", "[Half&Half]", "[Bitter]"],
  project: [
    "[エールソング]",
    "[愛・祈り・癒し]",
    "[プロデュース作品]",
    "[洋楽 / UK & Western]",
    "[インストゥルメンタル]",
    "[Others]",
  ],
};

const produceProjectName = "[プロデュース作品]";

const producerFolders = [
  {
    title: "TRS7",
    aliases: ["TRS7", "多摩蘭坂7"],
    description: "架空の女性グループ。緊張感のあるポップ／ロック作品をまとめています。",
    image: "./images/produce/TRS7.png",
  },
  {
    title: "Ω5",
    aliases: ["Ω5"],
    description: "ギターリフと疾走感を軸にした、架空ロックバンドの楽曲群です。",
    image: "./images/produce/omega5.png",
  },
  {
    title: "The Phase",
    aliases: ["The Phase", "The Phase&Ω5"],
    description: "ダークで都会的なニューウェーブ感を持つ、架空バンドの楽曲群です。",
    image: "./images/produce/the-phase.png",
  },
];

function sharedPath(path) {
  if (!path || /^(https?:|data:|blob:)/.test(path)) {
    return path;
  }
  return path.startsWith("./") ? `${sharedAssetBase}${path.slice(2)}` : path;
}

function makeChip(text) {
  const chip = document.createElement("span");
  chip.className = "chip";
  chip.textContent = text;
  return chip;
}

function makeImage(src, alt) {
  const image = document.createElement("img");
  image.src = sharedPath(src || defaultTrackImage);
  image.alt = alt;
  image.loading = "lazy";
  image.addEventListener("error", () => {
    image.src = sharedPath(defaultTrackImage);
  });
  return image;
}

function makeThumb(imageSrc, alt) {
  const thumb = document.createElement("div");
  thumb.className = "thumb";
  thumb.append(makeImage(imageSrc, alt));
  return thumb;
}

function groupTracks(mode) {
  if (mode === "recommend") {
    const groups = new Map();
    [
      ["[Sweet]", "Sweet"],
      ["[Half&Half]", "Half&Half"],
      ["[Bitter]", "Bitter"],
    ].forEach(([folderName, key]) => {
      const items = tracks.filter((track) => String(track[key] || "").trim() !== "");
      if (items.length) {
        groups.set(folderName, items);
      }
    });
    return groups;
  }

  const key = folderModes[mode].key;
  return tracks.reduce((groups, track) => {
    const name = track[key] || "Other";
    if (!groups.has(name)) {
      groups.set(name, []);
    }
    groups.get(name).push(track);
    return groups;
  }, new Map());
}

function sortFolderEntries(entries, mode) {
  const order = folderOrder[mode];
  if (!order) {
    return entries.sort(([nameA], [nameB]) => nameA.localeCompare(nameB, "ja"));
  }

  return entries.sort(([nameA], [nameB]) => {
    const indexA = order.includes(nameA) ? order.indexOf(nameA) : order.length;
    const indexB = order.includes(nameB) ? order.indexOf(nameB) : order.length;
    if (indexA !== indexB) {
      return indexA - indexB;
    }
    return nameA.localeCompare(nameB, "ja");
  });
}

function renderFolders(mode = currentMode) {
  currentMode = mode;
  backHandler = () => renderFolders(currentMode);
  const modeInfo = folderModes[currentMode];
  const grouped = groupTracks(currentMode);

  viewKicker.textContent = modeInfo.label;
  viewTitle.textContent = modeInfo.title;
  viewDescription.textContent = modeInfo.description;
  backButton.hidden = true;
  folderList.hidden = false;
  trackList.hidden = true;
  folderList.innerHTML = "";
  trackList.innerHTML = "";

  sortFolderEntries([...grouped.entries()], currentMode).forEach(([name, items]) => {
    const info = folderInfo[name] || {};
    const card = document.createElement("button");
    card.type = "button";
    card.className = "folder-card";
    card.setAttribute("aria-label", `${name} の曲を表示`);

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = name;

    const description = document.createElement("p");
    description.className = "description";
    description.textContent = info.description || `${items.length}曲を含むフォルダーです。`;

    const meta = document.createElement("div");
    meta.className = "meta-list";
    meta.append(makeChip(`${items.length} tracks`));
    meta.append(makeChip(currentMode === "vocal" ? "Vocal" : modeInfo.label));

    body.append(title, description, meta);
    card.append(makeThumb(info.image, `${name} のフォルダーサムネイル`), body);
    card.addEventListener("click", () => {
      if (currentMode === "project" && name === produceProjectName) {
        renderProducerFolders(items);
        return;
      }
      renderTracks(name, items);
    });
    folderList.append(card);
  });
}

function renderProducerFolders(items) {
  const info = folderInfo[produceProjectName] || {};
  producerProjectItems = items;
  backHandler = () => renderFolders("project");

  viewKicker.textContent = "Project";
  viewTitle.textContent = produceProjectName;
  viewDescription.textContent =
    info.longDescription || "仮想アーティストごとに制作した曲群です。";
  backButton.hidden = false;
  folderList.hidden = false;
  trackList.hidden = true;
  folderList.innerHTML = "";
  trackList.innerHTML = "";

  producerFolders.forEach((folder) => {
    const folderItems = items.filter((track) => folder.aliases.includes(track["グループ"]));
    if (!folderItems.length) {
      return;
    }

    const card = document.createElement("button");
    card.type = "button";
    card.className = "folder-card";
    card.setAttribute("aria-label", `${folder.title} の曲を表示`);

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = folder.title;

    const description = document.createElement("p");
    description.className = "description";
    description.textContent = folder.description;

    const meta = document.createElement("div");
    meta.className = "meta-list";
    meta.append(makeChip(`${folderItems.length} tracks`));
    meta.append(makeChip("Artist"));

    body.append(title, description, meta);
    card.append(makeThumb(folder.image, `${folder.title} のフォルダーサムネイル`), body);
    card.addEventListener("click", () => {
      backHandler = () => renderProducerFolders(producerProjectItems);
      renderTracks(folder.title, folderItems, "Artist");
    });
    folderList.append(card);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderTracks(folderName, items, kickerLabel = folderModes[currentMode].label) {
  const info = folderInfo[folderName] || {};
  if (kickerLabel !== "Artist") {
    backHandler = () => renderFolders(currentMode);
  }
  viewKicker.textContent = kickerLabel;
  viewTitle.textContent = folderName;
  viewDescription.textContent =
    info.longDescription || `${items.length}曲。カードを選ぶと下のプレイヤーで再生します。`;
  backButton.hidden = false;
  folderList.hidden = true;
  trackList.hidden = false;
  trackList.innerHTML = "";

  items.forEach((track) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "track-card";
    card.setAttribute("aria-label", `${track.title} を再生`);

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h3");
    title.className = "card-title";
    title.textContent = track.title;

    const description = document.createElement("p");
    description.className = "description";
    description.textContent = track.description;

    const meta = document.createElement("div");
    meta.className = "meta-list";
    [track.genre, track.style, `ボーカル: ${track.vocal}`, track.mood].forEach((item) => {
      meta.append(makeChip(item));
    });

    body.append(title, description, meta);
    card.append(makeThumb(track.image, `${track.title} のサムネイル`), body);
    card.addEventListener("click", () => playTrack(track, card));
    trackList.append(card);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function playTrack(track, card) {
  document
    .querySelectorAll(".track-card")
    .forEach((item) => item.classList.remove("is-active"));

  card.classList.add("is-active");
  player.src = sharedPath(track.audio);
  player.play().catch(() => {
    currentMeta.textContent = "再生ボタンを押すと音源が再生されます。";
  });

  currentTitle.textContent = track.title;
  currentMeta.textContent = `${track.project} / ${track.genre} / ボーカル: ${track.vocal}`;
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    renderFolders(button.dataset.mode);
  });
});

backButton.addEventListener("click", () => backHandler());

renderFolders();
