import type { ReactNode } from "react"
import { useState } from "react"

import TooltipContext from "./TooltipContext"
import TooltipItem from "./TooltipItem"

type TooltipProviderProps = {
  children?: ReactNode
  className?: string
}

const TooltipProvider = ({ children, className }: TooltipProviderProps) => {
  const [tooltips, setTooltips] = useState([])

  const add = (options) => {
    const tooltip = {
      ...options,
      active: false,
    }

    setTooltips((tooltips) => [...tooltips, tooltip])
  }

  const remove = (id) => {
    setTooltips((tooltips) => tooltips.filter((tooltip) => tooltip.id !== id))
  }

  const update = (id, state) => {
    setTooltips((tooltips) =>
      tooltips.map((tooltip) => {
        if (tooltip.id === id) {
          tooltip = {
            ...tooltip,
            ...state,
          }
        }

        return tooltip
      }),
    )
  }

  return (
    <TooltipContext.Provider value={{ add, remove, update }}>
      {children}
      <div className="tooltips-items-container">
        {tooltips.map(({ id, ...tooltip }) => (
          <TooltipItem key={id} className={className} {...tooltip} />
        ))}
      </div>
    </TooltipContext.Provider>
  )
}

export default TooltipProvider
