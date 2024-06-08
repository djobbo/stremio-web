import { default as Icon } from "@stremio/stremio-icons/react"
import classnames from "classnames"
import type { ReactNode } from "react"
import { useCallback, useEffect, useRef } from "react"
import Button from "stremio/common/Button"
import { Modal, useModalsContainer, useRouteFocused } from "stremio-router"

import styles from "./styles.module.less"

type ModalDialogProps = {
  className?: string
  title?: string
  background?: string
  buttons?: {
    className?: string
    label?: string
    icon?: string
    props?: object
  }[]
  children?: ReactNode[] | ReactNode
  dataset?: object
  onCloseRequest?: (...args: unknown[]) => unknown
}

const ModalDialog = ({
  className,
  title,
  buttons,
  children,
  dataset,
  onCloseRequest,
  background,
  ...props
}: ModalDialogProps) => {
  const routeFocused = useRouteFocused()
  const modalsContainer = useModalsContainer()
  const modalContainerRef = useRef(null)
  const closeButtonOnClick = useCallback(
    (event) => {
      if (typeof onCloseRequest === "function") {
        onCloseRequest({
          type: "close",
          dataset: dataset,
          reactEvent: event,
          nativeEvent: event.nativeEvent,
        })
      }
    },
    [dataset, onCloseRequest],
  )
  const onModalContainerMouseDown = useCallback(
    (event) => {
      if (
        !event.nativeEvent.closeModalDialogPrevented &&
        typeof onCloseRequest === "function"
      ) {
        onCloseRequest({
          type: "close",
          dataset: dataset,
          reactEvent: event,
          nativeEvent: event.nativeEvent,
        })
      }
    },
    [dataset, onCloseRequest],
  )
  const onModalDialogContainerMouseDown = useCallback((event) => {
    event.nativeEvent.closeModalDialogPrevented = true
  }, [])
  useEffect(() => {
    const onKeyDown = (event) => {
      // its `-2` because focus lock render locking divs around its content
      if (
        event.code === "Escape" &&
        modalsContainer.childNodes[modalsContainer.childElementCount - 2] ===
          modalContainerRef.current
      ) {
        if (typeof onCloseRequest === "function") {
          onCloseRequest({
            type: "close",
            dataset: dataset,
            nativeEvent: event,
          })
        }
      }
    }
    if (routeFocused) {
      window.addEventListener("keydown", onKeyDown)
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [routeFocused, dataset, onCloseRequest])
  return (
    <Modal
      ref={modalContainerRef}
      {...props}
      className={classnames(className, styles["modal-container"])}
      onMouseDown={onModalContainerMouseDown}
    >
      <div
        className={styles["modal-dialog-container"]}
        onMouseDown={onModalDialogContainerMouseDown}
      >
        <div
          className={styles["modal-dialog-background"]}
          style={{ backgroundImage: `url('${background}')` }}
        />
        <Button
          className={styles["close-button-container"]}
          title="Close"
          onClick={closeButtonOnClick}
        >
          <Icon className={styles["icon"]} name="close" />
        </Button>
        <div className={styles["modal-dialog-content"]}>
          {typeof title === "string" && title.length > 0 ? (
            <div className={styles["title-container"]} title={title}>
              {title}
            </div>
          ) : null}
          <div className={styles["modal-dialog-content"]}>{children}</div>
          {Array.isArray(buttons) && buttons.length > 0 ? (
            <div className={styles["buttons-container"]}>
              {buttons.map(({ className, label, icon, props }, index) => (
                <Button
                  title={label}
                  {...props}
                  key={index}
                  className={classnames(className, styles["action-button"])}
                >
                  {typeof icon === "string" && icon.length > 0 ? (
                    <Icon className={styles["icon"]} name={icon} />
                  ) : null}
                  {typeof label === "string" && label.length > 0 ? (
                    <div className={styles["label"]}>{label}</div>
                  ) : null}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  )
}

export default ModalDialog
