// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import { Button } from "stremio/common"
import * as styles from "./styles.module.less"
import { useCallback } from "react"

const OptionButton = ({ className, value, selected, onSelect }) => {
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

OptionButton.propTypes = {
  className: PropTypes.string,
  value: PropTypes.number,
  selected: PropTypes.bool,
  onSelect: PropTypes.func,
}

export default OptionButton
