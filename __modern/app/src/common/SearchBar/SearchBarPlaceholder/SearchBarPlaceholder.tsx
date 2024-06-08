// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import { default as Icon } from "@stremio/stremio-icons/react"
import * as styles from "./styles.less"

const SearchBarPlaceholder = ({ className, title }) => {
  return (
    <div className={classnames(className, styles["search-bar-container"])}>
      <div className={styles["search-input"]}>{title}</div>
      <Icon className={styles["icon"]} name={"search"} />
    </div>
  )
}

SearchBarPlaceholder.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
}

export default SearchBarPlaceholder
