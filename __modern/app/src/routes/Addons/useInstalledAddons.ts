// Copyright (C) 2017-2023 Smart code 203358507

import { useMemo } from "react"
import { useModelState } from "stremio/common"

const useInstalledAddons = (urlParams) => {
  const action = useMemo(() => {
    if (
      typeof urlParams.transportUrl !== "string" &&
      typeof urlParams.catalogId !== "string"
    ) {
      return {
        action: "Load",
        args: {
          model: "InstalledAddonsWithFilters",
          args: {
            request: {
              type: typeof urlParams.type === "string" ? urlParams.type : null,
            },
          },
        },
      }
    } else {
      return {
        action: "Unload",
      }
    }
  }, [urlParams])
  return useModelState({ model: "installed_addons", action })
}

export default useInstalledAddons
