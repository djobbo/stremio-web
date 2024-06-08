// Copyright (C) 2017-2023 Smart code 203358507

import magnet from "magnet-uri"
import { useCallback, useEffect, useRef } from "react"
import useToast from "stremio/common/Toast/useToast"
import useStreamingServer from "stremio/common/useStreamingServer"
import { useServices } from "stremio/services"

const useTorrent = () => {
  const { core } = useServices()
  const streamingServer = useStreamingServer()
  const toast = useToast()
  const createTorrentTimeout = useRef(null)
  const createTorrentFromMagnet = useCallback((text) => {
    const parsed = magnet.decode(text)
    if (parsed && typeof parsed.infoHash === "string") {
      core.transport.dispatch({
        action: "StreamingServer",
        args: {
          action: "CreateTorrent",
          args: text,
        },
      })
      clearTimeout(createTorrentTimeout.current)
      createTorrentTimeout.current = setTimeout(() => {
        toast.show({
          type: "error",
          title: "It's taking a long time to get metadata from the torrent.",
          timeout: 10000,
        })
      }, 10000)
    }
  }, [])
  useEffect(() => {
    if (streamingServer.torrent !== null) {
      const [, { type }] = streamingServer.torrent
      if (type === "Ready") {
        clearTimeout(createTorrentTimeout.current)
      }
    }
  }, [streamingServer.torrent])
  useEffect(() => {
    return () => clearTimeout(createTorrentTimeout.current)
  }, [])
  return {
    createTorrentFromMagnet,
  }
}

export default useTorrent
