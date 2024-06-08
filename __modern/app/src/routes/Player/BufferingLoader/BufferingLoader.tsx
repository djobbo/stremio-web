// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import { Image } from "stremio/common"
import * as styles from "./styles.less"

const BufferingLoader = ({ className, logo }) => {
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

BufferingLoader.propTypes = {
  className: PropTypes.string,
  logo: PropTypes.string,
}

export default BufferingLoader
