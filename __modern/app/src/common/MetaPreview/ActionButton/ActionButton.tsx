// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import { default as Icon } from "@stremio/stremio-icons/react"
import Button from "stremio/common/Button"
import styles from "./styles.module.less"
import { Tooltip } from "stremio/common/Tooltips"

const ActionButton = ({ className, icon, label, tooltip, ...props }) => {
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

ActionButton.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  label: PropTypes.string,
  tooltip: PropTypes.bool,
}

export default ActionButton
