import classnames from "classnames"
import { Image } from "stremio/common"

import styles from "./styles.module.less"

type BufferingLoaderProps = {
  className?: string
  logo?: string
}

const BufferingLoader = ({ className, logo }: BufferingLoaderProps) => {
  return (
    <div
      className={classnames(className, styles["buffering-loader-container"])}
    >
      <Image
        className={styles["buffering-loader"]}
        src={logo}
        alt={" "}
        fallbackSrc="/images/stremio_symbol.png"
      />
    </div>
  )
}

export default BufferingLoader
