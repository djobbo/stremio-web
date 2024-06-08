import classnames from "classnames"
import { default as Icon } from "@stremio/stremio-icons/react"
import TextInput from "stremio/common/TextInput"
import SearchBarPlaceholder from "./SearchBarPlaceholder"
import styles from "./styles.module.less"

type SearchBarProps = {
  className?: string
  title?: string
  value?: string
  onChange?: (...args: unknown[]) => unknown
}

const SearchBar = ({ className, title, value, onChange }: SearchBarProps) => {
  return (
    <label
      title={title}
      className={classnames(className, styles["search-bar-container"])}
    >
      <TextInput
        className={styles["search-input"]}
        type="text"
        placeholder={title}
        value={value}
        onChange={onChange}
      />
      <Icon className={styles["icon"]} name="search" />
    </label>
  )
}

SearchBar.Placeholder = SearchBarPlaceholder

export default SearchBar
