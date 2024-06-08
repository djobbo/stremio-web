// Copyright (C) 2017-2023 Smart code 203358507

import { useContext } from "react"
import TooltipContext from "./TooltipContext"

const useTooltip = () => {
  return useContext(TooltipContext)
}

export default useTooltip
