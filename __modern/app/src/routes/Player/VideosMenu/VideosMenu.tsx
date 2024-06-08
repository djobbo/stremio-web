import classnames from "classnames"
import Video from "../../MetaDetails/VideosList/Video"
import styles from "./styles.module.less"
import { useCallback, useMemo } from "react"

type VideosMenuProps = {
  className?: string
  metaItem?: object
  seriesInfo?: {
    season?: number
    episode?: number
  }
}

const VideosMenu = ({ className, metaItem, seriesInfo }: VideosMenuProps) => {
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

export default VideosMenu
