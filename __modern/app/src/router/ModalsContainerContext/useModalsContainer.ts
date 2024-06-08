// Copyright (C) 2017-2023 Smart code 203358507

import { useContext } from "react"
import ModalsContainerContext from "./ModalsContainerContext"

const useModalsContainer = () => {
  return useContext(ModalsContainerContext)
}

export default useModalsContainer
