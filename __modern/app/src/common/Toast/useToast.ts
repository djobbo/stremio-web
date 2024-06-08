// Copyright (C) 2017-2023 Smart code 203358507

import { useContext } from "react"

import ToastContext from "./ToastContext"

const useToast = () => {
  return useContext(ToastContext)
}

export default useToast
