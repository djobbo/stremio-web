import { default as Icon } from "@stremio/stremio-icons/react"
import classnames from "classnames"
import { Fragment, useCallback, useLayoutEffect, useMemo, useRef } from "react"
import Button from "stremio/common/Button"
import ModalDialog from "stremio/common/ModalDialog"
import Popup from "stremio/common/Popup"
import useBinaryState from "stremio/common/useBinaryState"

import styles from "./styles.module.less"

type MultiselectProps = {
  className?: string
  mode?: "popup" | "modal"
  direction?: any
  title?: string
  options?: {
    value?: string
    title?: string
    label?: string
  }[]
  selected?: string[]
  disabled?: boolean
  dataset?: object
  renderLabelContent?: (...args: unknown[]) => unknown
  renderLabelText?: (...args: unknown[]) => unknown
  onOpen?: (...args: unknown[]) => unknown
  onClose?: (...args: unknown[]) => unknown
  onSelect?: (...args: unknown[]) => unknown
  onClick?: (...args: unknown[]) => unknown
}

const Multiselect = ({
  className,
  mode,
  direction,
  title,
  disabled,
  dataset,
  renderLabelContent,
  renderLabelText,
  onOpen,
  onClose,
  onSelect,
  ...props
}: MultiselectProps) => {
  const [menuOpen, , closeMenu, toggleMenu] = useBinaryState(false)
  const options = useMemo(() => {
    return Array.isArray(props.options)
      ? props.options.filter((option) => {
          return (
            option &&
            (typeof option.value === "string" || option.value === null)
          )
        })
      : []
  }, [props.options])
  const selected = useMemo(() => {
    return Array.isArray(props.selected)
      ? props.selected.filter((value) => {
          return typeof value === "string" || value === null
        })
      : []
  }, [props.selected])
  const labelOnClick = useCallback(
    (event) => {
      if (typeof props.onClick === "function") {
        props.onClick(event)
      }

      if (!event.nativeEvent.toggleMenuPrevented) {
        toggleMenu()
      }
    },
    [props.onClick, toggleMenu],
  )
  const menuOnClick = useCallback((event) => {
    event.nativeEvent.toggleMenuPrevented = true
  }, [])
  const menuOnKeyDown = useCallback((event) => {
    event.nativeEvent.buttonClickPrevented = true
  }, [])
  const optionOnClick = useCallback(
    (event) => {
      if (typeof onSelect === "function") {
        onSelect({
          type: "select",
          value: event.currentTarget.dataset.value,
          reactEvent: event,
          nativeEvent: event.nativeEvent,
          dataset: dataset,
        })
      }

      if (!event.nativeEvent.closeMenuPrevented) {
        closeMenu()
      }
    },
    [dataset, onSelect],
  )
  const mountedRef = useRef(false)

  useLayoutEffect(() => {
    if (mountedRef.current) {
      if (menuOpen) {
        if (typeof onOpen === "function") {
          onOpen({
            type: "open",
            dataset: dataset,
          })
        }
      } else {
        if (typeof onClose === "function") {
          onClose({
            type: "close",
            dataset: dataset,
          })
        }
      }
    }

    mountedRef.current = true
  }, [menuOpen])
  const renderLabel = useCallback(
    ({ children, className, ...props }) => (
      <Button
        {...props}
        className={classnames(className, styles["label-container"], {
          active: menuOpen,
        })}
        title={title}
        disabled={disabled}
        onClick={labelOnClick}
      >
        {typeof renderLabelContent === "function" ? (
          renderLabelContent()
        ) : (
          <Fragment>
            <div className={styles["label"]}>
              {typeof renderLabelText === "function"
                ? renderLabelText()
                : selected.length > 0
                  ? selected
                      .map((value) => {
                        const option = options.find(
                          (option) => option.value === value,
                        )

                        return option && typeof option.label === "string"
                          ? option.label
                          : value
                      })
                      .join(", ")
                  : title}
            </div>
            <Icon className={styles["icon"]} name="caret-down" />
          </Fragment>
        )}
        {children}
      </Button>
    ),
    [
      menuOpen,
      title,
      disabled,
      options,
      selected,
      labelOnClick,
      renderLabelContent,
      renderLabelText,
    ],
  )
  const renderMenu = useCallback(
    () => (
      <div
        className={styles["menu-container"]}
        onKeyDown={menuOnKeyDown}
        onClick={menuOnClick}
      >
        {options.length > 0 ? (
          options.map(({ label, title, value }) => (
            <Button
              key={value}
              className={classnames(styles["option-container"], {
                selected: selected.includes(value),
              })}
              title={
                typeof title === "string"
                  ? title
                  : typeof label === "string"
                    ? label
                    : value
              }
              data-value={value}
              onClick={optionOnClick}
            >
              <div className={styles["label"]}>
                {typeof label === "string" ? label : value}
              </div>
              <div className={styles["icon"]} />
            </Button>
          ))
        ) : (
          <div className={styles["no-options-container"]}>
            <div className={styles["label"]}>No options available</div>
          </div>
        )}
      </div>
    ),
    [options, selected, menuOnKeyDown, menuOnClick, optionOnClick],
  )
  const renderPopupLabel = useMemo(
    () => (labelProps) => {
      return renderLabel({
        ...labelProps,
        ...props,
        className: classnames(className, labelProps.className),
      })
    },
    [props, className, renderLabel],
  )

  return mode === "modal" ? (
    renderLabel({
      ...props,
      className,
      children: menuOpen ? (
        <ModalDialog
          className={styles["modal-container"]}
          title={title}
          onCloseRequest={closeMenu}
          onKeyDown={menuOnKeyDown}
          onClick={menuOnClick}
        >
          {renderMenu()}
        </ModalDialog>
      ) : null,
    })
  ) : (
    <Popup
      open={menuOpen}
      direction={direction}
      onCloseRequest={closeMenu}
      renderLabel={renderPopupLabel}
      renderMenu={renderMenu}
    />
  )
}

export default Multiselect
