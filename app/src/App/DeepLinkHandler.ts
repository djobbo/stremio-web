// Copyright (C) 2017-2023 Smart code 203358507

import { useEffect } from "react"
import { useStreamingServer, withCoreSuspender } from "stremio/common"

const DeepLinkHandler = () => {
  const streamingServer = useStreamingServer()

  useEffect(() => {
    if (streamingServer.torrent !== null) {
      const [, { type, content }] = streamingServer.torrent

      if (type === "Ready") {
        const [, deepLinks] = content

        if (typeof deepLinks.metaDetailsVideos === "string") {
          window.location = deepLinks.metaDetailsVideos
        }
      }
    }
  }, [streamingServer.torrent])

  return null
}

export default withCoreSuspender(DeepLinkHandler)
