// Copyright (C) 2017-2023 Smart code 203358507

import { useContext } from "react"

import ServicesContext from "./ServicesContext"

const useServices = () => {
  return useContext(ServicesContext)
}

export default useServices
