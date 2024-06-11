// Copyright (C) 2017-2023 Smart code 203358507

import { useCallback, useMemo } from "react"
import { useModelState } from "stremio/common"
import { useServices } from "stremio/services"
import UrlUtils from "url"

const map = (discover) => ({
  ...discover,
  catalog:
    discover.catalog !== null && discover.catalog.content.type === "Ready"
      ? {
          ...discover.catalog,
          content: {
            ...discover.catalog.content,
            content: discover.catalog.content.content.map((metaItem) => ({
              ...metaItem,
              released: new Date(
                typeof metaItem.released === "string" ? metaItem.released : NaN,
              ),
            })),
          },
        }
      : discover.catalog,
})

const useDiscover = (urlParams, queryParams) => {
  const { core } = useServices()
  const loadNextPage = useCallback(() => {
    core.transport.dispatch(
      {
        action: "CatalogWithFilters",
        args: {
          action: "LoadNextPage",
        },
      },
      "discover",
    )
  }, [])
  const action = useMemo(() => {
    if (
      typeof urlParams.transportUrl === "string" &&
      typeof urlParams.type === "string" &&
      typeof urlParams.catalogId === "string"
    ) {
      const { hostname } = UrlUtils.parse(urlParams.transportUrl)

      if (typeof hostname === "string" && hostname.length > 0) {
        return {
          action: "Load",
          args: {
            model: "CatalogWithFilters",
            args: {
              request: {
                base: urlParams.transportUrl,
                path: {
                  resource: "catalog",
                  type: urlParams.type,
                  id: urlParams.catalogId,
                  extra: Array.from(queryParams.entries()),
                },
              },
            },
          },
        }
      }
    } else {
      return {
        action: "Load",
        args: {
          model: "CatalogWithFilters",
          args: null,
        },
      }
    }

    return {
      action: "Unload",
    }
  }, [urlParams, queryParams])
  const discover = useModelState({
    model: "discover",
    action,
    map,
    deps: ["ctx"],
  })

  return [discover, loadNextPage]
}

export default useDiscover
