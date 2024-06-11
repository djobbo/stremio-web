// Copyright (C) 2017-2023 Smart code 203358507

import { t } from "i18next"
import { useCallback, useMemo } from "react"
import MetaItem from "stremio/common/MetaItem"
import { useServices } from "stremio/services"

type LibItemProps = {
  _id?: string
  removable?: boolean
  progress?: number
  notifications?: object
  watched?: boolean
  deepLinks?: {
    metaDetailsVideos?: string
    metaDetailsStreams?: string
    player?: string
  }
  optionOnSelect?: (...args: unknown[]) => unknown
}

const LibItem = ({
  _id,
  removable,
  notifications,
  watched,
  ...props
}: LibItemProps) => {
  const { core } = useServices()

  const newVideos = useMemo(() => {
    const count = notifications.items?.[_id]?.length ?? 0

    return Math.min(Math.max(count, 0), 99)
  }, [_id, notifications])

  const options = useMemo(() => {
    return [
      { label: "LIBRARY_PLAY", value: "play" },
      { label: "LIBRARY_DETAILS", value: "details" },
      { label: "LIBRARY_RESUME_DISMISS", value: "dismiss" },
      {
        label: watched ? "CTX_MARK_UNWATCHED" : "CTX_MARK_WATCHED",
        value: "watched",
      },
      { label: "LIBRARY_REMOVE", value: "remove" },
    ]
      .filter(({ value }) => {
        switch (value) {
          case "play":
            return props.deepLinks && typeof props.deepLinks.player === "string"
          case "details":
            return (
              props.deepLinks &&
              (typeof props.deepLinks.metaDetailsVideos === "string" ||
                typeof props.deepLinks.metaDetailsStreams === "string")
            )
          case "watched":
            return (
              props.deepLinks &&
              (typeof props.deepLinks.metaDetailsVideos === "string" ||
                typeof props.deepLinks.metaDetailsStreams === "string")
            )
          case "dismiss":
            return (
              typeof _id === "string" &&
              props.progress !== null &&
              !isNaN(props.progress) &&
              props.progress > 0
            )
          case "remove":
            return typeof _id === "string" && removable
        }
      })
      .map((option) => ({
        ...option,
        label: t(option.label),
      }))
  }, [_id, removable, props.progress, props.deepLinks, watched])

  const optionOnSelect = useCallback(
    (event) => {
      if (typeof props.optionOnSelect === "function") {
        props.optionOnSelect(event)
      }

      if (!event.nativeEvent.optionSelectPrevented) {
        switch (event.value) {
          case "play": {
            if (props.deepLinks && typeof props.deepLinks.player === "string") {
              window.location = props.deepLinks.player
            }

            break
          }

          case "details": {
            if (props.deepLinks) {
              if (typeof props.deepLinks.metaDetailsVideos === "string") {
                window.location = props.deepLinks.metaDetailsVideos
              } else if (
                typeof props.deepLinks.metaDetailsStreams === "string"
              ) {
                window.location = props.deepLinks.metaDetailsStreams
              }
            }

            break
          }

          case "watched": {
            if (typeof _id === "string") {
              core.transport.dispatch({
                action: "Ctx",
                args: {
                  action: "LibraryItemMarkAsWatched",
                  args: {
                    id: _id,
                    is_watched: !watched,
                  },
                },
              })
            }

            break
          }

          case "dismiss": {
            if (typeof _id === "string") {
              core.transport.dispatch({
                action: "Ctx",
                args: {
                  action: "RewindLibraryItem",
                  args: _id,
                },
              })
              core.transport.dispatch({
                action: "Ctx",
                args: {
                  action: "DismissNotificationItem",
                  args: _id,
                },
              })
            }

            break
          }

          case "remove": {
            if (typeof _id === "string") {
              core.transport.dispatch({
                action: "Ctx",
                args: {
                  action: "RemoveFromLibrary",
                  args: _id,
                },
              })
            }

            break
          }
        }
      }
    },
    [_id, props.deepLinks, props.optionOnSelect],
  )

  return (
    <MetaItem
      {...props}
      watched={watched}
      newVideos={newVideos}
      options={options}
      optionOnSelect={optionOnSelect}
    />
  )
}

export default LibItem
