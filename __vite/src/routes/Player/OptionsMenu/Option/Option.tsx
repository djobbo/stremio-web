// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import { default as Icon } from "@stremio/stremio-icons/react"
import { Button } from "stremio/common"
import * as styles from "./styles.less"
import { useCallback } from "react"

const Option = ({ icon, label, deviceId, disabled, onClick }) => {
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

Option.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string,
  deviceId: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
}

export default Option
