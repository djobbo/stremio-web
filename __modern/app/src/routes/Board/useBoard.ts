// Copyright (C) 2017-2023 Smart code 203358507

import { useCallback, useMemo } from "react"
import { useModelState } from "stremio/common"
import { useServices } from "stremio/services"

const useBoard = () => {
  const { core } = useServices()
  const action = useMemo(
    () => ({
      action: "Load",
      args: {
        model: "CatalogsWithExtra",
        args: { extra: [] },
      },
    }),
    [],
  )
  const loadRange = useCallback((range) => {
    core.transport.dispatch(
      {
        action: "CatalogsWithExtra",
        args: {
          action: "LoadRange",
          args: range,
        },
      },
      "board",
    )
  }, [])
  const board = useModelState({ model: "board", action })

  return [board, loadRange]
}

export default useBoard
