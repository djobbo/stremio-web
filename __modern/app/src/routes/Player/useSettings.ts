// Copyright (C) 2017-2023 Smart code 203358507

import { useCallback } from "react"
import { useProfile } from "stremio/common"
import { useServices } from "stremio/services"

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
