// Copyright (C) 2017-2023 Smart code 203358507

import { useCallback, useMemo } from "react"
import useModelState from "stremio/common/useModelState"
import { useServices } from "stremio/services"

const useLocalSearch = () => {
  const { core } = useServices()

  const action = useMemo(
    () => ({
      action: "Load",
      args: {
        model: "LocalSearch",
      },
    }),
    [],
  )

  const { items } = useModelState({ model: "local_search", action })

  const search = useCallback((query) => {
    core.transport.dispatch({
      action: "Search",
      args: {
        action: "Search",
        args: {
          searchQuery: query,
          maxResults: 5,
        },
      },
    })
  }, [])

  return {
    items,
    search,
  }
}

export default useLocalSearch
