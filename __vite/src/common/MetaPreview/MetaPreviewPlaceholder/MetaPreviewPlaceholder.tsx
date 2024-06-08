// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import * as styles from "./styles.less"

const MetaPreviewPlaceholder = ({ className }) => {
  return (
    <div
      className={classnames(
        className,
        styles["meta-preview-placeholder-container"],
      )}
    >
      <div className={styles["meta-info-container"]}>
        <div className={styles["logo-container"]} />
        <div className={styles["duration-release-info-container"]}>
          <div className={styles["duration-container"]} />
          <div className={styles["release-info-container"]} />
        </div>
        <div className={styles["genres-container"]}>
          <div className={styles["genres-header-container"]} />
          <div className={styles["genre-label-container"]} />
        </div>
        <div className={styles["genres-container"]}>
          <div className={styles["genres-header-container"]} />
          <div className={styles["genre-label-container"]} />
        </div>
        <div className={styles["genres-container"]}>
          <div className={styles["genres-header-container"]} />
          <div className={styles["genre-label-container"]} />
        </div>
      </div>
      <div className={styles["action-buttons-container"]} />
    </div>
  )
}

MetaPreviewPlaceholder.propTypes = {
  className: PropTypes.string,
}

export default MetaPreviewPlaceholder
