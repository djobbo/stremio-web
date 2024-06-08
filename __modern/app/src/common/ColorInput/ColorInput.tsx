// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import AColorPicker from "a-color-picker"
import { useTranslation } from "react-i18next"
import Button from "stremio/common/Button"
import ModalDialog from "stremio/common/ModalDialog"
import useBinaryState from "stremio/common/useBinaryState"
import ColorPicker from "./ColorPicker"
import * as styles from "./styles.module.less"
import { useState, useMemo, useCallback, useLayoutEffect } from "react"

const parseColor = (value) => {
  const color = AColorPicker.parseColor(value, "hexcss4")
  return typeof color === "string" ? color : "#ffffffff"
}

const ColorInput = ({ className, value, dataset, onChange, ...props }) => {
  const { t } = useTranslation()
  const [modalOpen, openModal, closeModal] = useBinaryState(false)
  const [tempValue, setTempValue] = useState(() => {
    return parseColor(value)
  })
  const labelButtonStyle = useMemo(
    () => ({
      backgroundColor: value,
    }),
    [value],
  )
  const isTransparent = useMemo(() => {
    return parseColor(value).endsWith("00")
  }, [value])
  const labelButtonOnClick = useCallback(
    (event) => {
      if (typeof props.onClick === "function") {
        props.onClick(event)
      }

      if (!event.nativeEvent.openModalPrevented) {
        openModal()
      }
    },
    [props.onClick],
  )
  const modalDialogOnClick = useCallback((event) => {
    event.nativeEvent.openModalPrevented = true
  }, [])
  const modalButtons = useMemo(() => {
    const selectButtonOnClick = (event) => {
      if (typeof onChange === "function") {
        onChange({
          type: "change",
          value: tempValue,
          dataset: dataset,
          reactEvent: event,
          nativeEvent: event.nativeEvent,
        })
      }

      closeModal()
    }
    return [
      {
        label: "Select",
        props: {
          "data-autofocus": true,
          onClick: selectButtonOnClick,
        },
      },
    ]
  }, [tempValue, dataset, onChange])
  const colorPickerOnInput = useCallback((event) => {
    setTempValue(parseColor(event.value))
  }, [])
  useLayoutEffect(() => {
    setTempValue(parseColor(value))
  }, [value, modalOpen])
  return (
    <Button
      title={isTransparent ? t("BUTTON_COLOR_TRANSPARENT") : value}
      {...props}
      style={labelButtonStyle}
      className={classnames(className, styles["color-input-container"])}
      onClick={labelButtonOnClick}
    >
      {isTransparent ? (
        <div className={styles["transparent-label-container"]}>
          <div className={styles["transparent-label"]}>
            {t("BUTTON_COLOR_TRANSPARENT")}
          </div>
        </div>
      ) : null}
      {modalOpen ? (
        <ModalDialog
          title="Choose a color:"
          buttons={modalButtons}
          onCloseRequest={closeModal}
          onClick={modalDialogOnClick}
        >
          <ColorPicker
            className={styles["color-picker-container"]}
            value={tempValue}
            onInput={colorPickerOnInput}
          />
        </ModalDialog>
      ) : null}
    </Button>
  )
}

ColorInput.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  dataset: PropTypes.object,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
}

export default ColorInput
