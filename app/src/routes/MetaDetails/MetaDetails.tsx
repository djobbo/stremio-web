import classnames from "classnames"
import { Fragment, useCallback, useMemo } from "react"
import {
  DelayedRenderer,
  HorizontalNavBar,
  Image,
  MetaPreview,
  ModalDialog,
  VerticalNavBar,
  withCoreSuspender,
} from "stremio/common"
import { useServices } from "stremio/services"

import StreamsList from "./StreamsList"
import styles from "./styles.module.less"
import useMetaDetails from "./useMetaDetails"
import useMetaExtensionTabs from "./useMetaExtensionTabs"
import useSeason from "./useSeason"
import VideosList from "./VideosList"

type MetaDetailsProps = {
  urlParams?: {
    type?: string
    id?: string
    videoId?: string
  }
  queryParams?: URLSearchParams
}

const MetaDetails = ({ urlParams, queryParams }: MetaDetailsProps) => {
  const { core } = useServices()
  const metaDetails = useMetaDetails(urlParams)
  const [season, setSeason] = useSeason(urlParams, queryParams)
  const [tabs, metaExtension, clearMetaExtension] = useMetaExtensionTabs(
    metaDetails.metaExtensions,
  )
  const [metaPath, streamPath] = useMemo(() => {
    return metaDetails.selected !== null
      ? [metaDetails.selected.metaPath, metaDetails.selected.streamPath]
      : [null, null]
  }, [metaDetails.selected])
  const video = useMemo(() => {
    return streamPath !== null &&
      metaDetails.metaItem !== null &&
      metaDetails.metaItem.content.type === "Ready"
      ? metaDetails.metaItem.content.content.videos.reduce((result, video) => {
          if (video.id === streamPath.id) {
            return video
          }

          return result
        }, null)
      : null
  }, [metaDetails.metaItem, streamPath])
  const addToLibrary = useCallback(() => {
    if (
      metaDetails.metaItem === null ||
      metaDetails.metaItem.content.type !== "Ready"
    ) {
      return
    }

    core.transport.dispatch({
      action: "Ctx",
      args: {
        action: "AddToLibrary",
        args: metaDetails.metaItem.content.content,
      },
    })
  }, [metaDetails])
  const removeFromLibrary = useCallback(() => {
    if (
      metaDetails.metaItem === null ||
      metaDetails.metaItem.content.type !== "Ready"
    ) {
      return
    }

    core.transport.dispatch({
      action: "Ctx",
      args: {
        action: "RemoveFromLibrary",
        args: metaDetails.metaItem.content.content.id,
      },
    })
  }, [metaDetails])
  const toggleNotifications = useCallback(() => {
    if (metaDetails.libraryItem) {
      core.transport.dispatch({
        action: "Ctx",
        args: {
          action: "ToggleLibraryItemNotifications",
          args: [
            metaDetails.libraryItem._id,
            !metaDetails.libraryItem.state.noNotif,
          ],
        },
      })
    }
  }, [metaDetails.libraryItem])
  const seasonOnSelect = useCallback(
    (event) => {
      setSeason(event.value)
    },
    [setSeason],
  )
  const renderBackgroundImageFallback = useCallback(() => null, [])

  return (
    <div className={styles["metadetails-container"]}>
      <HorizontalNavBar
        className={styles["nav-bar"]}
        backButton={true}
        addonsButton={true}
        fullscreenButton={true}
        navMenu={true}
      />
      <div className={styles["metadetails-content"]}>
        {tabs.length > 0 ? (
          <VerticalNavBar
            className={styles["vertical-nav-bar"]}
            tabs={tabs}
            selected={metaExtension !== null ? metaExtension.url : null}
          />
        ) : null}
        {metaPath === null ? (
          <DelayedRenderer delay={500}>
            <div className={styles["meta-message-container"]}>
              <Image
                className={styles["image"]}
                src="/images/empty.png"
                alt={" "}
              />
              <div className={styles["message-label"]}>
                No meta was selected!
              </div>
            </div>
          </DelayedRenderer>
        ) : metaDetails.metaItem === null ? (
          <div className={styles["meta-message-container"]}>
            <Image
              className={styles["image"]}
              src="/images/empty.png"
              alt={" "}
            />
            <div className={styles["message-label"]}>
              No addons ware requested for this meta!
            </div>
          </div>
        ) : metaDetails.metaItem.content.type === "Err" ? (
          <div className={styles["meta-message-container"]}>
            <Image
              className={styles["image"]}
              src="/images/empty.png"
              alt={" "}
            />
            <div className={styles["message-label"]}>
              No metadata was found!
            </div>
          </div>
        ) : metaDetails.metaItem.content.type === "Loading" ? (
          <MetaPreview.Placeholder className={styles["meta-preview"]} />
        ) : (
          <Fragment>
            {typeof metaDetails.metaItem.content.content.background ===
              "string" &&
            metaDetails.metaItem.content.content.background.length > 0 ? (
              <div className={styles["background-image-layer"]}>
                <Image
                  className={styles["background-image"]}
                  src={metaDetails.metaItem.content.content.background}
                  renderFallback={renderBackgroundImageFallback}
                  alt={" "}
                />
              </div>
            ) : null}
            <MetaPreview
              className={classnames(
                styles["meta-preview"],
                "animation-fade-in",
              )}
              name={metaDetails.metaItem.content.content.name}
              logo={metaDetails.metaItem.content.content.logo}
              runtime={metaDetails.metaItem.content.content.runtime}
              releaseInfo={metaDetails.metaItem.content.content.releaseInfo}
              released={metaDetails.metaItem.content.content.released}
              description={
                video !== null &&
                typeof video.overview === "string" &&
                video.overview.length > 0
                  ? video.overview
                  : metaDetails.metaItem.content.content.description
              }
              links={metaDetails.metaItem.content.content.links}
              trailerStreams={
                metaDetails.metaItem.content.content.trailerStreams
              }
              inLibrary={metaDetails.metaItem.content.content.inLibrary}
              toggleInLibrary={
                metaDetails.metaItem.content.content.inLibrary
                  ? removeFromLibrary
                  : addToLibrary
              }
            />
          </Fragment>
        )}
        <div className={styles["spacing"]} />
        {streamPath !== null ? (
          <StreamsList
            className={styles["streams-list"]}
            streams={metaDetails.streams}
            video={video}
          />
        ) : metaPath !== null ? (
          <VideosList
            className={styles["videos-list"]}
            metaItem={metaDetails.metaItem}
            libraryItem={metaDetails.libraryItem}
            season={season}
            seasonOnSelect={seasonOnSelect}
            toggleNotifications={toggleNotifications}
          />
        ) : null}
      </div>
      {metaExtension !== null ? (
        <ModalDialog
          className={styles["meta-extension-modal-container"]}
          title={metaExtension.name}
          onCloseRequest={clearMetaExtension}
        >
          <iframe
            className={styles["meta-extension-modal-iframe"]}
            sandbox="allow-forms allow-scripts allow-same-origin"
            src={metaExtension.url}
          />
        </ModalDialog>
      ) : null}
    </div>
  )
}

const MetaDetailsFallback = () => (
  <div className={styles["metadetails-container"]}>
    <HorizontalNavBar
      className={styles["nav-bar"]}
      backButton={true}
      addonsButton={true}
      fullscreenButton={true}
      navMenu={true}
    />
  </div>
)

export default withCoreSuspender(MetaDetails, MetaDetailsFallback)
