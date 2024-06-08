// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import { default as Icon } from "@stremio/stremio-icons/react"
import TextInput from "stremio/common/TextInput"
import SearchBarPlaceholder from "./SearchBarPlaceholder"
import * as styles from "./styles.less"

const SearchBar = ({ className, title, value, onChange }) => {
  return (
    <label
      title={title}
      className={classnames(className, styles["search-bar-container"])}
    >
      <TextInput
        className={styles["search-input"]}
        type={"text"}
        placeholder={title}
        value={value}
        onChange={onChange}
      />
      <Icon className={styles["icon"]} name={"search"} />
    </label>
  )
}

SearchBar.Placeholder = SearchBarPlaceholder

SearchBar.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
}

export default SearchBar
