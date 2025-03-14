// Copyright (C) 2017-2023 Smart code 203358507

import { useEffect } from "react"
import { useToast } from "stremio/common"
import { useServices } from "stremio/services"

const ServicesToaster = () => {
  const { core, dragAndDrop } = useServices()
  const toast = useToast()

  useEffect(() => {
    const onCoreEvent = ({ event, args }) => {
      switch (event) {
        case "Error": {
          if (
            args.source.event === "UserPulledFromAPI" &&
            args.source.args.uid === null
          ) {
            break
          }

          if (
            args.source.event === "LibrarySyncWithAPIPlanned" &&
            args.source.args.uid === null
          ) {
            break
          }

          if (
            args.error.type === "Other" &&
            args.error.code === 3 &&
            args.source.event === "AddonInstalled" &&
            args.source.args.transport_url.startsWith(
              "https://www.strem.io/trakt/addon",
            )
          ) {
            break
          }

          toast.show({
            type: "error",
            title: args.source.event,
            message: args.error.message,
            timeout: 4000,
            dataset: {
              type: "CoreEvent",
            },
          })
          break
        }

        case "TorrentParsed": {
          toast.show({
            type: "success",
            title: "Torrent file parsed",
            timeout: 4000,
          })
          break
        }

        case "MagnetParsed": {
          toast.show({
            type: "success",
            title: "Magnet link parsed",
            timeout: 4000,
          })
          break
        }

        case "PlayingOnDevice": {
          toast.show({
            type: "success",
            title: `Stream opened in ${args.device}`,
            timeout: 4000,
          })
          break
        }
      }
    }

    const onDragAndDropError = (error) => {
      toast.show({
        type: "error",
        title: error.message,
        message: error.file?.name,
        timeout: 4000,
      })
    }

    core.transport.on("CoreEvent", onCoreEvent)
    dragAndDrop.on("error", onDragAndDropError)

    return () => {
      core.transport.off("CoreEvent", onCoreEvent)
      dragAndDrop.off("error", onDragAndDropError)
    }
  }, [])

  return null
}

export default ServicesToaster
