import { useEffect, useLayoutEffect, useRef } from "react"

import useTooltip from "../useTooltip"
import styles from "./styles.module.less"

const createId = () => (Math.random() + 1).toString(36).substring(7)

type TooltipProps = {
  label: string
  position: string
  margin?: number
}

const Tooltip = ({ label, position, margin = 15 }: TooltipProps) => {
  const tooltip = useTooltip()

  const id = useRef(createId())
  const element = useRef(null)

  const onMouseEnter = () => {
    tooltip.update(id.current, {
      active: true,
    })
  }

  const onMouseLeave = () => {
    tooltip.update(id.current, {
      active: false,
    })
  }

  useEffect(() => {
    tooltip.update(id.current, {
      label,
    })
  }, [label])

  useLayoutEffect(() => {
    if (element.current && element.current.parentElement) {
      const parentElement = element.current.parentElement
      tooltip.add({
        id: id.current,
        label,
        position,
        margin,
        parent: parentElement,
      })

      parentElement.addEventListener("mouseenter", onMouseEnter)
      parentElement.addEventListener("mouseleave", onMouseLeave)
    }

    return () => {
      if (element.current && element.current.parentElement) {
        const parentElement = element.current.parentElement
        parentElement.removeEventListener("mouseenter", onMouseEnter)
        parentElement.removeEventListener("mouseleave", onMouseLeave)

        tooltip.remove(id.current)
      }
    }
  }, [])

  return <div ref={element} className={styles["tooltip-placeholder"]} />
}

export default Tooltip
