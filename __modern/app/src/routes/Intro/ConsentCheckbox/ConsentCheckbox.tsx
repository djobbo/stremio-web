// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import { Button, Checkbox } from "stremio/common"
import * as styles from "./styles.less"
import { forwardRef } from "react"
import { useCallback } from "react"

const ConsentCheckbox = forwardRef(
  ({ className, label, link, href, onToggle, ...props }, ref) => {
    const checkboxOnClick = useCallback(
      (event) => {
        if (typeof props.onClick === "function") {
          props.onClick(event)
        }

        if (
          !event.nativeEvent.togglePrevented &&
          typeof onToggle === "function"
        ) {
          onToggle({
            type: "toggle",
            reactEvent: event,
            nativeEvent: event.nativeEvent,
          })
        }
      },
      [onToggle, props.onClick],
    )
    const linkOnClick = useCallback((event) => {
      event.nativeEvent.togglePrevented = true
    }, [])
    return (
      <Checkbox
        {...props}
        ref={ref}
        className={classnames(className, styles["consent-checkbox-container"])}
        onClick={checkboxOnClick}
      >
        <div className={styles["label"]}>
          {label}{" "}
          {typeof link === "string" &&
          link.length > 0 &&
          typeof href === "string" &&
          href.length > 0 ? (
            <Button
              className={styles["link"]}
              href={href}
              target="_blank"
              tabIndex={-1}
              onClick={linkOnClick}
            >
              {link}
            </Button>
          ) : null}
        </div>
      </Checkbox>
    )
  },
)

ConsentCheckbox.displayName = "ConsentCheckbox"

ConsentCheckbox.propTypes = {
  className: PropTypes.string,
  checked: PropTypes.bool,
  label: PropTypes.string,
  link: PropTypes.string,
  href: PropTypes.string,
  onToggle: PropTypes.func,
  onClick: PropTypes.func,
}

export default ConsentCheckbox
