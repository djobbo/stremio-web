// Copyright (C) 2017-2023 Smart code 203358507

import classNames from "classnames"

import styles from "./styles.module.less"

type StatisticsMenuProps = {
  className?: string
  peers?: number
  speed?: number
  completed?: number
  infoHash?: string
}

const StatisticsMenu = ({
  className,
  peers,
  speed,
  completed,
  infoHash,
}: StatisticsMenuProps) => {
  return (
    <div className={classNames(className, styles["statistics-menu-container"])}>
      <div className={styles["title"]}>Statistics</div>
      <div className={styles["stats"]}>
        <div className={styles["stat"]}>
          <div className={styles["label"]}>Peers</div>
          <div className={styles["value"]}>{peers}</div>
        </div>
        <div className={styles["stat"]}>
          <div className={styles["label"]}>Speed</div>
          <div className={styles["value"]}>{speed} MB/s</div>
        </div>
        <div className={styles["stat"]}>
          <div className={styles["label"]}>Completed</div>
          <div className={styles["value"]}>{completed} %</div>
        </div>
      </div>
      <div className={styles["info-hash"]}>
        <div className={styles["label"]}>Info Hash</div>
        <div className={styles["value"]}>{infoHash}</div>
      </div>
    </div>
  )
}

export default StatisticsMenu
