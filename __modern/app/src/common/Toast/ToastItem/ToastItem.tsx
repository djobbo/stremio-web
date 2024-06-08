// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import { default as Icon } from "@stremio/stremio-icons/react"
import Button from "stremio/common/Button"
import * as styles from "./styles.less"
import { useMemo, useCallback } from "react"

const ToastItem = ({
  title,
  message,
  dataset,
  onSelect,
  onClose,
  ...props
}) => {
  const type = useMemo(() => {
    return ["success", "alert", "info", "error"].includes(props.type)
      ? props.type
      : "success"
  }, [props.type])
  const icon = useMemo(() => {
    return typeof props.icon === "string"
      ? props.icon
      : type === "success"
        ? "checkmark"
        : type === "error"
          ? "close"
          : type === "info"
            ? "about"
            : null
  }, [type, props.icon])
  const toastOnClick = useCallback(
    (event) => {
      if (
        !event.nativeEvent.selectToastPrevented &&
        typeof onSelect === "function"
      ) {
        onSelect({
          type: "select",
          dataset: dataset,
          reactEvent: event,
          nativeEvent: event.nativeEvent,
        })
      }
      if (
        !event.nativeEvent.closeToastPrevented &&
        typeof onClose === "function"
      ) {
        onClose({
          type: "close",
          dataset: dataset,
          reactEvent: event,
          nativeEvent: event.nativeEvent,
        })
      }
    },
    [dataset, onSelect, onClose],
  )
  const closeButtonOnClick = useCallback(
    (event) => {
      event.nativeEvent.selectToastPrevented = true
      if (typeof onClose === "function") {
        onClose({
          type: "close",
          dataset: dataset,
          reactEvent: event,
          nativeEvent: event.nativeEvent,
        })
      }
    },
    [dataset, onClose],
  )
  return (
    <Button
      className={classnames(styles["toast-item-container"], styles[type])}
      tabIndex={-1}
      onClick={toastOnClick}
    >
      {typeof icon === "string" && icon.length > 0 ? (
        <div className={styles["icon-container"]}>
          <Icon className={styles["icon"]} name={icon} />
        </div>
      ) : null}
      <div className={styles["info-container"]}>
        {typeof title === "string" && title.length > 0 ? (
          <div className={styles["title-container"]}>{title}</div>
        ) : null}
        {typeof message === "string" && message.length > 0 ? (
          <div className={styles["message-container"]}>{message}</div>
        ) : null}
      </div>
      <Button
        className={styles["close-button-container"]}
        title={"Close"}
        tabIndex={-1}
        onClick={closeButtonOnClick}
      >
        <Icon className={styles["icon"]} name={"close"} />
      </Button>
    </Button>
  )
}

ToastItem.propTypes = {
  type: PropTypes.oneOf(["success", "alert", "info", "error"]),
  title: PropTypes.string,
  message: PropTypes.string,
  icon: PropTypes.string,
  dataset: PropTypes.object,
  onSelect: PropTypes.func,
  onClose: PropTypes.func,
}

export default ToastItem
