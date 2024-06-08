// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import PlayIconCircleCentered from "stremio/common/PlayIconCircleCentered"
import * as styles from "./styles.less"

const StreamPlaceholder = ({ className }) => {
  return (
    <div
      className={classnames(className, styles["stream-placeholder-container"])}
    >
      <div className={styles["addon-container"]}>
        <div className={styles["addon-name"]} />
      </div>
      <div className={styles["info-container"]}>
        <div className={styles["description-container"]} />
        <div className={styles["description-container"]} />
      </div>
      <PlayIconCircleCentered className={styles["play-icon"]} />
    </div>
  )
}

StreamPlaceholder.propTypes = {
  className: PropTypes.string,
}

export default StreamPlaceholder
