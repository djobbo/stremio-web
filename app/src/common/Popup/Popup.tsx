import classnames from "classnames"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { default as FocusLock } from "react-focus-lock"
import { useRouteFocused } from "stremio-router"

import styles from "./styles.module.less"

const getAnchorElement = (element) => {
  if (element === document.documentElement) {
    return element
  }

  const style = window.getComputedStyle(element)

  if (
    style.overflowY.indexOf("auto") !== -1 ||
    style.overflowY.indexOf("scroll") !== -1
  ) {
    return element
  }

  return getAnchorElement(element.parentElement)
}

type PopupProps = {
  open?: boolean
  direction?: "top-left" | "bottom-left" | "top-right" | "bottom-right"
  renderLabel: (...args: unknown[]) => unknown
  renderMenu: (...args: unknown[]) => unknown
  dataset?: object
  onCloseRequest?: (...args: unknown[]) => unknown
}

const Popup = ({
  open,
  direction,
  renderLabel,
  renderMenu,
  dataset,
  onCloseRequest,
  ...props
}: PopupProps) => {
  const routeFocused = useRouteFocused()
  const labelRef = useRef(null)
  const menuRef = useRef(null)
  const [autoDirection, setAutoDirection] = useState(null)
  const menuOnMouseDown = useCallback((event) => {
    event.nativeEvent.closePopupPrevented = true
  }, [])

  useEffect(() => {
    const onCloseEvent = (event) => {
      if (!event.closePopupPrevented && typeof onCloseRequest === "function") {
        const closeEvent = {
          type: "close",
          nativeEvent: event,
          dataset: dataset,
        }

        switch (event.type) {
          case "keydown":
            if (event.code === "Escape") {
              onCloseRequest(closeEvent)
            }
            break
          case "mousedown":
            if (
              event.target !== document.documentElement &&
              !labelRef.current.contains(event.target)
            ) {
              onCloseRequest(closeEvent)
            }
            break
          case "pointerdown":
            if (
              event.target !== document.documentElement &&
              !labelRef.current.contains(event.target)
            ) {
              onCloseRequest(closeEvent)
            }
            break
        }
      }
    }

    if (routeFocused && open) {
      window.addEventListener("keydown", onCloseEvent)
      window.addEventListener("mousedown", onCloseEvent)
      window.addEventListener("pointerdown", onCloseEvent)
    }

    return () => {
      window.removeEventListener("keydown", onCloseEvent)
      window.removeEventListener("mousedown", onCloseEvent)
      window.removeEventListener("pointerdown", onCloseEvent)
    }
  }, [routeFocused, open, onCloseRequest, dataset])
  useLayoutEffect(() => {
    if (open) {
      const autoDirection = []
      const anchor = getAnchorElement(labelRef.current)
      const anchorRect = anchor.getBoundingClientRect()

      const labelRect = labelRef.current.getBoundingClientRect()
      const menuRect = menuRef.current.getBoundingClientRect()
      const labelPosition = {
        left: labelRect.left - anchorRect.left,
        top: labelRect.top - anchorRect.top,
        right:
          anchorRect.width +
          anchorRect.left -
          (labelRect.left + labelRect.width),
        bottom:
          anchorRect.height +
          anchorRect.top -
          (labelRect.top + labelRect.height),
      }

      if (menuRect.height <= labelPosition.bottom) {
        autoDirection.push("bottom")
      } else if (menuRect.height <= labelPosition.top) {
        autoDirection.push("top")
      } else if (labelPosition.bottom >= labelPosition.top) {
        autoDirection.push("bottom")
      } else {
        autoDirection.push("top")
      }

      if (menuRect.width <= labelPosition.right + labelRect.width) {
        autoDirection.push("right")
      } else if (menuRect.width <= labelPosition.left + labelRect.width) {
        autoDirection.push("left")
      } else if (labelPosition.right > labelPosition.left) {
        autoDirection.push("right")
      } else {
        autoDirection.push("left")
      }

      setAutoDirection(autoDirection.join("-"))
    } else {
      setAutoDirection(null)
    }
  }, [open])

  return renderLabel({
    ...props,
    ref: labelRef,
    className: classnames(styles["label-container"], props.className, {
      active: open,
    }),
    children: open ? (
      <FocusLock
        ref={menuRef}
        className={classnames(
          styles["menu-container"],
          { [styles[`menu-direction-${autoDirection}`]]: !direction },
          { [styles[`menu-direction-${direction}`]]: direction },
        )}
        autoFocus={false}
        lockProps={{ onMouseDown: menuOnMouseDown }}
      >
        {renderMenu()}
      </FocusLock>
    ) : null,
  })
}

export default Popup
