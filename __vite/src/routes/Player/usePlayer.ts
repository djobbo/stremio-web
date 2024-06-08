// Copyright (C) 2017-2023 Smart code 203358507

import { useServices } from "stremio/services"
import { useModelState, useCoreSuspender } from "stremio/common"
import { useCallback, useMemo } from "react"

const map = (player) => ({
  ...player,
  metaItem:
    player.metaItem !== null && player.metaItem.type === "Ready"
      ? {
          ...player.metaItem,
          content: {
            ...player.metaItem.content,
            released: new Date(
              typeof player.metaItem.content.released === "string"
                ? player.metaItem.content.released
                : NaN,
            ),
            videos: player.metaItem.content.videos.map((video) => ({
              ...video,
              released: new Date(
                typeof video.released === "string" ? video.released : NaN,
              ),
            })),
          },
        }
      : player.metaItem,
})

const usePlayer = (urlParams) => {
  const { core } = useServices()
  const { decodeStream } = useCoreSuspender()
  const stream = decodeStream(urlParams.stream)
  const action = useMemo(() => {
    if (stream !== null) {
      return {
        action: "Load",
        args: {
          model: "Player",
          args: {
            stream,
            streamRequest:
              typeof urlParams.streamTransportUrl === "string" &&
              typeof urlParams.type === "string" &&
              typeof urlParams.videoId === "string"
                ? {
                    base: urlParams.streamTransportUrl,
                    path: {
                      resource: "stream",
                      type: urlParams.type,
                      id: urlParams.videoId,
                      extra: [],
                    },
                  }
                : null,
            metaRequest:
              typeof urlParams.metaTransportUrl === "string" &&
              typeof urlParams.type === "string" &&
              typeof urlParams.id === "string"
                ? {
                    base: urlParams.metaTransportUrl,
                    path: {
                      resource: "meta",
                      type: urlParams.type,
                      id: urlParams.id,
                      extra: [],
                    },
                  }
                : null,
            subtitlesPath:
              typeof urlParams.type === "string" &&
              typeof urlParams.videoId === "string"
                ? {
                    resource: "subtitles",
                    type: urlParams.type,
                    id: urlParams.videoId,
                    extra: [],
                  }
                : null,
          },
        },
      }
    } else {
      return {
        action: "Unload",
      }
    }
  }, [urlParams])
  const videoParamsChanged = useCallback((videoParams) => {
    core.transport.dispatch(
      {
        action: "Player",
        args: {
          action: "VideoParamsChanged",
          args: { videoParams },
        },
      },
      "player",
    )
  }, [])
  const timeChanged = useCallback((time, duration, device) => {
    core.transport.dispatch(
      {
        action: "Player",
        args: {
          action: "TimeChanged",
          args: { time, duration, device },
        },
      },
      "player",
    )
  }, [])
  const ended = useCallback(() => {
    core.transport.dispatch(
      {
        action: "Player",
        args: {
          action: "Ended",
        },
      },
      "player",
    )
  }, [])
  const pausedChanged = useCallback((paused) => {
    core.transport.dispatch(
      {
        action: "Player",
        args: {
          action: "PausedChanged",
          args: { paused },
        },
      },
      "player",
    )
  }, [])
  const nextVideo = useCallback(() => {
    core.transport.dispatch(
      {
        action: "Player",
        args: {
          action: "NextVideo",
        },
      },
      "player",
    )
  }, [])
  const player = useModelState({ model: "player", action, map })
  return [
    player,
    videoParamsChanged,
    timeChanged,
    pausedChanged,
    ended,
    nextVideo,
  ]
}

export default usePlayer
