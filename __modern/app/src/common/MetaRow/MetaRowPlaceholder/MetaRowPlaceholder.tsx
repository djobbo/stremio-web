import { default as Icon } from "@stremio/stremio-icons/react"
import classnames from "classnames"
import { useTranslation } from "react-i18next"
import Button from "stremio/common/Button"
import { CATALOG_PREVIEW_SIZE } from "stremio/common/CONSTANTS"

import styles from "./styles.module.less"

type MetaRowPlaceholderProps = {
  className?: string
  title?: string
  deepLinks?: {
    discover?: string
  }
}

const MetaRowPlaceholder = ({
  className,
  title,
  deepLinks,
}: MetaRowPlaceholderProps) => {
  const { t } = useTranslation()
  return (
    <div
      className={classnames(
        className,
        styles["meta-row-placeholder-container"],
      )}
    >
      <div className={styles["header-container"]}>
        <div
          className={styles["title-container"]}
          title={typeof title === "string" && title.length > 0 ? title : null}
        >
          {typeof title === "string" && title.length > 0 ? title : null}
        </div>
        {deepLinks && typeof deepLinks.discover === "string" ? (
          <Button
            className={styles["see-all-container"]}
            title={t("BUTTON_SEE_ALL")}
            href={deepLinks.discover}
            tabIndex={-1}
          >
            <div className={styles["label"]}>{t("BUTTON_SEE_ALL")}</div>
            <Icon className={styles["icon"]} name="chevron-forward" />
          </Button>
        ) : null}
      </div>
      <div className={styles["meta-items-container"]}>
        {Array(CATALOG_PREVIEW_SIZE)
          .fill(null)
          .map((_, index) => (
            <div key={index} className={styles["meta-item"]}>
              <div className={styles["poster-container"]} />
              <div className={styles["title-bar-container"]}>
                <div className={styles["title-label"]} />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default MetaRowPlaceholder
