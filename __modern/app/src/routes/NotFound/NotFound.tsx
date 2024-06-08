// Copyright (C) 2017-2023 Smart code 203358507

import { HorizontalNavBar, Image } from "stremio/common"

import styles from "./styles.module.less"

const NotFound = () => {
  return (
    <div className={styles["not-found-container"]}>
      <HorizontalNavBar
        className={styles["nav-bar"]}
        title="Page not found"
        backButton={true}
        fullscreenButton={true}
        navMenu={true}
      />
      <div className={styles["not-found-content"]}>
        <Image
          className={styles["not-found-image"]}
          src="/images/empty.png"
          alt={" "}
        />
        <div className={styles["not-found-label"]}>Page not found!</div>
      </div>
    </div>
  )
}

export default NotFound
