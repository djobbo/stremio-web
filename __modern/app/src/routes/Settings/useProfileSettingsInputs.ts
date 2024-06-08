// Copyright (C) 2017-2023 Smart code 203358507

import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  CONSTANTS,
  interfaceLanguages,
  languageNames,
  platform,
} from "stremio/common"
import { useServices } from "stremio/services"

const useProfileSettingsInputs = (profile) => {
  const { t } = useTranslation()
  const { core } = useServices()
  // TODO combine those useMemo in one
  const interfaceLanguageSelect = useMemo(
    () => ({
      options: interfaceLanguages.map(({ name, codes }) => ({
        value: codes[0],
        label: name,
      })),
      selected: [
        interfaceLanguages.find(
          ({ codes }) => codes[1] === profile.settings.interfaceLanguage,
        )?.codes?.[0] || profile.settings.interfaceLanguage,
      ],
      onSelect: (event) => {
        core.transport.dispatch({
          action: "Ctx",
          args: {
            action: "UpdateSettings",
            args: {
              ...profile.settings,
              interfaceLanguage: event.value,
            },
          },
        })
      },
    }),
    [profile.settings],
  )
  const subtitlesLanguageSelect = useMemo(
    () => ({
      options: Object.keys(languageNames).map((code) => ({
        value: code,
        label: languageNames[code],
      })),
      selected: [profile.settings.subtitlesLanguage],
      onSelect: (event) => {
        core.transport.dispatch({
          action: "Ctx",
          args: {
            action: "UpdateSettings",
            args: {
              ...profile.settings,
              subtitlesLanguage: event.value,
            },
          },
        })
      },
    }),
    [profile.settings],
  )
  const subtitlesSizeSelect = useMemo(
    () => ({
      options: CONSTANTS.SUBTITLES_SIZES.map((size) => ({
        value: `${size}`,
        label: `${size}%`,
      })),
      selected: [`${profile.settings.subtitlesSize}`],
      renderLabelText: () => {
        return `${profile.settings.subtitlesSize}%`
      },
      onSelect: (event) => {
        core.transport.dispatch({
          action: "Ctx",
          args: {
            action: "UpdateSettings",
            args: {
              ...profile.settings,
              subtitlesSize: parseInt(event.value, 10),
            },
          },
        })
      },
    }),
    [profile.settings],
  )
  const subtitlesTextColorInput = useMemo(
    () => ({
      value: profile.settings.subtitlesTextColor,
      onChange: (event) => {
        core.transport.dispatch({
          action: "Ctx",
          args: {
            action: "UpdateSettings",
            args: {
              ...profile.settings,
              subtitlesTextColor: event.value,
            },
          },
        })
      },
    }),
    [profile.settings],
  )
  const subtitlesBackgroundColorInput = useMemo(
    () => ({
      value: profile.settings.subtitlesBackgroundColor,
      onChange: (event) => {
        core.transport.dispatch({
          action: "Ctx",
          args: {
            action: "UpdateSettings",
            args: {
              ...profile.settings,
              subtitlesBackgroundColor: event.value,
            },
          },
        })
      },
    }),
    [profile.settings],
  )
  const subtitlesOutlineColorInput = useMemo(
    () => ({
      value: profile.settings.subtitlesOutlineColor,
      onChange: (event) => {
        core.transport.dispatch({
          action: "Ctx",
          args: {
            action: "UpdateSettings",
            args: {
              ...profile.settings,
              subtitlesOutlineColor: event.value,
            },
          },
        })
      },
    }),
    [profile.settings],
  )
  const audioLanguageSelect = useMemo(
    () => ({
      options: Object.keys(languageNames).map((code) => ({
        value: code,
        label: languageNames[code],
      })),
      selected: [profile.settings.audioLanguage],
      onSelect: (event) => {
        core.transport.dispatch({
          action: "Ctx",
          args: {
            action: "UpdateSettings",
            args: {
              ...profile.settings,
              audioLanguage: event.value,
            },
          },
        })
      },
    }),
    [profile.settings],
  )
  const surroundSoundCheckbox = useMemo(
    () => ({
      checked: profile.settings.surroundSound,
      onClick: () => {
        core.transport.dispatch({
          action: "Ctx",
          args: {
            action: "UpdateSettings",
            args: {
              ...profile.settings,
              surroundSound: !profile.settings.surroundSound,
            },
          },
        })
      },
    }),
    [profile.settings],
  )
  const escExitFullscreenCheckbox = useMemo(
    () => ({
      checked: profile.settings.escExitFullscreen,
      onClick: () => {
        core.transport.dispatch({
          action: "Ctx",
          args: {
            action: "UpdateSettings",
            args: {
              ...profile.settings,
              escExitFullscreen: !profile.settings.escExitFullscreen,
            },
          },
        })
      },
    }),
    [profile.settings],
  )

  const seekTimeDurationSelect = useMemo(
    () => ({
      options: CONSTANTS.SEEK_TIME_DURATIONS.map((size) => ({
        value: `${size}`,
        label: `${size / 1000} ${t("SECONDS")}`,
      })),
      selected: [`${profile.settings.seekTimeDuration}`],
      renderLabelText: () => {
        return `${profile.settings.seekTimeDuration / 1000} ${t("SECONDS")}`
      },
      onSelect: (event) => {
        core.transport.dispatch({
          action: "Ctx",
          args: {
            action: "UpdateSettings",
            args: {
              ...profile.settings,
              seekTimeDuration: parseInt(event.value, 10),
            },
          },
        })
      },
    }),
    [profile.settings],
  )
  const seekShortTimeDurationSelect = useMemo(
    () => ({
      options: CONSTANTS.SEEK_TIME_DURATIONS.map((size) => ({
        value: `${size}`,
        label: `${size / 1000} ${t("SECONDS")}`,
      })),
      selected: [`${profile.settings.seekShortTimeDuration}`],
      renderLabelText: () => {
        return `${profile.settings.seekShortTimeDuration / 1000} ${t("SECONDS")}`
      },
      onSelect: (event) => {
        core.transport.dispatch({
          action: "Ctx",
          args: {
            action: "UpdateSettings",
            args: {
              ...profile.settings,
              seekShortTimeDuration: parseInt(event.value, 10),
            },
          },
        })
      },
    }),
    [profile.settings],
  )
  const playInExternalPlayerSelect = useMemo(
    () => ({
      options: CONSTANTS.EXTERNAL_PLAYERS.filter(({ platforms }) =>
        platforms.includes(platform.name),
      ).map(({ label, value }) => ({
        value,
        label: t(label),
      })),
      selected: [profile.settings.playerType],
      renderLabelText: () => {
        const selectedOption = CONSTANTS.EXTERNAL_PLAYERS.find(
          ({ value }) => value === profile.settings.playerType,
        )
        return selectedOption
          ? t(selectedOption.label, { defaultValue: selectedOption.label })
          : profile.settings.playerType
      },
      onSelect: (event) => {
        core.transport.dispatch({
          action: "Ctx",
          args: {
            action: "UpdateSettings",
            args: {
              ...profile.settings,
              playerType: event.value,
            },
          },
        })
      },
    }),
    [profile.settings],
  )
  const nextVideoPopupDurationSelect = useMemo(
    () => ({
      options: CONSTANTS.NEXT_VIDEO_POPUP_DURATIONS.map((duration) => ({
        value: `${duration}`,
        label:
          duration === 0 ? "Disabled" : `${duration / 1000} ${t("SECONDS")}`,
      })),
      selected: [`${profile.settings.nextVideoNotificationDuration}`],
      renderLabelText: () => {
        return profile.settings.nextVideoNotificationDuration === 0
          ? "Disabled"
          : `${profile.settings.nextVideoNotificationDuration / 1000} ${t("SECONDS")}`
      },
      onSelect: (event) => {
        core.transport.dispatch({
          action: "Ctx",
          args: {
            action: "UpdateSettings",
            args: {
              ...profile.settings,
              nextVideoNotificationDuration: parseInt(event.value, 10),
            },
          },
        })
      },
    }),
    [profile.settings],
  )
  const bingeWatchingCheckbox = useMemo(
    () => ({
      checked: profile.settings.bingeWatching,
      onClick: () => {
        core.transport.dispatch({
          action: "Ctx",
          args: {
            action: "UpdateSettings",
            args: {
              ...profile.settings,
              bingeWatching: !profile.settings.bingeWatching,
            },
          },
        })
      },
    }),
    [profile.settings],
  )
  const playInBackgroundCheckbox = useMemo(
    () => ({
      checked: profile.settings.playInBackground,
      onClick: () => {
        core.transport.dispatch({
          action: "Ctx",
          args: {
            action: "UpdateSettings",
            args: {
              ...profile.settings,
              playInBackground: !profile.settings.playInBackground,
            },
          },
        })
      },
    }),
    [profile.settings],
  )
  const hardwareDecodingCheckbox = useMemo(
    () => ({
      checked: profile.settings.hardwareDecoding,
      onClick: () => {
        core.transport.dispatch({
          action: "Ctx",
          args: {
            action: "UpdateSettings",
            args: {
              ...profile.settings,
              hardwareDecoding: !profile.settings.hardwareDecoding,
            },
          },
        })
      },
    }),
    [profile.settings],
  )
  const streamingServerUrlInput = useMemo(
    () => ({
      value: profile.settings.streamingServerUrl,
      onChange: (value) => {
        core.transport.dispatch({
          action: "Ctx",
          args: {
            action: "UpdateSettings",
            args: {
              ...profile.settings,
              streamingServerUrl: value,
            },
          },
        })
      },
    }),
    [profile.settings],
  )
  return {
    interfaceLanguageSelect,
    subtitlesLanguageSelect,
    subtitlesSizeSelect,
    subtitlesTextColorInput,
    subtitlesBackgroundColorInput,
    subtitlesOutlineColorInput,
    audioLanguageSelect,
    surroundSoundCheckbox,
    escExitFullscreenCheckbox,
    seekTimeDurationSelect,
    seekShortTimeDurationSelect,
    playInExternalPlayerSelect,
    nextVideoPopupDurationSelect,
    bingeWatchingCheckbox,
    playInBackgroundCheckbox,
    hardwareDecodingCheckbox,
    streamingServerUrlInput,
  }
}

export default useProfileSettingsInputs
