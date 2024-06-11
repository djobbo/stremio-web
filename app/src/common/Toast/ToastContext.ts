// Copyright (C) 2017-2023 Smart code 203358507

import { createContext } from "react"

type IToastContext = {
  show: (toast) => void
  clear: () => void
}

const ToastContext = createContext<IToastContext>({
  show: () => {},
  clear: () => {},
})

ToastContext.displayName = "ToastContext"

export default ToastContext
