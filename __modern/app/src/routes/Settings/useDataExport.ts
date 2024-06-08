// Copyright (C) 2017-2023 Smart code 203358507

import { useServices } from "stremio/services"
import { useModelState } from "stremio/common"
import { useCallback } from "react"

const map = (dataExport) => ({
  ...dataExport,
  exportUrl:
    dataExport !== null &&
    dataExport.exportUrl !== null &&
    dataExport.exportUrl.type === "Ready"
      ? dataExport.exportUrl.content
      : null,
})

const useDataExport = () => {
  const { core } = useServices()
  const loadDataExport = useCallback(() => {
    core.transport.dispatch(
      {
        action: "Load",
        args: {
          model: "DataExport",
        },
      },
      "data_export",
    )
  }, [])
  const dataExport = useModelState({ model: "data_export", map })
  return [dataExport, loadDataExport]
}

export default useDataExport
