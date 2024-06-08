// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import Button from "stremio/common/Button"
import * as styles from "./styles.module.less"
import { forwardRef } from "react"

const Checkbox = forwardRef(
  ({ className, checked, children, ...props }, ref) => {
    return (
      <Button
        {...props}
        ref={ref}
        className={classnames(className, styles["checkbox-container"], {
          checked: checked,
        })}
      >
        <div className={styles["toggle"]} />
        {children}
      </Button>
    )
  },
)

Checkbox.displayName = "Checkbox"

Checkbox.propTypes = {
  className: PropTypes.string,
  checked: PropTypes.bool,
  children: PropTypes.node,
}

export default Checkbox
