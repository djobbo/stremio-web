import classNames from "classnames"
import { memo, useCallback, useEffect, useRef, useState } from "react"

import styles from "./styles.module.less"

type TooltipItemProps = {
  className?: string
  active?: boolean
  label?: string
  position?: string
  margin?: number
  parent?: HTMLElement
}

const TooltipItem = memo(
  ({
    className,
    active,
    label,
    position,
    margin,
    parent,
  }: TooltipItemProps) => {
    const ref = useRef(null)

    const [style, setStyle] = useState(null)

    const onTransitionEnd = useCallback(() => {
      if (!active) {
        setStyle(null)
      }
    }, [active])

    useEffect(() => {
      if (!ref.current) return setStyle(null)

      const tooltipBounds = ref.current.getBoundingClientRect()
      const parentBounds = parent.getBoundingClientRect()

      switch (position) {
        case "top":
          return setStyle({
            top: `${parentBounds.top - tooltipBounds.height - margin}px`,
            left: `${parentBounds.left + parentBounds.width / 2 - tooltipBounds.width / 2}px`,
          })
        case "bottom":
          return setStyle({
            top: `${parentBounds.top + parentBounds.height + margin}px`,
            left: `${parentBounds.left + parentBounds.width / 2 - tooltipBounds.width / 2}px`,
          })
        case "left":
          return setStyle({
            top: `${parentBounds.top + parentBounds.height / 2 - tooltipBounds.height / 2}px`,
            left: `${parentBounds.left - tooltipBounds.width - margin}px`,
          })
        case "right":
          return setStyle({
            top: `${parentBounds.top + parentBounds.height / 2 - tooltipBounds.height / 2}px`,
            left: `${parentBounds.left + parentBounds.width + margin}px`,
          })
      }
    }, [active, position, margin, parent, label])

    return (
      <div
        ref={ref}
        className={classNames(className, styles["tooltip-item"], {
          active: active,
        })}
        style={style}
        onTransitionEnd={onTransitionEnd}
      >
        {label}
      </div>
    )
  },
)

TooltipItem.displayName = "TooltipItem"

export default TooltipItem
