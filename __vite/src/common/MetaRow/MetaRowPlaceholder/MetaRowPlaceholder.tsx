// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import { useTranslation } from "react-i18next"
import { default as Icon } from "@stremio/stremio-icons/react"
import Button from "stremio/common/Button"
import * as styles from "./styles.less"
import { CATALOG_PREVIEW_SIZE } from "stremio/common/CONSTANTS"

const MetaRowPlaceholder = ({ className, title, deepLinks }) => {
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
            <Icon className={styles["icon"]} name={"chevron-forward"} />
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

MetaRowPlaceholder.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  deepLinks: PropTypes.shape({
    discover: PropTypes.string,
  }),
}

export default MetaRowPlaceholder
