import { default as Icon } from "@stremio/stremio-icons/react"
import classnames from "classnames"
import { t } from "i18next"
import { useCallback, useEffect, useState } from "react"
import { Button, useBinaryState } from "stremio/common"
import { useServices } from "stremio/services"

import SeekBar from "./SeekBar"
import styles from "./styles.module.less"
import VolumeSlider from "./VolumeSlider"

type ControlBarProps = {
  className?: string
  paused?: boolean
  time?: number
  duration?: number
  buffered?: number
  volume?: number
  muted?: boolean
  playbackSpeed?: number
  subtitlesTracks?: unknown[]
  audioTracks?: unknown[]
  metaItem?: object
  nextVideo?: object
  stream?: object
  statistics?: object
  onPlayRequested?: (...args: unknown[]) => unknown
  onPauseRequested?: (...args: unknown[]) => unknown
  onNextVideoRequested?: (...args: unknown[]) => unknown
  onMuteRequested?: (...args: unknown[]) => unknown
  onUnmuteRequested?: (...args: unknown[]) => unknown
  onVolumeChangeRequested?: (...args: unknown[]) => unknown
  onSeekRequested?: (...args: unknown[]) => unknown
  onToggleSubtitlesMenu?: (...args: unknown[]) => unknown
  onToggleInfoMenu?: (...args: unknown[]) => unknown
  onToggleSpeedMenu?: (...args: unknown[]) => unknown
  onToggleVideosMenu?: (...args: unknown[]) => unknown
  onToggleOptionsMenu?: (...args: unknown[]) => unknown
  onToggleStatisticsMenu?: (...args: unknown[]) => unknown
}

const ControlBar = ({
  className,
  paused,
  time,
  duration,
  buffered,
  volume,
  muted,
  playbackSpeed,
  subtitlesTracks,
  audioTracks,
  metaItem,
  nextVideo,
  stream,
  statistics,
  onPlayRequested,
  onPauseRequested,
  onNextVideoRequested,
  onMuteRequested,
  onUnmuteRequested,
  onVolumeChangeRequested,
  onSeekRequested,
  onToggleSubtitlesMenu,
  onToggleInfoMenu,
  onToggleSpeedMenu,
  onToggleVideosMenu,
  onToggleOptionsMenu,
  onToggleStatisticsMenu,
  ...props
}: ControlBarProps) => {
  const { chromecast } = useServices()
  const [chromecastServiceActive, setChromecastServiceActive] = useState(
    () => chromecast.active,
  )
  const [buttonsMenuOpen, , , toogleButtonsMenu] = useBinaryState(false)
  const onSubtitlesButtonMouseDown = useCallback((event) => {
    event.nativeEvent.subtitlesMenuClosePrevented = true
  }, [])
  const onInfoButtonMouseDown = useCallback((event) => {
    event.nativeEvent.infoMenuClosePrevented = true
  }, [])
  const onSpeedButtonMouseDown = useCallback((event) => {
    event.nativeEvent.speedMenuClosePrevented = true
  }, [])
  const onVideosButtonMouseDown = useCallback((event) => {
    event.nativeEvent.videosMenuClosePrevented = true
  }, [])
  const onOptionsButtonMouseDown = useCallback((event) => {
    event.nativeEvent.optionsMenuClosePrevented = true
  }, [])
  const onStatisticsButtonMouseDown = useCallback((event) => {
    event.nativeEvent.statisticsMenuClosePrevented = true
  }, [])
  const onPlayPauseButtonClick = useCallback(() => {
    if (paused) {
      if (typeof onPlayRequested === "function") {
        onPlayRequested()
      }
    } else {
      if (typeof onPauseRequested === "function") {
        onPauseRequested()
      }
    }
  }, [paused, onPlayRequested, onPauseRequested])
  const onNextVideoButtonClick = useCallback(() => {
    if (nextVideo !== null && typeof onNextVideoRequested === "function") {
      onNextVideoRequested()
    }
  }, [nextVideo, onNextVideoRequested])
  const onMuteButtonClick = useCallback(() => {
    if (muted) {
      if (typeof onUnmuteRequested === "function") {
        onUnmuteRequested()
      }
    } else {
      if (typeof onMuteRequested === "function") {
        onMuteRequested()
      }
    }
  }, [muted, onMuteRequested, onUnmuteRequested])
  const onChromecastButtonClick = useCallback(() => {
    chromecast.transport.requestSession()
  }, [])
  useEffect(() => {
    const onStateChanged = () => {
      setChromecastServiceActive(chromecast.active)
    }
    chromecast.on("stateChanged", onStateChanged)
    return () => {
      chromecast.off("stateChanged", onStateChanged)
    }
  }, [])
  return (
    <div
      {...props}
      className={classnames(className, styles["control-bar-container"])}
    >
      <SeekBar
        className={styles["seek-bar"]}
        time={time}
        duration={duration}
        buffered={buffered}
        onSeekRequested={onSeekRequested}
      />
      <div className={styles["control-bar-buttons-container"]}>
        <Button
          className={classnames(styles["control-bar-button"], {
            disabled: typeof paused !== "boolean",
          })}
          title={paused ? t("PLAYER_PLAY") : t("PLAYER_PAUSE")}
          tabIndex={-1}
          onClick={onPlayPauseButtonClick}
        >
          <Icon
            className={styles["icon"]}
            name={typeof paused !== "boolean" || paused ? "play" : "pause"}
          />
        </Button>
        {nextVideo !== null ? (
          <Button
            className={classnames(styles["control-bar-button"])}
            title={t("PLAYER_NEXT_VIDEO")}
            tabIndex={-1}
            onClick={onNextVideoButtonClick}
          >
            <Icon className={styles["icon"]} name="next" />
          </Button>
        ) : null}
        <Button
          className={classnames(styles["control-bar-button"], {
            disabled: typeof muted !== "boolean",
          })}
          title={muted ? t("PLAYER_UNMUTE") : t("PLAYER_MUTE")}
          tabIndex={-1}
          onClick={onMuteButtonClick}
        >
          <Icon
            className={styles["icon"]}
            name={
              typeof muted === "boolean" && muted
                ? "volume-mute"
                : volume === null || isNaN(volume)
                  ? "volume-off"
                  : volume < 30
                    ? "volume-low"
                    : volume < 70
                      ? "volume-medium"
                      : "volume-high"
            }
          />
        </Button>
        <VolumeSlider
          className={styles["volume-slider"]}
          volume={volume}
          onVolumeChangeRequested={onVolumeChangeRequested}
        />
        <div className={styles["spacing"]} />
        <Button
          className={styles["control-bar-buttons-menu-button"]}
          onClick={toogleButtonsMenu}
        >
          <Icon className={styles["icon"]} name="more-vertical" />
        </Button>
        <div
          className={classnames(styles["control-bar-buttons-menu-container"], {
            open: buttonsMenuOpen,
          })}
        >
          <Button
            className={classnames(styles["control-bar-button"], {
              disabled:
                statistics === null ||
                statistics.type === "Err" ||
                stream === null ||
                typeof stream.infoHash !== "string" ||
                typeof stream.fileIdx !== "number",
            })}
            tabIndex={-1}
            onMouseDown={onStatisticsButtonMouseDown}
            onClick={onToggleStatisticsMenu}
          >
            <Icon className={styles["icon"]} name="network" />
          </Button>
          <Button
            className={classnames(styles["control-bar-button"], {
              disabled: playbackSpeed === null,
            })}
            tabIndex={-1}
            onMouseDown={onSpeedButtonMouseDown}
            onClick={onToggleSpeedMenu}
          >
            <Icon className={styles["icon"]} name="speed" />
          </Button>
          <Button
            className={classnames(styles["control-bar-button"], {
              disabled: metaItem === null || metaItem.type !== "Ready",
            })}
            tabIndex={-1}
            onMouseDown={onInfoButtonMouseDown}
            onClick={onToggleInfoMenu}
          >
            <Icon className={styles["icon"]} name="about" />
          </Button>
          <Button
            className={classnames(styles["control-bar-button"], {
              disabled: !chromecastServiceActive,
            })}
            tabIndex={-1}
            onClick={onChromecastButtonClick}
          >
            <Icon className={styles["icon"]} name="cast" />
          </Button>
          <Button
            className={classnames(styles["control-bar-button"], {
              disabled:
                (!Array.isArray(subtitlesTracks) ||
                  subtitlesTracks.length === 0) &&
                (!Array.isArray(audioTracks) || audioTracks.length === 0),
            })}
            tabIndex={-1}
            onMouseDown={onSubtitlesButtonMouseDown}
            onClick={onToggleSubtitlesMenu}
          >
            <Icon className={styles["icon"]} name="subtitles" />
          </Button>
          {metaItem?.content?.videos?.length > 0 ? (
            <Button
              className={styles["control-bar-button"]}
              tabIndex={-1}
              onMouseDown={onVideosButtonMouseDown}
              onClick={onToggleVideosMenu}
            >
              <Icon className={styles["icon"]} name="episodes" />
            </Button>
          ) : null}
          <Button
            className={styles["control-bar-button"]}
            tabIndex={-1}
            onMouseDown={onOptionsButtonMouseDown}
            onClick={onToggleOptionsMenu}
          >
            <Icon className={styles["icon"]} name="more-horizontal" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ControlBar
