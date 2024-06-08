// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import { useServices } from "stremio/services"
import LibItem from "stremio/common/LibItem"
import { useCallback } from "react"

const ContinueWatchingItem = ({ _id, notifications, deepLinks, ...props }) => {
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

ContinueWatchingItem.propTypes = {
  _id: PropTypes.string,
  notifications: PropTypes.object,
  deepLinks: PropTypes.shape({
    metaDetailsVideos: PropTypes.string,
    metaDetailsStreams: PropTypes.string,
    player: PropTypes.string,
  }),
}

export default ContinueWatchingItem
