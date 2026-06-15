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

let currentMode = "project";

const folderOrder = {
  project: ["[エールソング]", "[愛・祈・癒]", "[プロデュース]", "[West]", "[インスト]", "[Othes]"],
};

function makeChip(text) {
  const chip = document.createElement("span");
  chip.className = "chip";
  chip.textContent = text;
  return chip;
}

function makeImage(src, alt) {
  const image = document.createElement("img");
  image.src = src || defaultTrackImage;
  image.alt = alt;
  image.loading = "lazy";
  image.addEventListener("error", () => {
    image.src = defaultTrackImage;
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
    card.addEventListener("click", () => renderTracks(name, items));
    folderList.append(card);
  });
}

function renderTracks(folderName, items) {
  viewKicker.textContent = folderModes[currentMode].label;
  viewTitle.textContent = folderName;
  viewDescription.textContent = `${items.length}曲。カードを選ぶと下のプレイヤーで再生します。`;
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
  player.src = track.audio;
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

backButton.addEventListener("click", () => renderFolders(currentMode));

renderFolders();
