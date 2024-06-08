import classnames from "classnames"
import styles from "./styles.module.less"

type VideoPlaceholderProps = {
  className?: string
}

const VideoPlaceholder = ({ className }: VideoPlaceholderProps) => {
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

export default VideoPlaceholder
