// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import debounce from "lodash.debounce"
import langs from "langs"
import { useTranslation } from "react-i18next"
import { useRouteFocused } from "stremio-router"
import { useServices } from "stremio/services"

import {
  HorizontalNavBar,
  useFullscreen,
  useBinaryState,
  useToast,
  useStreamingServer,
  withCoreSuspender,
} from "stremio/common"

import BufferingLoader from "./BufferingLoader"
import VolumeChangeIndicator from "./VolumeChangeIndicator"
import Error from "./Error"
import ControlBar from "./ControlBar"
import NextVideoPopup from "./NextVideoPopup"
import StatisticsMenu from "./StatisticsMenu"
import InfoMenu from "./InfoMenu"
import OptionsMenu from "./OptionsMenu"
import VideosMenu from "./VideosMenu"
import SubtitlesMenu from "./SubtitlesMenu"
import SpeedMenu from "./SpeedMenu"
import usePlayer from "./usePlayer"
import useSettings from "./useSettings"
import useStatistics from "./useStatistics"
import useVideo from "./useVideo"
import styles from "./styles.module.less"
import Video from "./Video"
import {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react"

const Player = ({ urlParams, queryParams }) => {
  const { t } = useTranslation()
  const { chromecast, shell, core } = useServices()
  const forceTranscoding = useMemo(() => {
    return queryParams.has("forceTranscoding")
  }, [queryParams])

  const [
    player,
    videoParamsChanged,
    timeChanged,
    pausedChanged,
    ended,
    nextVideo,
  ] = usePlayer(urlParams)
  const [settings, updateSettings] = useSettings()
  const streamingServer = useStreamingServer()
  const statistics = useStatistics(player, streamingServer)
  const video = useVideo()
  const routeFocused = useRouteFocused()
  const toast = useToast()

  const [casting, setCasting] = useState(() => {
    return (
      chromecast.active &&
      chromecast.transport.getCastState() === cast.framework.CastState.CONNECTED
    )
  })

  const [immersed, setImmersed] = useState(true)
  const setImmersedDebounced = useCallback(debounce(setImmersed, 3000), [])
  const [, , , toggleFullscreen] = useFullscreen()

  const [optionsMenuOpen, , closeOptionsMenu, toggleOptionsMenu] =
    useBinaryState(false)
  const [subtitlesMenuOpen, , closeSubtitlesMenu, toggleSubtitlesMenu] =
    useBinaryState(false)
  const [infoMenuOpen, , closeInfoMenu, toggleInfoMenu] = useBinaryState(false)
  const [speedMenuOpen, , closeSpeedMenu, toggleSpeedMenu] =
    useBinaryState(false)
  const [videosMenuOpen, , closeVideosMenu, toggleVideosMenu] =
    useBinaryState(false)
  const [statisticsMenuOpen, , closeStatisticsMenu, toggleStatisticsMenu] =
    useBinaryState(false)
  const [nextVideoPopupOpen, openNextVideoPopup, closeNextVideoPopup] =
    useBinaryState(false)

  const menusOpen = useMemo(() => {
    return (
      optionsMenuOpen ||
      subtitlesMenuOpen ||
      infoMenuOpen ||
      speedMenuOpen ||
      videosMenuOpen ||
      statisticsMenuOpen
    )
  }, [
    optionsMenuOpen,
    subtitlesMenuOpen,
    infoMenuOpen,
    speedMenuOpen,
    videosMenuOpen,
    statisticsMenuOpen,
  ])

  const closeMenus = useCallback(() => {
    closeOptionsMenu()
    closeSubtitlesMenu()
    closeInfoMenu()
    closeSpeedMenu()
    closeVideosMenu()
    closeStatisticsMenu()
  }, [])

  const overlayHidden = useMemo(() => {
    return (
      immersed &&
      !casting &&
      video.state.paused !== null &&
      !video.state.paused &&
      !menusOpen &&
      !nextVideoPopupOpen
    )
  }, [immersed, casting, video.state.paused, menusOpen, nextVideoPopupOpen])

  const nextVideoPopupDismissed = useRef(false)
  const defaultSubtitlesSelected = useRef(false)
  const defaultAudioTrackSelected = useRef(false)
  const [error, setError] = useState(null)

  const onImplementationChanged = useCallback(() => {
    video.setProp("subtitlesSize", settings.subtitlesSize)
    video.setProp("subtitlesOffset", settings.subtitlesOffset)
    video.setProp("subtitlesTextColor", settings.subtitlesTextColor)
    video.setProp("subtitlesBackgroundColor", settings.subtitlesBackgroundColor)
    video.setProp("subtitlesOutlineColor", settings.subtitlesOutlineColor)
    video.setProp("extraSubtitlesSize", settings.subtitlesSize)
    video.setProp("extraSubtitlesOffset", settings.subtitlesOffset)
    video.setProp("extraSubtitlesTextColor", settings.subtitlesTextColor)
    video.setProp(
      "extraSubtitlesBackgroundColor",
      settings.subtitlesBackgroundColor,
    )
    video.setProp("extraSubtitlesOutlineColor", settings.subtitlesOutlineColor)
  }, [
    settings.subtitlesSize,
    settings.subtitlesOffset,
    settings.subtitlesTextColor,
    settings.subtitlesBackgroundColor,
    settings.subtitlesOutlineColor,
  ])

  const onEnded = useCallback(() => {
    ended()
    if (player.nextVideo !== null) {
      onNextVideoRequested()
    } else {
      window.history.back()
    }
  }, [player.nextVideo, onNextVideoRequested])

  const onError = useCallback((error) => {
    console.error("Player", error)
    if (error.critical) {
      setError(error)
    } else {
      toast.show({
        type: "error",
        title: t("ERROR"),
        message: error.message,
        timeout: 3000,
      })
    }
  }, [])

  const onSubtitlesTrackLoaded = useCallback(() => {
    toast.show({
      type: "success",
      title: t("PLAYER_SUBTITLES_LOADED"),
      message: t("PLAYER_SUBTITLES_LOADED_EMBEDDED"),
      timeout: 3000,
    })
  }, [])

  const onExtraSubtitlesTrackLoaded = useCallback((track) => {
    toast.show({
      type: "success",
      title: t("PLAYER_SUBTITLES_LOADED"),
      message: track.exclusive
        ? t("PLAYER_SUBTITLES_LOADED_EXCLUSIVE")
        : t("PLAYER_SUBTITLES_LOADED_ORIGIN", { origin: track.origin }),
      timeout: 3000,
    })
  }, [])

  const onPlayRequested = useCallback(() => {
    video.setProp("paused", false)
  }, [])

  const onPlayRequestedDebounced = useCallback(
    debounce(onPlayRequested, 200),
    [],
  )

  const onPauseRequested = useCallback(() => {
    video.setProp("paused", true)
  }, [])

  const onPauseRequestedDebounced = useCallback(
    debounce(onPauseRequested, 200),
    [],
  )
  const onMuteRequested = useCallback(() => {
    video.setProp("muted", true)
  }, [])

  const onUnmuteRequested = useCallback(() => {
    video.setProp("muted", false)
  }, [])

  const onVolumeChangeRequested = useCallback((volume) => {
    video.setProp("volume", volume)
  }, [])

  const onSeekRequested = useCallback((time) => {
    video.setProp("time", time)
  }, [])

  const onPlaybackSpeedChanged = useCallback((rate) => {
    video.setProp("playbackSpeed", rate)
  }, [])

  const onSubtitlesTrackSelected = useCallback((id) => {
    video.setProp("selectedSubtitlesTrackId", id)
    video.setProp("selectedExtraSubtitlesTrackId", null)
  }, [])

  const onExtraSubtitlesTrackSelected = useCallback((id) => {
    video.setProp("selectedSubtitlesTrackId", null)
    video.setProp("selectedExtraSubtitlesTrackId", id)
  }, [])

  const onAudioTrackSelected = useCallback((id) => {
    video.setProp("selectedAudioTrackId", id)
  }, [])

  const onExtraSubtitlesDelayChanged = useCallback((delay) => {
    video.setProp("extraSubtitlesDelay", delay)
  }, [])

  const onSubtitlesSizeChanged = useCallback(
    (size) => {
      updateSettings({ subtitlesSize: size })
    },
    [updateSettings],
  )

  const onSubtitlesOffsetChanged = useCallback(
    (offset) => {
      updateSettings({ subtitlesOffset: offset })
    },
    [updateSettings],
  )

  const onDismissNextVideoPopup = useCallback(() => {
    closeNextVideoPopup()
    nextVideoPopupDismissed.current = true
  }, [])

  const onNextVideoRequested = useCallback(() => {
    if (player.nextVideo !== null) {
      nextVideo()

      const deepLinks = player.nextVideo.deepLinks
      if (deepLinks.metaDetailsStreams && deepLinks.player) {
        window.location.replace(deepLinks.metaDetailsStreams)
        window.location.href = deepLinks.player
      } else {
        window.location.replace(
          deepLinks.player ?? deepLinks.metaDetailsStreams,
        )
      }
    }
  }, [player.nextVideo])

  const onVideoClick = useCallback(() => {
    if (video.state.paused !== null) {
      if (video.state.paused) {
        onPlayRequestedDebounced()
      } else {
        onPauseRequestedDebounced()
      }
    }
  }, [video.state.paused])

  const onVideoDoubleClick = useCallback(() => {
    onPlayRequestedDebounced.cancel()
    onPauseRequestedDebounced.cancel()
    toggleFullscreen()
  }, [toggleFullscreen])

  const onContainerMouseDown = useCallback((event) => {
    if (!event.nativeEvent.optionsMenuClosePrevented) {
      closeOptionsMenu()
    }
    if (!event.nativeEvent.subtitlesMenuClosePrevented) {
      closeSubtitlesMenu()
    }
    if (!event.nativeEvent.infoMenuClosePrevented) {
      closeInfoMenu()
    }
    if (!event.nativeEvent.speedMenuClosePrevented) {
      closeSpeedMenu()
    }
    if (!event.nativeEvent.videosMenuClosePrevented) {
      closeVideosMenu()
    }
    if (!event.nativeEvent.statisticsMenuClosePrevented) {
      closeStatisticsMenu()
    }
  }, [])

  const onContainerMouseMove = useCallback((event) => {
    setImmersed(false)
    if (!event.nativeEvent.immersePrevented) {
      setImmersedDebounced(true)
    } else {
      setImmersedDebounced.cancel()
    }
  }, [])

  const onContainerMouseLeave = useCallback(() => {
    setImmersedDebounced.cancel()
    setImmersed(true)
  }, [])

  const onBarMouseMove = useCallback((event) => {
    event.nativeEvent.immersePrevented = true
  }, [])

  useEffect(() => {
    setError(null)
    if (player.selected === null) {
      video.unload()
    } else if (
      streamingServer.settings !== null &&
      streamingServer.settings.type !== "Loading" &&
      (player.selected.metaRequest === null ||
        (player.metaItem !== null && player.metaItem.type !== "Loading"))
    ) {
      video.load(
        {
          stream: {
            ...player.selected.stream,
            subtitles: Array.isArray(player.selected.stream.subtitles)
              ? player.selected.stream.subtitles.map((subtitles) => ({
                  ...subtitles,
                  label: subtitles.url,
                }))
              : [],
          },
          autoplay: true,
          time:
            player.libraryItem !== null &&
            player.selected.streamRequest !== null &&
            player.selected.streamRequest.path !== null &&
            player.libraryItem.state.video_id ===
              player.selected.streamRequest.path.id
              ? player.libraryItem.state.timeOffset
              : 0,
          forceTranscoding: forceTranscoding || casting,
          maxAudioChannels: settings.surroundSound ? 32 : 2,
          streamingServerURL: streamingServer.baseUrl
            ? casting
              ? streamingServer.baseUrl
              : streamingServer.selected.transportUrl
            : null,
          seriesInfo: player.seriesInfo,
        },
        {
          chromecastTransport: chromecast.active ? chromecast.transport : null,
          shellTransport: shell.active ? shell.transport : null,
        },
      )
    }
  }, [
    streamingServer.baseUrl,
    player.selected,
    player.metaItem,
    forceTranscoding,
    casting,
  ])
  useEffect(() => {
    if (video.state.stream !== null) {
      const tracks = player.subtitles.map((subtitles) => ({
        ...subtitles,
        label: subtitles.url,
      }))
      video.addExtraSubtitlesTracks(tracks)
    }
  }, [player.subtitles, video.state.stream])

  useEffect(() => {
    video.setProp("subtitlesSize", settings.subtitlesSize)
    video.setProp("extraSubtitlesSize", settings.subtitlesSize)
  }, [settings.subtitlesSize])

  useEffect(() => {
    video.setProp("subtitlesOffset", settings.subtitlesOffset)
    video.setProp("extraSubtitlesOffset", settings.subtitlesOffset)
  }, [settings.subtitlesOffset])

  useEffect(() => {
    video.setProp("subtitlesTextColor", settings.subtitlesTextColor)
    video.setProp("extraSubtitlesTextColor", settings.subtitlesTextColor)
  }, [settings.subtitlesTextColor])

  useEffect(() => {
    video.setProp("subtitlesBackgroundColor", settings.subtitlesBackgroundColor)
    video.setProp(
      "extraSubtitlesBackgroundColor",
      settings.subtitlesBackgroundColor,
    )
  }, [settings.subtitlesBackgroundColor])

  useEffect(() => {
    video.setProp("subtitlesOutlineColor", settings.subtitlesOutlineColor)
    video.setProp("extraSubtitlesOutlineColor", settings.subtitlesOutlineColor)
  }, [settings.subtitlesOutlineColor])

  useEffect(() => {
    if (
      video.state.time !== null &&
      !isNaN(video.state.time) &&
      video.state.duration !== null &&
      !isNaN(video.state.duration) &&
      video.state.manifest !== null &&
      typeof video.state.manifest.name === "string"
    ) {
      timeChanged(
        video.state.time,
        video.state.duration,
        video.state.manifest.name,
      )
    }
  }, [video.state.time, video.state.duration, video.state.manifest])

  useEffect(() => {
    if (video.state.paused !== null) {
      pausedChanged(video.state.paused)
    }
  }, [video.state.paused])

  useEffect(() => {
    videoParamsChanged(video.state.videoParams)
  }, [video.state.videoParams])

  useEffect(() => {
    if (
      !!settings.bingeWatching &&
      player.nextVideo !== null &&
      !nextVideoPopupDismissed.current
    ) {
      if (
        video.state.time !== null &&
        video.state.duration !== null &&
        video.state.time < video.state.duration &&
        video.state.duration - video.state.time <=
          settings.nextVideoNotificationDuration
      ) {
        openNextVideoPopup()
      } else {
        closeNextVideoPopup()
      }
    }
  }, [player.nextVideo, video.state.time, video.state.duration])

  useEffect(() => {
    if (!defaultSubtitlesSelected.current) {
      const findTrackByLang = (tracks, lang) =>
        tracks.find(
          (track) =>
            track.lang === lang || langs.where("1", track.lang)?.[2] === lang,
        )

      const subtitlesTrack = findTrackByLang(
        video.state.subtitlesTracks,
        settings.subtitlesLanguage,
      )
      const extraSubtitlesTrack = findTrackByLang(
        video.state.extraSubtitlesTracks,
        settings.subtitlesLanguage,
      )

      if (subtitlesTrack && subtitlesTrack.id) {
        onSubtitlesTrackSelected(subtitlesTrack.id)
        defaultSubtitlesSelected.current = true
      } else if (extraSubtitlesTrack && extraSubtitlesTrack.id) {
        onExtraSubtitlesTrackSelected(extraSubtitlesTrack.id)
        defaultSubtitlesSelected.current = true
      }
    }
  }, [video.state.subtitlesTracks, video.state.extraSubtitlesTracks])

  useEffect(() => {
    if (!defaultAudioTrackSelected.current) {
      const findTrackByLang = (tracks, lang) =>
        tracks.find(
          (track) =>
            track.lang === lang || langs.where("1", track.lang)?.[2] === lang,
        )
      const audioTrack = findTrackByLang(
        video.state.audioTracks,
        settings.audioLanguage,
      )

      if (audioTrack && audioTrack.id) {
        onAudioTrackSelected(audioTrack.id)
        defaultAudioTrackSelected.current = true
      }
    }
  }, [video.state.audioTracks])

  useEffect(() => {
    defaultSubtitlesSelected.current = false
    defaultAudioTrackSelected.current = false
    nextVideoPopupDismissed.current = false
  }, [video.state.stream])

  useEffect(() => {
    if (
      (!Array.isArray(video.state.subtitlesTracks) ||
        video.state.subtitlesTracks.length === 0) &&
      (!Array.isArray(video.state.extraSubtitlesTracks) ||
        video.state.extraSubtitlesTracks.length === 0) &&
      (!Array.isArray(video.state.audioTracks) ||
        video.state.audioTracks.length === 0)
    ) {
      closeSubtitlesMenu()
    }
  }, [
    video.state.audioTracks,
    video.state.subtitlesTracks,
    video.state.extraSubtitlesTracks,
  ])

  useEffect(() => {
    if (player.metaItem === null || player.metaItem.type !== "Ready") {
      closeInfoMenu()
      closeVideosMenu()
    }
  }, [player.metaItem])

  useEffect(() => {
    if (video.state.playbackSpeed === null) {
      closeSpeedMenu()
    }
  }, [video.state.playbackSpeed])

  useEffect(() => {
    const toastFilter = (item) => item?.dataset?.type === "CoreEvent"
    toast.addFilter(toastFilter)
    const onCastStateChange = () => {
      setCasting(
        chromecast.active &&
          chromecast.transport.getCastState() ===
            cast.framework.CastState.CONNECTED,
      )
    }
    const onChromecastServiceStateChange = () => {
      onCastStateChange()
      if (chromecast.active) {
        chromecast.transport.on(
          cast.framework.CastContextEventType.CAST_STATE_CHANGED,
          onCastStateChange,
        )
      }
    }
    const onCoreEvent = ({ event }) => {
      if (event === "PlayingOnDevice") {
        onPauseRequested()
      }
    }
    chromecast.on("stateChanged", onChromecastServiceStateChange)
    core.transport.on("CoreEvent", onCoreEvent)
    onChromecastServiceStateChange()
    return () => {
      toast.removeFilter(toastFilter)
      chromecast.off("stateChanged", onChromecastServiceStateChange)
      core.transport.off("CoreEvent", onCoreEvent)
      if (chromecast.active) {
        chromecast.transport.off(
          cast.framework.CastContextEventType.CAST_STATE_CHANGED,
          onCastStateChange,
        )
      }
    }
  }, [])

  useLayoutEffect(() => {
    const onKeyDown = (event) => {
      switch (event.code) {
        case "Space": {
          if (
            !menusOpen &&
            !nextVideoPopupOpen &&
            video.state.paused !== null
          ) {
            if (video.state.paused) {
              onPlayRequested()
            } else {
              onPauseRequested()
            }
          }

          break
        }
        case "ArrowRight": {
          if (!menusOpen && !nextVideoPopupOpen && video.state.time !== null) {
            const seekDuration = event.shiftKey
              ? settings.seekShortTimeDuration
              : settings.seekTimeDuration
            onSeekRequested(video.state.time + seekDuration)
          }

          break
        }
        case "ArrowLeft": {
          if (!menusOpen && !nextVideoPopupOpen && video.state.time !== null) {
            const seekDuration = event.shiftKey
              ? settings.seekShortTimeDuration
              : settings.seekTimeDuration
            onSeekRequested(video.state.time - seekDuration)
          }

          break
        }
        case "ArrowUp": {
          if (
            !menusOpen &&
            !nextVideoPopupOpen &&
            video.state.volume !== null
          ) {
            onVolumeChangeRequested(video.state.volume + 5)
          }

          break
        }
        case "ArrowDown": {
          if (
            !menusOpen &&
            !nextVideoPopupOpen &&
            video.state.volume !== null
          ) {
            onVolumeChangeRequested(video.state.volume - 5)
          }

          break
        }
        case "KeyS": {
          closeMenus()
          if (
            (Array.isArray(video.state.subtitlesTracks) &&
              video.state.subtitlesTracks.length > 0) ||
            (Array.isArray(video.state.extraSubtitlesTracks) &&
              video.state.extraSubtitlesTracks.length > 0) ||
            (Array.isArray(video.state.audioTracks) &&
              video.state.audioTracks.length > 0)
          ) {
            toggleSubtitlesMenu()
          }

          break
        }
        case "KeyI": {
          closeMenus()
          if (player.metaItem !== null && player.metaItem.type === "Ready") {
            toggleInfoMenu()
          }

          break
        }
        case "KeyR": {
          closeMenus()
          if (video.state.playbackSpeed !== null) {
            toggleSpeedMenu()
          }

          break
        }
        case "KeyV": {
          closeMenus()
          if (
            player.metaItem !== null &&
            player.metaItem.type === "Ready" &&
            player.metaItem?.content?.videos?.length > 0
          ) {
            toggleVideosMenu()
          }

          break
        }
        case "KeyD": {
          closeMenus()
          if (
            streamingServer.statistics !== null &&
            streamingServer.statistics.type !== "Err" &&
            player.selected &&
            typeof player.selected.stream.infoHash === "string" &&
            typeof player.selected.stream.fileIdx === "number"
          ) {
            toggleStatisticsMenu()
          }

          break
        }
        case "Escape": {
          closeMenus()
          break
        }
      }
    }
    const onWheel = ({ deltaY }) => {
      if (deltaY > 0) {
        if (!menusOpen && video.state.volume !== null) {
          onVolumeChangeRequested(video.state.volume - 5)
        }
      } else {
        if (!menusOpen && video.state.volume !== null) {
          onVolumeChangeRequested(video.state.volume + 5)
        }
      }
    }
    if (routeFocused) {
      window.addEventListener("keydown", onKeyDown)
      window.addEventListener("wheel", onWheel)
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("wheel", onWheel)
    }
  }, [
    player.metaItem,
    player.selected,
    streamingServer.statistics,
    settings.seekTimeDuration,
    settings.seekShortTimeDuration,
    routeFocused,
    menusOpen,
    nextVideoPopupOpen,
    video.state.paused,
    video.state.time,
    video.state.volume,
    video.state.audioTracks,
    video.state.subtitlesTracks,
    video.state.extraSubtitlesTracks,
    video.state.playbackSpeed,
    toggleSubtitlesMenu,
    toggleInfoMenu,
    toggleVideosMenu,
    toggleStatisticsMenu,
  ])

  useEffect(() => {
    video.events.on("error", onError)
    video.events.on("ended", onEnded)
    video.events.on("subtitlesTrackLoaded", onSubtitlesTrackLoaded)
    video.events.on("extraSubtitlesTrackLoaded", onExtraSubtitlesTrackLoaded)
    video.events.on("implementationChanged", onImplementationChanged)

    return () => {
      video.events.off("error", onError)
      video.events.off("ended", onEnded)
      video.events.off("subtitlesTrackLoaded", onSubtitlesTrackLoaded)
      video.events.off("extraSubtitlesTrackLoaded", onExtraSubtitlesTrackLoaded)
      video.events.off("implementationChanged", onImplementationChanged)
    }
  }, [])

  useLayoutEffect(() => {
    return () => {
      setImmersedDebounced.cancel()
      onPlayRequestedDebounced.cancel()
      onPauseRequestedDebounced.cancel()
    }
  }, [])

  return (
    <div
      className={classnames(styles["player-container"], {
        [styles["overlayHidden"]]: overlayHidden,
      })}
      onMouseDown={onContainerMouseDown}
      onMouseMove={onContainerMouseMove}
      onMouseOver={onContainerMouseMove}
      onMouseLeave={onContainerMouseLeave}
    >
      <Video
        ref={video.containerElement}
        className={styles["layer"]}
        onClick={onVideoClick}
        onDoubleClick={onVideoDoubleClick}
      />
      {!video.state.loaded ? (
        <div
          className={classnames(styles["layer"], styles["background-layer"])}
        >
          <img
            className={styles["image"]}
            src={player?.metaItem?.content?.background}
          />
        </div>
      ) : null}
      {(video.state.buffering || !video.state.loaded) && !error ? (
        <BufferingLoader
          className={classnames(styles["layer"], styles["buffering-layer"])}
          logo={player?.metaItem?.content?.logo}
        />
      ) : null}
      {error !== null ? (
        <Error
          className={classnames(styles["layer"], styles["error-layer"])}
          stream={video.state.stream}
          {...error}
        />
      ) : null}
      {menusOpen ? <div className={styles["layer"]} /> : null}
      {video.state.volume !== null && overlayHidden ? (
        <VolumeChangeIndicator
          muted={video.state.muted}
          volume={video.state.volume}
        />
      ) : null}
      <HorizontalNavBar
        className={classnames(styles["layer"], styles["nav-bar-layer"])}
        title={player.title !== null ? player.title : ""}
        backButton={true}
        fullscreenButton={true}
        onMouseMove={onBarMouseMove}
        onMouseOver={onBarMouseMove}
      />
      <ControlBar
        className={classnames(styles["layer"], styles["control-bar-layer"])}
        paused={video.state.paused}
        time={video.state.time}
        duration={video.state.duration}
        buffered={video.state.buffered}
        volume={video.state.volume}
        muted={video.state.muted}
        playbackSpeed={video.state.playbackSpeed}
        subtitlesTracks={video.state.subtitlesTracks.concat(
          video.state.extraSubtitlesTracks,
        )}
        audioTracks={video.state.audioTracks}
        metaItem={player.metaItem}
        nextVideo={player.nextVideo}
        stream={player.selected !== null ? player.selected.stream : null}
        statistics={statistics}
        onPlayRequested={onPlayRequested}
        onPauseRequested={onPauseRequested}
        onNextVideoRequested={onNextVideoRequested}
        onMuteRequested={onMuteRequested}
        onUnmuteRequested={onUnmuteRequested}
        onVolumeChangeRequested={onVolumeChangeRequested}
        onSeekRequested={onSeekRequested}
        onToggleOptionsMenu={toggleOptionsMenu}
        onToggleSubtitlesMenu={toggleSubtitlesMenu}
        onToggleInfoMenu={toggleInfoMenu}
        onToggleSpeedMenu={toggleSpeedMenu}
        onToggleVideosMenu={toggleVideosMenu}
        onToggleStatisticsMenu={toggleStatisticsMenu}
        onMouseMove={onBarMouseMove}
        onMouseOver={onBarMouseMove}
      />
      {nextVideoPopupOpen ? (
        <NextVideoPopup
          className={classnames(styles["layer"], styles["menu-layer"])}
          metaItem={
            player.metaItem !== null && player.metaItem.type === "Ready"
              ? player.metaItem.content
              : null
          }
          nextVideo={player.nextVideo}
          onDismiss={onDismissNextVideoPopup}
          onNextVideoRequested={onNextVideoRequested}
        />
      ) : null}
      {statisticsMenuOpen ? (
        <StatisticsMenu
          className={classnames(styles["layer"], styles["menu-layer"])}
          {...statistics}
        />
      ) : null}
      {subtitlesMenuOpen ? (
        <SubtitlesMenu
          className={classnames(styles["layer"], styles["menu-layer"])}
          audioTracks={video.state.audioTracks}
          selectedAudioTrackId={video.state.selectedAudioTrackId}
          subtitlesTracks={video.state.subtitlesTracks}
          selectedSubtitlesTrackId={video.state.selectedSubtitlesTrackId}
          subtitlesOffset={video.state.subtitlesOffset}
          subtitlesSize={video.state.subtitlesSize}
          extraSubtitlesTracks={video.state.extraSubtitlesTracks}
          selectedExtraSubtitlesTrackId={
            video.state.selectedExtraSubtitlesTrackId
          }
          extraSubtitlesOffset={video.state.extraSubtitlesOffset}
          extraSubtitlesDelay={video.state.extraSubtitlesDelay}
          extraSubtitlesSize={video.state.extraSubtitlesSize}
          onSubtitlesTrackSelected={onSubtitlesTrackSelected}
          onExtraSubtitlesTrackSelected={onExtraSubtitlesTrackSelected}
          onAudioTrackSelected={onAudioTrackSelected}
          onSubtitlesOffsetChanged={onSubtitlesOffsetChanged}
          onSubtitlesSizeChanged={onSubtitlesSizeChanged}
          onExtraSubtitlesOffsetChanged={onSubtitlesOffsetChanged}
          onExtraSubtitlesDelayChanged={onExtraSubtitlesDelayChanged}
          onExtraSubtitlesSizeChanged={onSubtitlesSizeChanged}
        />
      ) : null}
      {infoMenuOpen ? (
        <InfoMenu
          className={classnames(styles["layer"], styles["menu-layer"])}
          stream={player.selected !== null ? player.selected.stream : null}
          addon={player.addon}
          metaItem={
            player.metaItem !== null && player.metaItem.type === "Ready"
              ? player.metaItem.content
              : null
          }
        />
      ) : null}
      {speedMenuOpen ? (
        <SpeedMenu
          className={classnames(styles["layer"], styles["menu-layer"])}
          playbackSpeed={video.state.playbackSpeed}
          onPlaybackSpeedChanged={onPlaybackSpeedChanged}
        />
      ) : null}
      {videosMenuOpen ? (
        <VideosMenu
          className={classnames(styles["layer"], styles["menu-layer"])}
          metaItem={
            player.metaItem !== null && player.metaItem.type === "Ready"
              ? player.metaItem.content
              : null
          }
          seriesInfo={player.seriesInfo}
        />
      ) : null}
      {optionsMenuOpen ? (
        <OptionsMenu
          className={classnames(styles["layer"], styles["menu-layer"])}
          stream={player.selected.stream}
          playbackDevices={
            streamingServer.playbackDevices !== null &&
            streamingServer.playbackDevices.type === "Ready"
              ? streamingServer.playbackDevices.content
              : []
          }
        />
      ) : null}
    </div>
  )
}

Player.propTypes = {
  urlParams: PropTypes.shape({
    stream: PropTypes.string,
    streamTransportUrl: PropTypes.string,
    metaTransportUrl: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string,
    videoId: PropTypes.string,
  }),
  queryParams: PropTypes.instanceOf(URLSearchParams),
}

const PlayerFallback = () => (
  <div className={classnames(styles["player-container"])} />
)

export default withCoreSuspender(Player, PlayerFallback)
