// Copyright (C) 2017-2023 Smart code 203358507

import classnames from "classnames"
import * as styles from "./styles.less"
import { useLongPress } from "use-long-press"
import {
  AnchorHTMLAttributes,
  createElement,
  forwardRef,
  useCallback,
} from "react"

type ButtonProps = {
  disabled?: boolean
  onLongPress?: (event: React.MouseEvent<HTMLDivElement>) => void
} & AnchorHTMLAttributes<HTMLAnchorElement>

const Button = forwardRef(function Button(
  { className, href, disabled, children, onLongPress, ...props }: ButtonProps,
  ref,
) {
  const longPress = useLongPress(onLongPress, { detect: "pointer" })
  const onKeyDown = useCallback(
    (event) => {
      if (typeof props.onKeyDown === "function") {
        props.onKeyDown(event)
      }

      if (event.key === "Enter") {
        event.preventDefault()
        if (!event.nativeEvent.buttonClickPrevented) {
          event.currentTarget.click()
        }
      }
    },
    [props.onKeyDown],
  )
  const onMouseDown = useCallback(
    (event) => {
      if (typeof props.onMouseDown === "function") {
        props.onMouseDown(event)
      }

      if (!event.nativeEvent.buttonBlurPrevented) {
        event.preventDefault()
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur()
        }
      }
    },
    [props.onMouseDown],
  )
  return createElement(
    typeof href === "string" && href.length > 0 ? "a" : "div",
    {
      tabIndex: 0,
      ...props,
      ref,
      className: classnames(className, styles["button-container"], {
        disabled: disabled,
      }),
      href,
      onKeyDown,
      onMouseDown,
      ...longPress(),
    },
    children,
  )
})

export default Button
