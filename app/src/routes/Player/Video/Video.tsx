import classnames from "classnames"
import { forwardRef } from "react"

import styles from "./styles.module.less"

type VideoProps = {
  className?: string
  onClick?: (...args: unknown[]) => unknown
  onDoubleClick?: (...args: unknown[]) => unknown
}

const Video = forwardRef<HTMLElement, VideoProps>(
  ({ className, onClick, onDoubleClick }, ref) => {
    return (
      <div
        className={classnames(className, styles["video-container"])}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        <div ref={ref} className={styles["video"]} />
      </div>
    )
  },
)

Video.displayName = "Video"

export default Video
