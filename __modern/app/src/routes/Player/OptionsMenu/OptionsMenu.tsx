import classnames from "classnames"
import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useToast } from "stremio/common"
import { useServices } from "stremio/services"

import Option from "./Option"
import styles from "./styles.module.less"

type OptionsMenuProps = {
  className?: string
  stream?: object
  playbackDevices?: unknown[]
}

const OptionsMenu = ({
  className,
  stream,
  playbackDevices,
}: OptionsMenuProps) => {
  const { t } = useTranslation()
  const { core } = useServices()
  const toast = useToast()
  const [streamingUrl, downloadUrl] = useMemo(() => {
    return stream !== null
      ? stream.deepLinks &&
          stream.deepLinks.externalPlayer && [
            stream.deepLinks.externalPlayer.streaming,
            stream.deepLinks.externalPlayer.download,
          ]
      : [null, null]
  }, [stream])
  const externalDevices = useMemo(() => {
    return playbackDevices.filter(({ type }) => type === "external")
  }, [playbackDevices])
  const onCopyStreamButtonClick = useCallback(() => {
    if (streamingUrl || downloadUrl) {
      navigator.clipboard
        .writeText(streamingUrl || downloadUrl)
        .then(() => {
          toast.show({
            type: "success",
            title: "Copied",
            message: t("PLAYER_COPY_STREAM_SUCCESS"),
            timeout: 3000,
          })
        })
        .catch((e) => {
          console.error(e)
          toast.show({
            type: "error",
            title: t("Error"),
            message: `${t("PLAYER_COPY_STREAM_ERROR")}: ${streamingUrl || downloadUrl}`,
            timeout: 3000,
          })
        })
    }
  }, [streamingUrl, downloadUrl])
  const onDownloadVideoButtonClick = useCallback(() => {
    if (streamingUrl || downloadUrl) {
      window.open(streamingUrl || downloadUrl)
    }
  }, [streamingUrl, downloadUrl])
  const onExternalDeviceRequested = useCallback(
    (deviceId) => {
      if (streamingUrl) {
        core.transport.dispatch({
          action: "StreamingServer",
          args: {
            action: "PlayOnDevice",
            args: {
              device: deviceId,
              source: streamingUrl,
            },
          },
        })
      }
    },
    [streamingUrl],
  )
  const onMouseDown = useCallback((event) => {
    event.nativeEvent.optionsMenuClosePrevented = true
  }, [])
  return (
    <div
      className={classnames(className, styles["options-menu-container"])}
      onMouseDown={onMouseDown}
    >
      {streamingUrl || downloadUrl ? (
        <Option
          icon="link"
          label={t("CTX_COPY_STREAM_LINK")}
          disabled={stream === null}
          onClick={onCopyStreamButtonClick}
        />
      ) : null}
      {streamingUrl || downloadUrl ? (
        <Option
          icon="download"
          label={t("CTX_DOWNLOAD_VIDEO")}
          disabled={stream === null}
          onClick={onDownloadVideoButtonClick}
        />
      ) : null}
      {streamingUrl &&
        externalDevices.map(({ id, name }) => (
          <Option
            key={id}
            icon="vlc"
            label={t("PLAYER_PLAY_IN", { device: name })}
            deviceId={id}
            disabled={stream === null}
            onClick={onExternalDeviceRequested}
          />
        ))}
    </div>
  )
}

export default OptionsMenu
