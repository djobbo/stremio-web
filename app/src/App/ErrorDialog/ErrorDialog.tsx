// Copyright (C) 2017-2023 Smart code 203358507

import classnames from "classnames"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"
import { Button, Image } from "stremio/common"

import styles from "./styles.module.less"

type ErrorDialogProps = {
  className?: string
}

const ErrorDialog = ({ className }: ErrorDialogProps) => {
  const { t } = useTranslation()

  const [dataCleared, setDataCleared] = useState(false)
  const reload = useCallback(() => {
    window.location.reload()
  }, [])
  const clearData = useCallback(() => {
    window.localStorage.clear()
    setDataCleared(true)
  }, [])

  return (
    <div className={classnames(className, styles["error-container"])}>
      <Image
        className={styles["error-image"]}
        src="/images/empty.png"
        alt={" "}
      />
      <div className={styles["error-message"]}>
        {t("GENERIC_ERROR_MESSAGE")}
      </div>
      <div className={styles["buttons-container"]}>
        <Button
          className={styles["button-container"]}
          title={t("TRY_AGAIN")}
          onClick={reload}
        >
          <div className={styles["label"]}>{t("TRY_AGAIN")}</div>
        </Button>
        <Button
          className={styles["button-container"]}
          disabled={dataCleared}
          title={t("CLEAR_DATA")}
          onClick={clearData}
        >
          <div className={styles["label"]}>{t("CLEAR_DATA")}</div>
        </Button>
      </div>
    </div>
  )
}

ErrorDialog.displayName = "ErrorDialog"

export default ErrorDialog
