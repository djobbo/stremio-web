import { default as Icon } from "@stremio/stremio-icons/react"
import classnames from "classnames"
import { useCallback } from "react"
import { Button } from "stremio/common"

import styles from "./styles.module.less"

type OptionProps = {
  icon?: string
  label?: string
  deviceId?: string
  disabled?: boolean
  onClick?: (...args: unknown[]) => unknown
}

const Option = ({ icon, label, deviceId, disabled, onClick }: OptionProps) => {
  const onButtonClick = useCallback(() => {
    if (typeof onClick === "function") {
      onClick(deviceId)
    }
  }, [onClick, deviceId])

  return (
    <Button
      className={classnames(styles["option-container"], { disabled: disabled })}
      disabled={disabled}
      onClick={onButtonClick}
    >
      <Icon className={styles["icon"]} name={icon} />
      <div className={styles["label"]}>{label}</div>
    </Button>
  )
}

export default Option
