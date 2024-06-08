// Copyright (C) 2017-2023 Smart code 203358507

import isEqual from "lodash.isequal"
import { useState, useEffect } from "react"
import { withCoreSuspender, useProfile, useToast } from "stremio/common"
import { useServices } from "stremio/services"

const SearchParamsHandler = () => {
  const { core } = useServices()
  const profile = useProfile()
  const toast = useToast()

  const [searchParams, setSearchParams] = useState({})

  const onLocationChange = () => {
    const { origin, hash, search } = window.location
    const { searchParams } = new URL(
      `${origin}${hash.replace("#", "")}${search}`,
    )

    setSearchParams((previousSearchParams) => {
      const currentSearchParams = Object.fromEntries(searchParams.entries())
      return isEqual(previousSearchParams, currentSearchParams)
        ? previousSearchParams
        : currentSearchParams
    })
  }

  useEffect(() => {
    const { streamingServerUrl } = searchParams

    if (streamingServerUrl) {
      core.transport.dispatch({
        action: "Ctx",
        args: {
          action: "UpdateSettings",
          args: {
            ...profile.settings,
            streamingServerUrl,
          },
        },
      })

      toast.show({
        type: "success",
        title: `Using streaming server at ${streamingServerUrl}`,
        timeout: 4000,
      })
    }
  }, [searchParams])

  useEffect(() => {
    onLocationChange()
    window.addEventListener("hashchange", onLocationChange)
    return () => window.removeEventListener("hashchange", onLocationChange)
  }, [])

  return null
}

export default withCoreSuspender(SearchParamsHandler)
