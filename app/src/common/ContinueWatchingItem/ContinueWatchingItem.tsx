import { useCallback } from "react"
import LibItem from "stremio/common/LibItem"
import { useServices } from "stremio/services"

type ContinueWatchingItemProps = {
  _id?: string
  notifications?: object
  deepLinks?: {
    metaDetailsVideos?: string
    metaDetailsStreams?: string
    player?: string
  }
}

const ContinueWatchingItem = ({
  _id,
  notifications,
  deepLinks,
  ...props
}: ContinueWatchingItemProps) => {
  const { core } = useServices()

  const onClick = useCallback(() => {
    if (deepLinks?.metaDetailsVideos ?? deepLinks?.metaDetailsStreams) {
      window.location =
        deepLinks?.metaDetailsVideos ?? deepLinks?.metaDetailsStreams
    }
  }, [deepLinks])

  const onPlayClick = useCallback(
    (event) => {
      event.stopPropagation()
      if (
        deepLinks?.player ??
        deepLinks?.metaDetailsStreams ??
        deepLinks?.metaDetailsVideos
      ) {
        window.location =
          deepLinks?.player ??
          deepLinks?.metaDetailsStreams ??
          deepLinks?.metaDetailsVideos
      }
    },
    [deepLinks],
  )

  const onDismissClick = useCallback(
    (event) => {
      event.stopPropagation()
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
    },
    [_id],
  )

  return (
    <LibItem
      {...props}
      _id={_id}
      posterChangeCursor={true}
      notifications={notifications}
      onClick={onClick}
      onPlayClick={onPlayClick}
      onDismissClick={onDismissClick}
    />
  )
}

export default ContinueWatchingItem
