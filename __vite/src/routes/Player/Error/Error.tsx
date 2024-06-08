// Copyright (C) 2017-2023 Smart code 203358507

import { useTranslation } from "react-i18next"
import PropTypes from "prop-types"
import classNames from "classnames"
import { default as Icon } from "@stremio/stremio-icons/react"
import Button from "stremio/common/Button"
import * as styles from "./styles.less"
import { useMemo } from "react"

const Error = ({ className, code, message, stream }) => {
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
          target={"_blank"}
        >
          <Icon className={styles["icon"]} name={"ic_downloads"} />
          <div className={styles["label"]}>{t("PLAYER_OPEN_IN_EXTERNAL")}</div>
        </Button>
      ) : null}
    </div>
  )
}

Error.propTypes = {
  className: PropTypes.string,
  code: PropTypes.number,
  message: PropTypes.string,
  stream: PropTypes.object,
}

export default Error
