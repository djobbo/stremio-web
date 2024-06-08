// Copyright (C) 2017-2023 Smart code 203358507

import { useServices } from "stremio/services"
import { useProfile } from "stremio/common"
import { useCallback } from "react"

const useSettings = () => {
  const { core } = useServices()
  const profile = useProfile()
  const updateSettings = useCallback(
    (settings) => {
      core.transport.dispatch({
        action: "Ctx",
        args: {
          action: "UpdateSettings",
          args: {
            ...profile.settings,
            ...settings,
          },
        },
      })
    },
    [profile],
  )
  return [profile.settings, updateSettings]
}

export default useSettings
