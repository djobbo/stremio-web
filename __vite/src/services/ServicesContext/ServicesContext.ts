// Copyright (C) 2017-2023 Smart code 203358507

import { createContext } from "react"

type IServicesContext = {
  core: any
  dragAndDrop: any
}

const ServicesContext = createContext<IServicesContext>({
  core: null,
  dragAndDrop: null,
})

ServicesContext.displayName = "ServicesContext"

export default ServicesContext
