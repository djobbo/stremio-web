// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import Video from "../../MetaDetails/VideosList/Video"
import * as styles from "./styles.module.less"
import { useCallback, useMemo } from "react"

const VideosMenu = ({ className, metaItem, seriesInfo }) => {
  const onMouseDown = useCallback((event) => {
    event.nativeEvent.videosMenuClosePrevented = true
  }, [])
  const videos = useMemo(() => {
    return seriesInfo &&
      typeof seriesInfo.season === "number" &&
      Array.isArray(metaItem.videos)
      ? metaItem.videos.filter(({ season }) => season === seriesInfo.season)
      : metaItem.videos
  }, [metaItem, seriesInfo])
  return (
    <div
      className={classnames(className, styles["videos-menu-container"])}
      onMouseDown={onMouseDown}
    >
      {videos.map((video, index) => (
        <Video
          key={index}
          id={video.id}
          title={video.title}
          thumbnail={video.thumbnail}
          episode={video.episode}
          released={video.released}
          upcoming={video.upcoming}
          watched={video.watched}
          progress={video.progress}
          deepLinks={video.deepLinks}
          scheduled={video.scheduled}
        />
      ))}
    </div>
  )
}

VideosMenu.propTypes = {
  className: PropTypes.string,
  metaItem: PropTypes.object,
  seriesInfo: PropTypes.shape({
    season: PropTypes.number,
    episode: PropTypes.number,
  }),
}

export default VideosMenu
