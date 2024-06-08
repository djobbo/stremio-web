// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import * as styles from "./styles.module.less"

const VideoPlaceholder = ({ className }) => {
  return (
    <div
      className={classnames(className, styles["video-placeholder-container"])}
    >
      <div className={styles["info-container"]}>
        <div className={styles["name-container"]} />
        <div className={styles["released-container"]} />
      </div>
    </div>
  )
}

VideoPlaceholder.propTypes = {
  className: PropTypes.string,
}

export default VideoPlaceholder
