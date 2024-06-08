// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import { default as Icon } from "@stremio/stremio-icons/react"
import Button from "stremio/common/Button"
import * as styles from "./styles.module.less"
import { useCallback } from "react"

const PaginationInput = ({ className, label, dataset, onSelect, ...props }) => {
  const prevNextButtonOnClick = useCallback(
    (event) => {
      if (typeof onSelect === "function") {
        onSelect({
          type: "change-page",
          value: event.currentTarget.dataset.value,
          dataset: dataset,
          reactEvent: event,
          nativeEvent: event.nativeEvent,
        })
      }
    },
    [dataset, onSelect],
  )
  return (
    <div
      {...props}
      className={classnames(className, styles["pagination-input-container"])}
    >
      <Button
        className={styles["prev-button-container"]}
        title="Previous page"
        data-value="prev"
        onClick={prevNextButtonOnClick}
      >
        <Icon className={styles["icon"]} name="chevron-back" />
      </Button>
      <div className={styles["label-container"]} title={label}>
        <div className={styles["label"]}>{label}</div>
      </div>
      <Button
        className={styles["next-button-container"]}
        title="Next page"
        data-value="next"
        onClick={prevNextButtonOnClick}
      >
        <Icon className={styles["icon"]} name="chevron-forward" />
      </Button>
    </div>
  )
}

PaginationInput.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  dataset: PropTypes.object,
  onSelect: PropTypes.func,
}

export default PaginationInput
