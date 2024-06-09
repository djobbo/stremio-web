// Copyright (C) 2017-2023 Smart code 203358507

import { useCallback, useEffect, useMemo } from "react"
import { useServices } from "stremio/services"

const useStatistics = (player, streamingServer) => {
  const { core } = useServices()

  const stream = useMemo(() => {
    return player.selected?.stream ? player.selected.stream : null
  }, [player.selected])

  const infoHash = useMemo(() => {
    return stream?.infoHash ? stream?.infoHash : null
  }, [stream])

  const statistics = useMemo(() => {
    return streamingServer.statistics?.type === "Ready"
      ? streamingServer.statistics.content
      : null
  }, [streamingServer.statistics])

  const peers = useMemo(() => {
    return statistics?.peers ? statistics.peers : 0
  }, [statistics])

  const speed = useMemo(() => {
    return statistics?.downloadSpeed
      ? parseFloat((statistics.downloadSpeed / 1000 / 1000).toFixed(2))
      : 0
  }, [statistics])

  const completed = useMemo(() => {
    return statistics?.streamProgress
      ? parseFloat((statistics.streamProgress * 100).toFixed(2))
      : 0
  }, [statistics])

  const getStatistics = useCallback(() => {
    if (stream) {
      const { infoHash, fileIdx } = stream

      if (typeof infoHash === "string" && typeof fileIdx === "number") {
        core.transport.dispatch({
          action: "StreamingServer",
          args: {
            action: "GetStatistics",
            args: {
              infoHash,
              fileIdx,
            },
          },
        })
      }
    }
  }, [stream])

  useEffect(() => {
    getStatistics()
    const interval = setInterval(getStatistics, 5000)

    return () => clearInterval(interval)
  }, [getStatistics])

  return {
    infoHash,
    peers,
    speed,
    completed,
  }
}

export default useStatistics
