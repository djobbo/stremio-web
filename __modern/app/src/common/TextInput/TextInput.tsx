import classnames from "classnames"
import { forwardRef, useCallback } from "react"

import styles from "./styles.module.less"

type TextInputProps = {
  className?: string
  disabled?: boolean
  onKeyDown?: (...args: unknown[]) => unknown
  onSubmit?: (...args: unknown[]) => unknown
}

const TextInput = forwardRef<HTMLElement, TextInputProps>((props, ref) => {
  const onKeyDown = useCallback(
    (event) => {
      if (typeof props.onKeyDown === "function") {
        props.onKeyDown(event)
      }

      if (
        event.key === "Enter" &&
        !event.nativeEvent.submitPrevented &&
        typeof props.onSubmit === "function"
      ) {
        props.onSubmit(event)
      }
    },
    [props.onKeyDown, props.onSubmit],
  )

  return (
    <input
      size={1}
      autoCorrect="off"
      autoCapitalize="off"
      autoComplete="off"
      spellCheck={false}
      tabIndex={0}
      {...props}
      ref={ref}
      className={classnames(props.className, styles["text-input"], {
        disabled: props.disabled,
      })}
      onKeyDown={onKeyDown}
    />
  )
})

TextInput.displayName = "TextInput"

export default TextInput
