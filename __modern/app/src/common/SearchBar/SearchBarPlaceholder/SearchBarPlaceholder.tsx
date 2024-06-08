import classnames from "classnames"
import { default as Icon } from "@stremio/stremio-icons/react"
import styles from "./styles.module.less"

type SearchBarPlaceholderProps = {
  className?: string
  title?: string
}

const SearchBarPlaceholder = ({
  className,
  title,
}: SearchBarPlaceholderProps) => {
  return (
    <div className={classnames(className, styles["search-bar-container"])}>
      <div className={styles["search-input"]}>{title}</div>
      <Icon className={styles["icon"]} name="search" />
    </div>
  )
}

export default SearchBarPlaceholder
