import classnames from "classnames"
import { useCallback } from "react"
import { Button } from "stremio/common"

import styles from "./styles.module.less"

type OptionButtonProps = {
  className?: string
  value?: number
  selected?: boolean
  onSelect?: (...args: unknown[]) => unknown
}

const OptionButton = ({
  className,
  value,
  selected,
  onSelect,
}: OptionButtonProps) => {
  const onClick = useCallback(() => {
    if (typeof onSelect === "function") {
      onSelect(value)
    }
  }, [onSelect, value])

  return (
    <Button
      className={classnames(className, styles["option"], {
        selected: selected,
      })}
      onClick={onClick}
    >
      <div className={styles["label"]}>{value}x</div>
      <div className={styles["icon"]} />
    </Button>
  )
}

export default OptionButton
