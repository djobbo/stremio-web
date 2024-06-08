// Copyright (C) 2017-2023 Smart code 203358507

import { default as Icon } from "@stremio/stremio-icons/react"
import classNames from "classnames"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import Button from "stremio/common/Button"

import styles from "./styles.module.less"

type ErrorProps = {
  className?: string
  code?: number
  message?: string
  stream?: object
}

const Error = ({ className, code, message, stream }: ErrorProps) => {
  const { t } = useTranslation()

  const [playlist, fileName] = useMemo(() => {
    return [
      stream?.deepLinks?.externalPlayer?.playlist,
      stream?.deepLinks?.externalPlayer?.fileName,
    ]
  }, [stream])

  return (
    <div className={classNames(className, styles["error"])}>
      <div className={styles["error-label"]} title={message}>
        {message}
      </div>
      {code === 2 ? (
        <div className={styles["error-sub"]} title={t("EXTERNAL_PLAYER_HINT")}>
          {t("EXTERNAL_PLAYER_HINT")}
        </div>
      ) : null}
      {playlist && fileName ? (
        <Button
          className={styles["playlist-button"]}
          title={t("PLAYER_OPEN_IN_EXTERNAL")}
          href={playlist}
          download={fileName}
          target="_blank"
        >
          <Icon className={styles["icon"]} name="ic_downloads" />
          <div className={styles["label"]}>{t("PLAYER_OPEN_IN_EXTERNAL")}</div>
        </Button>
      ) : null}
    </div>
  )
}

export default Error
