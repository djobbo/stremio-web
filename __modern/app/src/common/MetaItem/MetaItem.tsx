import { default as Icon } from "@stremio/stremio-icons/react"
import classnames from "classnames"
import { default as filterInvalidDOMProps } from "filter-invalid-dom-props"
import { memo, useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import Button from "stremio/common/Button"
import { ICON_FOR_TYPE } from "stremio/common/CONSTANTS"
import Image from "stremio/common/Image"
import Multiselect from "stremio/common/Multiselect"
import useBinaryState from "stremio/common/useBinaryState"

import styles from "./styles.module.less"

type MetaItemProps = {
  className?: string
  type?: string
  name?: string
  poster?: string
  posterShape?: "poster" | "landscape" | "square"
  posterChangeCursor?: boolean
  progress?: number
  newVideos?: number
  options?: unknown[]
  deepLinks?: {
    metaDetailsVideos?: string
    metaDetailsStreams?: string
    player?: string
  }
  dataset?: object
  optionOnSelect?: (...args: unknown[]) => unknown
  onDismissClick?: (...args: unknown[]) => unknown
  onPlayClick?: (...args: unknown[]) => unknown
  onClick?: (...args: unknown[]) => unknown
  watched?: boolean
}

const MetaItem = memo(
  ({
    className,
    type,
    name,
    poster,
    posterShape,
    posterChangeCursor,
    progress,
    newVideos,
    options,
    deepLinks,
    dataset,
    optionOnSelect,
    onDismissClick,
    onPlayClick,
    watched,
    ...props
  }: MetaItemProps) => {
    const { t } = useTranslation()
    const [menuOpen, onMenuOpen, onMenuClose] = useBinaryState(false)
    const href = useMemo(() => {
      return deepLinks
        ? typeof deepLinks.player === "string"
          ? deepLinks.player
          : typeof deepLinks.metaDetailsStreams === "string"
            ? deepLinks.metaDetailsStreams
            : typeof deepLinks.metaDetailsVideos === "string"
              ? deepLinks.metaDetailsVideos
              : null
        : null
    }, [deepLinks])
    const metaItemOnClick = useCallback(
      (event) => {
        if (event.nativeEvent.selectPrevented) {
          event.preventDefault()
        } else if (typeof props.onClick === "function") {
          props.onClick(event)
        }
      },
      [props.onClick],
    )
    const menuOnClick = useCallback((event) => {
      event.nativeEvent.selectPrevented = true
    }, [])
    const menuOnSelect = useCallback(
      (event) => {
        if (typeof optionOnSelect === "function") {
          optionOnSelect({
            type: "select-option",
            value: event.value,
            dataset: dataset,
            reactEvent: event.reactEvent,
            nativeEvent: event.nativeEvent,
          })
        }
      },
      [dataset, optionOnSelect],
    )
    const renderPosterFallback = useCallback(
      () => (
        <Icon
          className={styles["placeholder-icon"]}
          name={
            ICON_FOR_TYPE.has(type)
              ? ICON_FOR_TYPE.get(type)
              : ICON_FOR_TYPE.get("other")
          }
        />
      ),
      [type],
    )
    const renderMenuLabelContent = useCallback(
      () => <Icon className={styles["icon"]} name="more-vertical" />,
      [],
    )
    return (
      <Button
        title={name}
        href={href}
        {...filterInvalidDOMProps(props)}
        className={classnames(
          className,
          styles["meta-item-container"],
          styles["poster-shape-poster"],
          styles[`poster-shape-${posterShape}`],
          { active: menuOpen },
        )}
        onClick={metaItemOnClick}
      >
        <div
          className={classnames(styles["poster-container"], {
            "poster-change-cursor": posterChangeCursor,
          })}
        >
          {onDismissClick ? (
            <div
              title={t("LIBRARY_RESUME_DISMISS")}
              className={styles["dismiss-icon-layer"]}
              onClick={onDismissClick}
            >
              <Icon className={styles["dismiss-icon"]} name="close" />
              <div className={styles["dismiss-icon-backdrop"]} />
            </div>
          ) : null}
          {watched ? (
            <div className={styles["watched-icon-layer"]}>
              <Icon className={styles["watched-icon"]} name="checkmark" />
            </div>
          ) : null}
          <div className={styles["poster-image-layer"]}>
            <Image
              className={styles["poster-image"]}
              src={poster}
              alt={" "}
              renderFallback={renderPosterFallback}
            />
          </div>
          {onPlayClick ? (
            <div
              title={t("CONTINUE_WATCHING")}
              className={styles["play-icon-layer"]}
              onClick={onPlayClick}
            >
              <Icon className={styles["play-icon"]} name="play" />
              <div className={styles["play-icon-outer"]} />
              <div className={styles["play-icon-background"]} />
            </div>
          ) : null}
          {progress > 0 ? (
            <div className={styles["progress-bar-layer"]}>
              <div
                className={styles["progress-bar"]}
                style={{ width: `${progress}%` }}
              />
              <div className={styles["progress-bar-background"]} />
            </div>
          ) : null}
          {newVideos > 0 ? (
            <div className={styles["new-videos"]}>
              <div className={styles["layer"]} />
              <div className={styles["layer"]} />
              <div className={styles["layer"]}>
                <Icon className={styles["icon"]} name="add" />
                <div className={styles["label"]}>{newVideos}</div>
              </div>
            </div>
          ) : null}
        </div>
        {(typeof name === "string" && name.length > 0) ||
        (Array.isArray(options) && options.length > 0) ? (
          <div className={styles["title-bar-container"]}>
            <div className={styles["title-label"]}>
              {typeof name === "string" && name.length > 0 ? name : ""}
            </div>
            {Array.isArray(options) && options.length > 0 ? (
              <Multiselect
                className={styles["menu-label-container"]}
                renderLabelContent={renderMenuLabelContent}
                options={options}
                onOpen={onMenuOpen}
                onClose={onMenuClose}
                onSelect={menuOnSelect}
                tabIndex={-1}
                onClick={menuOnClick}
              />
            ) : null}
          </div>
        ) : null}
      </Button>
    )
  },
)

MetaItem.displayName = "MetaItem"

export default MetaItem
