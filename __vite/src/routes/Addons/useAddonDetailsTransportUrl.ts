// Copyright (C) 2017-2023 Smart code 203358507

import { useMemo, useCallback } from "react"

const useAddonDetailsTransportUrl = (urlParams, queryParams) => {
  const transportUrl = useMemo(() => {
    return queryParams.get("addon")
  }, [queryParams])
  const setTransportUrl = useCallback(
    (transportUrl) => {
      const nextQueryParams = new URLSearchParams(queryParams)
      if (typeof transportUrl === "string") {
        nextQueryParams.set("addon", transportUrl)
      } else {
        nextQueryParams.delete("addon")
      }

      window.location.replace(`#${urlParams.path}?${nextQueryParams}`)
    },
    [urlParams, queryParams],
  )
  return [transportUrl, setTransportUrl]
}

export default useAddonDetailsTransportUrl
