// Copyright (C) 2017-2023 Smart code 203358507

import { useServices } from "stremio/services"
import PropTypes from "prop-types"
import classnames from "classnames"
import { useTranslation } from "react-i18next"
import Button from "stremio/common/Button"
import useProfile from "stremio/common/useProfile"
import { withCoreSuspender } from "stremio/common/CoreSuspender"
import styles from "./styles.module.less"
import { useCallback } from "react"

const StreamingServerWarning = ({ className }) => {
  const { t } = useTranslation()
  const { core } = useServices()
  const profile = useProfile()
  const onLaterClick = useCallback(() => {
    const streamingServerWarningDismissed = new Date()
    streamingServerWarningDismissed.setMonth(
      streamingServerWarningDismissed.getMonth() + 1,
    )
    core.transport.dispatch({
      action: "Ctx",
      args: {
        action: "UpdateSettings",
        args: {
          ...profile.settings,
          streamingServerWarningDismissed,
        },
      },
    })
  }, [profile.settings])
  const onDismissClick = useCallback(() => {
    const streamingServerWarningDismissed = new Date()
    streamingServerWarningDismissed.setFullYear(
      streamingServerWarningDismissed.getFullYear() + 50,
    )
    core.transport.dispatch({
      action: "Ctx",
      args: {
        action: "UpdateSettings",
        args: {
          ...profile.settings,
          streamingServerWarningDismissed,
        },
      },
    })
  }, [profile.settings])

  if (
    !isNaN(profile.settings.streamingServerWarningDismissed.getTime()) &&
    profile.settings.streamingServerWarningDismissed.getTime() > Date.now()
  ) {
    return null
  }

  return (
    <div className={classnames(className, styles["warning-container"])}>
      <div className={styles["warning-statement"]}>
        {t("SETTINGS_SERVER_UNAVAILABLE")}
      </div>
      <a
        href="https://www.stremio.com/download-service"
        target="_blank"
        rel="noreferrer"
      >
        <Button
          className={styles["warning-button"]}
          title={t("SERVICE_INSTALL")}
          tabIndex={-1}
        >
          <div className={styles["warning-label"]}>{t("SERVICE_INSTALL")}</div>
        </Button>
      </a>
      <Button
        className={styles["warning-button"]}
        title={t("WARNING_STREAMING_SERVER_LATER")}
        onClick={onLaterClick}
        tabIndex={-1}
      >
        <div className={styles["warning-label"]}>
          {t("WARNING_STREAMING_SERVER_LATER")}
        </div>
      </Button>
      <Button
        className={styles["warning-button"]}
        title={t("DONT_SHOW_AGAIN")}
        onClick={onDismissClick}
        tabIndex={-1}
      >
        <div className={styles["warning-label"]}>{t("DONT_SHOW_AGAIN")}</div>
      </Button>
    </div>
  )
}

StreamingServerWarning.propTypes = {
  className: PropTypes.string,
}

export default withCoreSuspender(StreamingServerWarning)
