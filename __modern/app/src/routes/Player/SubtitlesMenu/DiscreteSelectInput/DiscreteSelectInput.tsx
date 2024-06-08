import { default as Icon } from "@stremio/stremio-icons/react"
import classnames from "classnames"
import { useCallback } from "react"
import { Button } from "stremio/common"

import styles from "./styles.module.less"

type DiscreteSelectInputProps = {
  className?: string
  value?: string
  label?: string
  disabled?: boolean
  dataset?: object
  onChange?: (...args: unknown[]) => unknown
}

const DiscreteSelectInput = ({
  className,
  value,
  label,
  disabled,
  dataset,
  onChange,
}: DiscreteSelectInputProps) => {
  const buttonOnClick = useCallback(
    (event) => {
      if (typeof onChange === "function") {
        onChange({
          type: "change",
          value: event.currentTarget.dataset.type,
          dataset: dataset,
          reactEvent: event,
          nativeEvent: event.nativeEvent,
        })
      }
    },
    [dataset, onChange],
  )
  return (
    <div
      className={classnames(className, styles["discrete-input-container"], {
        disabled: disabled,
      })}
    >
      <div className={styles["header"]}>{label}</div>
      <div
        className={styles["input-container"]}
        title={disabled ? `${label} is not configurable` : null}
      >
        <Button
          className={classnames(styles["button-container"], {
            disabled: disabled,
          })}
          data-type="decrement"
          onClick={buttonOnClick}
        >
          <Icon className={styles["icon"]} name="remove" />
        </Button>
        <div className={styles["option-label"]} title={value}>
          {value}
        </div>
        <Button
          className={classnames(styles["button-container"], {
            disabled: disabled,
          })}
          data-type="increment"
          onClick={buttonOnClick}
        >
          <Icon className={styles["icon"]} name="add" />
        </Button>
      </div>
    </div>
  )
}

export default DiscreteSelectInput
