import { default as Icon } from "@stremio/stremio-icons/react"
import classnames from "classnames"
import Button from "stremio/common/Button"
import { Tooltip } from "stremio/common/Tooltips"

import styles from "./styles.module.less"

type ActionButtonProps = {
  className?: string
  icon?: string
  label?: string
  tooltip?: boolean
}

const ActionButton = ({
  className,
  icon,
  label,
  tooltip,
  ...props
}: ActionButtonProps) => {
  return (
    <Button
      title={tooltip ? "" : label}
      {...props}
      className={classnames(className, styles["action-button-container"], {
        wide: typeof label === "string" && !tooltip,
      })}
    >
      {tooltip === true ? <Tooltip label={label} position="top" /> : null}
      {typeof icon === "string" && icon.length > 0 ? (
        <div className={styles["icon-container"]}>
          <Icon className={styles["icon"]} name={icon} />
        </div>
      ) : null}
      {!tooltip && typeof label === "string" && label.length > 0 ? (
        <div className={styles["label-container"]}>
          <div className={styles["label"]}>{label}</div>
        </div>
      ) : null}
    </Button>
  )
}

export default ActionButton
