import classnames from "classnames"
import AColorPicker from "a-color-picker"
import styles from "./styles.module.less"
import { useRef, useLayoutEffect } from "react"

const parseColor = (value) => {
  return AColorPicker.parseColor(value, "hexcss4")
}

type ColorPickerProps = {
  className?: string
  value?: string
  onInput?: (...args: unknown[]) => unknown
}

const ColorPicker = ({ className, value, onInput }: ColorPickerProps) => {
  const pickerRef = useRef(null)
  const pickerElementRef = useRef(null)
  useLayoutEffect(() => {
    pickerRef.current = AColorPicker.createPicker(pickerElementRef.current, {
      color: parseColor(value),
      showHSL: false,
      showHEX: false,
      showRGB: false,
      showAlpha: true,
    })
    const pickerClipboard = pickerElementRef.current.querySelector(
      ".a-color-picker-clipbaord",
    )
    if (pickerClipboard instanceof HTMLElement) {
      pickerClipboard.tabIndex = -1
    }
  }, [])
  useLayoutEffect(() => {
    if (typeof onInput === "function") {
      pickerRef.current.on("change", (picker, value) => {
        onInput({
          type: "input",
          value: parseColor(value),
        })
      })
    }
    return () => {
      pickerRef.current.off("change")
    }
  }, [onInput])
  useLayoutEffect(() => {
    const nextValue = parseColor(value)
    if (nextValue !== parseColor(pickerRef.current.color)) {
      pickerRef.current.color = nextValue
    }
  }, [value])
  return (
    <div
      ref={pickerElementRef}
      className={classnames(className, styles["color-picker-container"])}
    />
  )
}

export default ColorPicker
