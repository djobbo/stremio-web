// Copyright (C) 2017-2023 Smart code 203358507

import { useCallback, useMemo } from "react"
import { useModelState } from "stremio/common"
import { useServices } from "stremio/services"

const useLibrary = (model, urlParams, queryParams) => {
  const { core } = useServices()
  const loadNextPage = useCallback(() => {
    core.transport.dispatch(
      {
        action: "LibraryWithFilters",
        args: {
          action: "LoadNextPage",
        },
      },
      "library",
    )
  }, [])
  const action = useMemo(
    () => ({
      action: "Load",
      args: {
        model: "LibraryWithFilters",
        args: {
          request: {
            type: typeof urlParams.type === "string" ? urlParams.type : null,
            sort: queryParams.has("sort") ? queryParams.get("sort") : undefined,
          },
        },
      },
    }),
    [urlParams, queryParams],
  )
  const library = useModelState({ model, action })

  return [library, loadNextPage]
}

export default useLibrary
