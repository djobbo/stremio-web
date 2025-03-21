import classnames from "classnames"
import { t } from "i18next"
import { Fragment, useCallback, useMemo, useState } from "react"
import { Checkbox, Image, SearchBar } from "stremio/common"

import SeasonsBar from "./SeasonsBar"
import styles from "./styles.module.less"
import Video from "./Video"

type VideosListProps = {
  className?: string
  metaItem?: object
  libraryItem?: object
  season?: number
  seasonOnSelect?: (...args: unknown[]) => unknown
  toggleNotifications?: (...args: unknown[]) => unknown
}

const VideosList = ({
  className,
  metaItem,
  libraryItem,
  season,
  seasonOnSelect,
  toggleNotifications,
}: VideosListProps) => {
  const showNotificationsToggle = useMemo(() => {
    return (
      metaItem?.content?.content?.inLibrary &&
      metaItem?.content?.content?.videos?.length
    )
  }, [metaItem])
  const videos = useMemo(() => {
    return metaItem && metaItem.content.type === "Ready"
      ? metaItem.content.content.videos
      : []
  }, [metaItem])
  const seasons = useMemo(() => {
    return videos
      .map(({ season }) => season)
      .filter((season, index, seasons) => {
        return (
          season !== null &&
          !isNaN(season) &&
          typeof season === "number" &&
          seasons.indexOf(season) === index
        )
      })
      .sort(
        (a, b) =>
          (a || Number.MAX_SAFE_INTEGER) - (b || Number.MAX_SAFE_INTEGER),
      )
  }, [videos])
  const selectedSeason = useMemo(() => {
    if (seasons.includes(season)) {
      return season
    }

    const nonSpecialSeasons = seasons.filter((season) => season !== 0)

    if (nonSpecialSeasons.length > 0) {
      return nonSpecialSeasons[nonSpecialSeasons.length - 1]
    }

    if (seasons.length > 0) {
      return seasons[seasons.length - 1]
    }

    return null
  }, [seasons, season])
  const videosForSeason = useMemo(() => {
    return videos
      .filter((video) => {
        return selectedSeason === null || video.season === selectedSeason
      })
      .sort((a, b) => {
        return a.episode - b.episode
      })
  }, [videos, selectedSeason])
  const [search, setSearch] = useState("")
  const searchInputOnChange = useCallback((event) => {
    setSearch(event.currentTarget.value)
  }, [])

  return (
    <div className={classnames(className, styles["videos-list-container"])}>
      {!metaItem || metaItem.content.type === "Loading" ? (
        <Fragment>
          <SeasonsBar.Placeholder className={styles["seasons-bar"]} />
          <SearchBar.Placeholder
            className={styles["search-bar"]}
            title={t("SEARCH_VIDEOS")}
          />
          <div className={styles["videos-scroll-container"]}>
            <Video.Placeholder />
            <Video.Placeholder />
            <Video.Placeholder />
            <Video.Placeholder />
            <Video.Placeholder />
          </div>
        </Fragment>
      ) : metaItem.content.type === "Err" || videosForSeason.length === 0 ? (
        <div className={styles["message-container"]}>
          <Image
            className={styles["image"]}
            src="/images/empty.png"
            alt={" "}
          />
          <div className={styles["label"]}>No videos found for this meta!</div>
        </div>
      ) : (
        <Fragment>
          {showNotificationsToggle && libraryItem ? (
            <Checkbox
              className={styles["notifications-checkbox"]}
              checked={!libraryItem.state.noNotif}
              onClick={toggleNotifications}
            >
              {t("DETAIL_RECEIVE_NOTIF_SERIES")}
            </Checkbox>
          ) : null}
          {seasons.length > 0 ? (
            <SeasonsBar
              className={styles["seasons-bar"]}
              season={selectedSeason}
              seasons={seasons}
              onSelect={seasonOnSelect}
            />
          ) : null}
          <SearchBar
            className={styles["search-bar"]}
            title={t("SEARCH_VIDEOS")}
            value={search}
            onChange={searchInputOnChange}
          />
          <div className={styles["videos-container"]}>
            {videosForSeason
              .filter((video) => {
                return (
                  search.length === 0 ||
                  (typeof video.title === "string" &&
                    video.title.toLowerCase().includes(search.toLowerCase())) ||
                  (!isNaN(video.released.getTime()) &&
                    video.released
                      .toLocaleString(undefined, {
                        year: "2-digit",
                        month: "short",
                        day: "numeric",
                      })
                      .toLowerCase()
                      .includes(search.toLowerCase()))
                )
              })
              .map((video, index) => (
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
        </Fragment>
      )}
    </div>
  )
}

export default VideosList
