// Copyright (C) 2017-2023 Smart code 203358507

import { useCallback } from "react"
import useModelState from "stremio/common/useModelState"
import { useServices } from "stremio/services"

const useSearchHistory = () => {
  const { core } = useServices()
  const { searchHistory: items } = useModelState({ model: "ctx" })

  const clear = useCallback(() => {
    core.transport.dispatch({
      action: "Ctx",
      args: {
        action: "ClearSearchHistory",
      },
    })
  }, [])

  return {
    items,
    clear,
  }
}

export default useSearchHistory
