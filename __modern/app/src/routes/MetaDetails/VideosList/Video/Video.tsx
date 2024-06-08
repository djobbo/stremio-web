// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import { t } from "i18next"
import { useServices } from "stremio/services"
import { useRouteFocused } from "stremio-router"
import { default as Icon } from "@stremio/stremio-icons/react"
import { Button, Image, Popup, useBinaryState } from "stremio/common"
import VideoPlaceholder from "./VideoPlaceholder"
import * as styles from "./styles.module.less"
import { useCallback, useMemo, useEffect } from "react"

const Video = ({
  className,
  id,
  title,
  thumbnail,
  episode,
  released,
  upcoming,
  watched,
  progress,
  scheduled,
  deepLinks,
  ...props
}) => {
  const { core } = useServices()
  const routeFocused = useRouteFocused()
  const [menuOpen, , closeMenu, toggleMenu] = useBinaryState(false)
  const popupLabelOnMouseUp = useCallback((event) => {
    if (!event.nativeEvent.togglePopupPrevented) {
      if (event.nativeEvent.ctrlKey || event.nativeEvent.button === 2) {
        event.preventDefault()
        toggleMenu()
      }
    }
  }, [])
  const popupLabelOnContextMenu = useCallback(
    (event) => {
      if (
        !event.nativeEvent.togglePopupPrevented &&
        !event.nativeEvent.ctrlKey
      ) {
        event.preventDefault()
      }
    },
    [toggleMenu],
  )
  const popupLabelOnLongPress = useCallback(
    (event) => {
      if (
        event.nativeEvent.pointerType !== "mouse" &&
        !event.nativeEvent.togglePopupPrevented
      ) {
        toggleMenu()
      }
    },
    [toggleMenu],
  )
  const popupMenuOnPointerDown = useCallback((event) => {
    event.nativeEvent.togglePopupPrevented = true
  }, [])
  const popupMenuOnContextMenu = useCallback((event) => {
    event.nativeEvent.togglePopupPrevented = true
  }, [])
  const popupMenuOnClick = useCallback((event) => {
    event.nativeEvent.togglePopupPrevented = true
  }, [])
  const popupMenuOnKeyDown = useCallback((event) => {
    event.nativeEvent.buttonClickPrevented = true
  }, [])
  const toggleWatchedOnClick = useCallback(
    (event) => {
      event.preventDefault()
      closeMenu()
      core.transport.dispatch({
        action: "MetaDetails",
        args: {
          action: "MarkVideoAsWatched",
          args: [{ id, released }, !watched],
        },
      })
    },
    [id, released, watched],
  )
  const href = useMemo(() => {
    return deepLinks
      ? typeof deepLinks.player === "string"
        ? deepLinks.player
        : typeof deepLinks.metaDetailsStreams === "string"
          ? deepLinks.metaDetailsStreams
          : null
      : null
  }, [deepLinks])
  const renderLabel = useMemo(
    () =>
      function renderLabel({
        className,
        id,
        title,
        thumbnail,
        episode,
        released,
        upcoming,
        watched,
        progress,
        scheduled,
        children,
        ...props
      }) {
        return (
          <Button
            {...props}
            className={classnames(className, styles["video-container"])}
            title={title}
          >
            {typeof thumbnail === "string" && thumbnail.length > 0 ? (
              <div className={styles["thumbnail-container"]}>
                <Image
                  className={styles["thumbnail"]}
                  src={thumbnail}
                  alt={" "}
                  renderFallback={() => (
                    <Icon
                      className={styles["placeholder-icon"]}
                      name="symbol"
                    />
                  )}
                />
                {progress !== null && !isNaN(progress) && progress > 0 ? (
                  <div className={styles["progress-bar-container"]}>
                    <div
                      className={styles["progress-bar"]}
                      style={{ width: `${progress}%` }}
                    />
                    <div className={styles["progress-bar-background"]} />
                  </div>
                ) : null}
              </div>
            ) : null}
            <div className={styles["info-container"]}>
              <div className={styles["title-container"]}>
                {episode !== null && !isNaN(episode) ? `${episode}. ` : null}
                {typeof title === "string" && title.length > 0 ? title : id}
              </div>
              <div className={styles["flex-row-container"]}>
                {released instanceof Date && !isNaN(released.getTime()) ? (
                  <div className={styles["released-container"]}>
                    {released.toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                ) : scheduled ? (
                  <div
                    className={styles["released-container"]}
                    title="To be announced"
                  >
                    TBA
                  </div>
                ) : null}
                <div className={styles["upcoming-watched-container"]}>
                  {upcoming ? (
                    <div className={styles["upcoming-container"]}>
                      <div className={styles["flag-label"]}>Upcoming</div>
                    </div>
                  ) : null}
                  {watched ? (
                    <div className={styles["watched-container"]}>
                      <Icon className={styles["flag-icon"]} name="eye" />
                      <div className={styles["flag-label"]}>Watched</div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            {children}
          </Button>
        )
      },
    [],
  )
  const renderMenu = useMemo(
    () =>
      function renderMenu() {
        return (
          <div
            className={styles["context-menu-content"]}
            onPointerDown={popupMenuOnPointerDown}
            onContextMenu={popupMenuOnContextMenu}
            onClick={popupMenuOnClick}
            onKeyDown={popupMenuOnKeyDown}
          >
            <Button
              className={styles["context-menu-option-container"]}
              title="Watch"
            >
              <div className={styles["context-menu-option-label"]}>
                {t("CTX_WATCH")}
              </div>
            </Button>
            <Button
              className={styles["context-menu-option-container"]}
              title={watched ? "Mark as non-watched" : "Mark as watched"}
              onClick={toggleWatchedOnClick}
            >
              <div className={styles["context-menu-option-label"]}>
                {watched ? t("CTX_MARK_NON_WATCHED") : t("CTX_MARK_WATCHED")}
              </div>
            </Button>
          </div>
        )
      },
    [watched, toggleWatchedOnClick],
  )
  useEffect(() => {
    if (!routeFocused) {
      closeMenu()
    }
  }, [routeFocused])
  return (
    <Popup
      className={className}
      id={id}
      title={title}
      thumbnail={thumbnail}
      episode={episode}
      released={released}
      upcoming={upcoming}
      watched={watched}
      progress={progress}
      scheduled={scheduled}
      href={href}
      {...props}
      onMouseUp={popupLabelOnMouseUp}
      onLongPress={popupLabelOnLongPress}
      onContextMenu={popupLabelOnContextMenu}
      open={menuOpen}
      onCloseRequest={closeMenu}
      renderLabel={renderLabel}
      renderMenu={renderMenu}
    />
  )
}

Video.Placeholder = VideoPlaceholder

Video.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  title: PropTypes.string,
  thumbnail: PropTypes.string,
  episode: PropTypes.number,
  released: PropTypes.instanceOf(Date),
  upcoming: PropTypes.bool,
  watched: PropTypes.bool,
  progress: PropTypes.number,
  scheduled: PropTypes.bool,
  deepLinks: PropTypes.shape({
    metaDetailsStreams: PropTypes.string,
    player: PropTypes.string,
  }),
}

export default Video
