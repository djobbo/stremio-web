// Copyright (C) 2017-2023 Smart code 203358507

const CHROMECAST_RECEIVER_APP_ID = "1634F54B"
const SUBTITLES_SIZES = [75, 100, 125, 150, 175, 200, 250]
const SUBTITLES_FONTS = [
  "PlusJakartaSans",
  "Arial",
  "Halvetica",
  "Times New Roman",
  "Verdana",
  "Courier",
  "Lucida Console",
  "sans-serif",
  "serif",
  "monospace",
]
const SEEK_TIME_DURATIONS = [3000, 5000, 10000, 15000, 20000, 30000]
const NEXT_VIDEO_POPUP_DURATIONS = [
  0, 5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000,
  60000, 65000, 70000, 75000, 80000, 85000, 90000,
]
const CATALOG_PREVIEW_SIZE = 10
const CATALOG_PAGE_SIZE = 100
const NONE_EXTRA_VALUE = "None"
const SKIP_EXTRA_NAME = "skip"
const META_LINK_CATEGORY = "meta"
const IMDB_LINK_CATEGORY = "imdb"
const SHARE_LINK_CATEGORY = "share"
const WRITERS_LINK_CATEGORY = "Writers"
const TYPE_PRIORITIES = {
  movie: 10,
  series: 9,
  channel: 8,
  tv: 7,
  music: 6,
  radio: 5,
  podcast: 4,
  game: 3,
  book: 2,
  adult: 1,
  other: -Infinity,
}
const ICON_FOR_TYPE = new Map([
  ["movie", "movies"],
  ["series", "series"],
  ["channel", "channels"],
  ["tv", "tv"],
  ["book", "ic_book"],
  ["game", "ic_games"],
  ["music", "ic_music"],
  ["adult", "ic_adult"],
  ["radio", "ic_radio"],
  ["podcast", "ic_podcast"],
  ["other", "movies"],
])

const EXTERNAL_PLAYERS = [
  {
    label: "EXTERNAL_PLAYER_DISABLED",
    value: null,
    platforms: ["ios", "android", "windows", "linux", "macos"],
  },
  {
    label: "EXTERNAL_PLAYER_ALLOW_CHOOSING",
    value: "choose",
    platforms: ["android"],
  },
  {
    label: "VLC",
    value: "vlc",
    platforms: ["ios", "android"],
  },
  {
    label: "MPV",
    value: "mpv",
    platforms: ["macos"],
  },
  {
    label: "IINA",
    value: "iina",
    platforms: ["macos"],
  },
  {
    label: "MX Player",
    value: "mxplayer",
    platforms: ["android"],
  },
  {
    label: "Just Player",
    value: "justplayer",
    platforms: ["android"],
  },
  {
    label: "Outplayer",
    value: "outplayer",
    platforms: ["ios"],
  },
  {
    label: "M3U Playlist",
    value: "m3u",
    platforms: ["ios", "android", "windows", "linux", "macos"],
  },
]

export {
  CATALOG_PAGE_SIZE,
  CATALOG_PREVIEW_SIZE,
  CHROMECAST_RECEIVER_APP_ID,
  EXTERNAL_PLAYERS,
  ICON_FOR_TYPE,
  IMDB_LINK_CATEGORY,
  META_LINK_CATEGORY,
  NEXT_VIDEO_POPUP_DURATIONS,
  NONE_EXTRA_VALUE,
  SEEK_TIME_DURATIONS,
  SHARE_LINK_CATEGORY,
  SKIP_EXTRA_NAME,
  SUBTITLES_FONTS,
  SUBTITLES_SIZES,
  TYPE_PRIORITIES,
  WRITERS_LINK_CATEGORY,
}
