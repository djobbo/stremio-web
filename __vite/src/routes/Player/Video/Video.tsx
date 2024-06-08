// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import * as styles from "./styles.less"
import { forwardRef } from "react"

const Video = forwardRef(({ className, onClick, onDoubleClick }, ref) => {
  return (
    <div
      className={classnames(className, styles["video-container"])}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div ref={ref} className={styles["video"]} />
    </div>
  )
})

Video.displayName = "Video"

Video.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
}

export default Video
