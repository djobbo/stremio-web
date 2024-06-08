import classnames from "classnames"
import { default as Icon } from "@stremio/stremio-icons/react"
import { Button, Image, useProfile, platform, useToast } from "stremio/common"
import { useServices } from "stremio/services"
import StreamPlaceholder from "./StreamPlaceholder"
import styles from "./styles.module.less"
import { useMemo, useCallback } from "react"

type StreamProps = {
  className?: string
  videoId?: string
  videoReleased?: Date
  addonName?: string
  name?: string
  description?: string
  thumbnail?: string
  progress?: number
  deepLinks?: {
    player?: string
    externalPlayer?: {
      download?: string
      streaming?: string
      playlist?: string
      fileName?: string
      web?: string
      openPlayer?: {
        ios?: string
        android?: string
        windows?: string
        macos?: string
        linux?: string
      }
    }
  }
  onClick?: (...args: unknown[]) => unknown
}

const Stream = ({
  className,
  videoId,
  videoReleased,
  addonName,
  name,
  description,
  thumbnail,
  progress,
  deepLinks,
  ...props
}: StreamProps) => {
  const profile = useProfile()
  const toast = useToast()
  const { core } = useServices()

  const href = useMemo(() => {
    return deepLinks
      ? deepLinks.externalPlayer
        ? deepLinks.externalPlayer.web
          ? deepLinks.externalPlayer.web
          : deepLinks.externalPlayer.openPlayer
            ? deepLinks.externalPlayer.openPlayer[platform.name]
              ? deepLinks.externalPlayer.openPlayer[platform.name]
              : deepLinks.externalPlayer.playlist
            : deepLinks.player
        : deepLinks.player
      : null
  }, [deepLinks])

  const download = useMemo(() => {
    return href === deepLinks?.externalPlayer?.playlist
      ? deepLinks.externalPlayer.fileName
      : null
  }, [href, deepLinks])

  const target = useMemo(() => {
    return href === deepLinks?.externalPlayer?.web ? "_blank" : null
  }, [href, deepLinks])

  const markVideoAsWatched = useCallback(() => {
    if (typeof videoId === "string") {
      core.transport.dispatch({
        action: "MetaDetails",
        args: {
          action: "MarkVideoAsWatched",
          args: [{ id: videoId, released: videoReleased }, true],
        },
      })
    }
  }, [videoId, videoReleased])

  const onClick = useCallback(
    (event) => {
      if (profile.settings.playerType !== null) {
        markVideoAsWatched()
        toast.show({
          type: "success",
          title: "Stream opened in external player",
          timeout: 4000,
        })
      }

      if (typeof props.onClick === "function") {
        props.onClick(event)
      }
    },
    [props.onClick, profile.settings, markVideoAsWatched],
  )

  const renderThumbnailFallback = useCallback(
    () => <Icon className={styles["placeholder-icon"]} name="ic_broken_link" />,
    [],
  )

  return (
    <Button
      className={classnames(className, styles["stream-container"])}
      title={addonName}
      href={href}
      download={download}
      target={target}
      onClick={onClick}
    >
      <div className={styles["info-container"]}>
        {typeof thumbnail === "string" && thumbnail.length > 0 ? (
          <div
            className={styles["thumbnail-container"]}
            title={name || addonName}
          >
            <Image
              className={styles["thumbnail"]}
              src={thumbnail}
              alt={" "}
              renderFallback={renderThumbnailFallback}
            />
          </div>
        ) : (
          <div
            className={styles["addon-name-container"]}
            title={name || addonName}
          >
            <div className={styles["addon-name"]}>{name || addonName}</div>
          </div>
        )}
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
      <div className={styles["description-container"]} title={description}>
        {description}
      </div>
      <Icon className={styles["icon"]} name="play" />
    </Button>
  )
}

Stream.Placeholder = StreamPlaceholder

export default Stream
