import classnames from "classnames"
import PlayIconCircleCentered from "stremio/common/PlayIconCircleCentered"
import styles from "./styles.module.less"

type StreamPlaceholderProps = {
  className?: string
}

const StreamPlaceholder = ({ className }: StreamPlaceholderProps) => {
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

export default StreamPlaceholder
