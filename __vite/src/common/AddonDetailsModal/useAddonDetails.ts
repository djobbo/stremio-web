// Copyright (C) 2017-2023 Smart code 203358507

import { useMemo } from "react"
import useModelState from "stremio/common/useModelState"

const useAddonDetails = (transportUrl) => {
  const action = useMemo(() => {
    if (typeof transportUrl === "string") {
      return {
        action: "Load",
        args: {
          model: "AddonDetails",
          args: {
            transportUrl,
          },
        },
      }
    } else {
      return {
        action: "Unload",
      }
    }
  }, [transportUrl])
  return useModelState({ model: "addon_details", action })
}

export default useAddonDetails
