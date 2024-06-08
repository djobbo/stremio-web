// Copyright (C) 2017-2023 Smart code 203358507

import { useMemo, useCallback } from "react"

const useSeason = (urlParams, queryParams) => {
  const season = useMemo(() => {
    return queryParams.has("season") && !isNaN(queryParams.get("season"))
      ? parseInt(queryParams.get("season"), 10)
      : null
  }, [queryParams])
  const setSeason = useCallback(
    (season) => {
      const nextQueryParams = new URLSearchParams(queryParams)
      nextQueryParams.set("season", season)
      window.location.replace(`#${urlParams.path}?${nextQueryParams}`)
    },
    [urlParams, queryParams],
  )
  return [season, setSeason]
}

export default useSeason
