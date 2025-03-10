import { default as Icon } from "@stremio/stremio-icons/react"
import classnames from "classnames"
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Button, CONSTANTS, Image } from "stremio/common"

import styles from "./styles.module.less"

type NextVideoPopupProps = {
  className?: string
  metaItem?: object
  nextVideo?: object
  onDismiss?: (...args: unknown[]) => unknown
  onNextVideoRequested?: (...args: unknown[]) => unknown
}

const NextVideoPopup = ({
  className,
  metaItem,
  nextVideo,
  onDismiss,
  onNextVideoRequested,
}: NextVideoPopupProps) => {
  const watchNowButtonRef = useRef(null)
  const [animationEnded, setAnimationEnded] = useState(false)
  const videoName = useMemo(() => {
    const title = (nextVideo && nextVideo.title) || (metaItem && metaItem.title)

    return nextVideo !== null &&
      typeof nextVideo.season === "number" &&
      typeof nextVideo.episode === "number"
      ? `${title} (S${nextVideo.season}E${nextVideo.episode})`
      : title
  }, [metaItem, nextVideo])
  const onAnimationEnd = useCallback(() => {
    setAnimationEnded(true)
  }, [])
  const renderPosterFallback = useCallback(() => {
    return metaItem !== null && typeof metaItem.type === "string" ? (
      <Icon
        className={styles["placeholder-icon"]}
        name={
          CONSTANTS.ICON_FOR_TYPE.has(metaItem.type)
            ? CONSTANTS.ICON_FOR_TYPE.get(metaItem.type)
            : CONSTANTS.ICON_FOR_TYPE.get("other")
        }
      />
    ) : null
  }, [metaItem])
  const onDismissButtonClick = useCallback(() => {
    if (typeof onDismiss === "function") {
      onDismiss()
    }
  }, [onDismiss])
  const onWatchNowButtonClick = useCallback(() => {
    if (typeof onNextVideoRequested === "function") {
      onNextVideoRequested()
    }
  }, [onNextVideoRequested])

  useLayoutEffect(() => {
    if (animationEnded === true && watchNowButtonRef.current !== null) {
      watchNowButtonRef.current.focus()
    }
  }, [animationEnded])

  return (
    <div
      className={classnames(className, styles["next-video-popup-container"])}
      onAnimationEnd={onAnimationEnd}
    >
      <div className={styles["poster-container"]}>
        <Image
          className={styles["poster-image"]}
          src={nextVideo?.thumbnail}
          alt={" "}
          fallbackSrc={metaItem?.poster}
          renderFallback={renderPosterFallback}
        />
      </div>
      <div className={styles["info-container"]}>
        <div className={styles["details-container"]}>
          {typeof metaItem?.name === "string" ? (
            <div className={styles["name"]}>
              <span className={styles["label"]}>Next on</span> {metaItem.name}
            </div>
          ) : null}
          {typeof videoName === "string" ? (
            <div className={styles["title"]}>{videoName}</div>
          ) : null}
          {nextVideo !== null && typeof nextVideo.overview === "string" ? (
            <div className={styles["description"]}>{nextVideo.overview}</div>
          ) : null}
        </div>
        <div className={styles["buttons-container"]}>
          <Button
            className={classnames(
              styles["button-container"],
              styles["dismiss"],
            )}
            onClick={onDismissButtonClick}
          >
            <Icon className={styles["icon"]} name="close" />
            <div className={styles["label"]}>Dismiss</div>
          </Button>
          <Button
            ref={watchNowButtonRef}
            className={classnames(
              styles["button-container"],
              styles["play-button"],
            )}
            onClick={onWatchNowButtonClick}
          >
            <Icon className={styles["icon"]} name="play" />
            <div className={styles["label"]}>Watch Now</div>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NextVideoPopup
