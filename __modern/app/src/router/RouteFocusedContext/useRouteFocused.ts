// Copyright (C) 2017-2023 Smart code 203358507

import { useContext } from "react"
import RouteFocusedContext from "./RouteFocusedContext"

const useRouteFocused = () => {
  return useContext(RouteFocusedContext)
}

export default useRouteFocused
