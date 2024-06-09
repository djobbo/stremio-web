import classnames from "classnames"
import { forwardRef, useCallback } from "react"
import { Button, Checkbox } from "stremio/common"

import styles from "./styles.module.less"

type ConsentCheckboxProps = {
  className?: string
  checked?: boolean
  label?: string
  link?: string
  href?: string
  onToggle?: (...args: unknown[]) => unknown
  onClick?: (...args: unknown[]) => unknown
}

const ConsentCheckbox = forwardRef<HTMLElement, ConsentCheckboxProps>(
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

export default ConsentCheckbox
