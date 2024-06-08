// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import TooltipContext from "./TooltipContext"
import TooltipItem from "./TooltipItem"
import { useState } from "react"

const TooltipProvider = ({ children, className }) => {
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
      <div className={"tooltips-items-container"}>
        {tooltips.map(({ id, ...tooltip }) => (
          <TooltipItem key={id} className={className} {...tooltip} />
        ))}
      </div>
    </TooltipContext.Provider>
  )
}

TooltipProvider.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
}

export default TooltipProvider
