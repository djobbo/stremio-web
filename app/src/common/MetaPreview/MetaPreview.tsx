import { default as Icon } from "@stremio/stremio-icons/react"
import classnames from "classnames"
import { Fragment, useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import Button from "stremio/common/Button"
import {
  IMDB_LINK_CATEGORY,
  SHARE_LINK_CATEGORY,
  WRITERS_LINK_CATEGORY,
} from "stremio/common/CONSTANTS"
import Image from "stremio/common/Image"
import ModalDialog from "stremio/common/ModalDialog"
import routesRegexp from "stremio/common/routesRegexp"
import SharePrompt from "stremio/common/SharePrompt"
import useBinaryState from "stremio/common/useBinaryState"
import UrlUtils from "url"

import ActionButton from "./ActionButton"
import MetaLinks from "./MetaLinks"
import MetaPreviewPlaceholder from "./MetaPreviewPlaceholder"
import styles from "./styles.module.less"

const ALLOWED_LINK_REDIRECTS = [
  routesRegexp.search.regexp,
  routesRegexp.discover.regexp,
  routesRegexp.metadetails.regexp,
]

type MetaPreviewProps = {
  className?: string
  compact?: boolean
  name?: string
  logo?: string
  background?: string
  runtime?: string
  releaseInfo?: string
  released?: Date
  description?: string
  deepLinks?: {
    metaDetailsVideos?: string
    metaDetailsStreams?: string
    player?: string
  }
  links?: {
    category?: string
    name?: string
    url?: string
  }[]
  trailerStreams?: unknown[]
  inLibrary?: boolean
  toggleInLibrary?: (...args: unknown[]) => unknown
}

const MetaPreview = ({
  className,
  compact,
  name,
  logo,
  background,
  runtime,
  releaseInfo,
  released,
  description,
  deepLinks,
  links,
  trailerStreams,
  inLibrary,
  toggleInLibrary,
}: MetaPreviewProps) => {
  const { t } = useTranslation()
  const [shareModalOpen, openShareModal, closeShareModal] =
    useBinaryState(false)
  const linksGroups = useMemo(() => {
    return Array.isArray(links)
      ? links
          .filter(
            (link) =>
              link &&
              typeof link.category === "string" &&
              typeof link.url === "string",
          )
          .reduce((linksGroups, { category, name, url }) => {
            const { protocol, path, pathname, hostname } = UrlUtils.parse(url)

            if (category === IMDB_LINK_CATEGORY) {
              if (hostname === "imdb.com") {
                linksGroups.set(category, {
                  label: name,
                  href: `https://www.stremio.com/warning#${encodeURIComponent(url)}`,
                })
              }
            } else if (category === SHARE_LINK_CATEGORY) {
              linksGroups.set(category, {
                label: name,
                href: url,
              })
            } else {
              if (protocol === "stremio:") {
                if (
                  pathname !== null &&
                  ALLOWED_LINK_REDIRECTS.some((regexp) =>
                    pathname.match(regexp),
                  )
                ) {
                  if (!linksGroups.has(category)) {
                    linksGroups.set(category, [])
                  }
                  linksGroups.get(category).push({
                    label: name,
                    href: `#${path}`,
                  })
                }
              } else if (typeof hostname === "string" && hostname.length > 0) {
                if (!linksGroups.has(category)) {
                  linksGroups.set(category, [])
                }
                linksGroups.get(category).push({
                  label: name,
                  href: `https://www.stremio.com/warning#${encodeURIComponent(url)}`,
                })
              }
            }

            return linksGroups
          }, new Map())
      : new Map()
  }, [links])
  const showHref = useMemo(() => {
    return deepLinks
      ? typeof deepLinks.player === "string"
        ? deepLinks.player
        : typeof deepLinks.metaDetailsStreams === "string"
          ? deepLinks.metaDetailsStreams
          : typeof deepLinks.metaDetailsVideos === "string"
            ? deepLinks.metaDetailsVideos
            : null
      : null
  }, [deepLinks])
  const trailerHref = useMemo(() => {
    if (!Array.isArray(trailerStreams) || trailerStreams.length === 0) {
      return null
    }

    return trailerStreams[0].deepLinks.player
  }, [trailerStreams])
  const renderLogoFallback = useCallback(
    () => <div className={styles["logo-placeholder"]}>{name}</div>,
    [name],
  )

  return (
    <div
      className={classnames(className, styles["meta-preview-container"], {
        [styles["compact"]]: compact,
      })}
    >
      {typeof background === "string" && background.length > 0 ? (
        <div className={styles["background-image-layer"]}>
          <Image
            className={styles["background-image"]}
            src={background}
            alt={" "}
          />
        </div>
      ) : null}
      <div className={styles["meta-info-container"]}>
        {typeof logo === "string" && logo.length > 0 ? (
          <Image
            className={styles["logo"]}
            src={logo}
            alt={" "}
            title={name}
            renderFallback={renderLogoFallback}
          />
        ) : (
          renderLogoFallback()
        )}
        {(typeof releaseInfo === "string" && releaseInfo.length > 0) ||
        (released instanceof Date && !isNaN(released.getTime())) ||
        (typeof runtime === "string" && runtime.length > 0) ||
        linksGroups.has(IMDB_LINK_CATEGORY) ? (
          <div className={styles["runtime-release-info-container"]}>
            {typeof runtime === "string" && runtime.length > 0 ? (
              <div className={styles["runtime-label"]}>{runtime}</div>
            ) : null}
            {typeof releaseInfo === "string" && releaseInfo.length > 0 ? (
              <div className={styles["release-info-label"]}>{releaseInfo}</div>
            ) : released instanceof Date && !isNaN(released.getTime()) ? (
              <div className={styles["release-info-label"]}>
                {released.getFullYear()}
              </div>
            ) : null}
            {linksGroups.has(IMDB_LINK_CATEGORY) ? (
              <Button
                className={styles["imdb-button-container"]}
                title={linksGroups.get(IMDB_LINK_CATEGORY).label}
                href={linksGroups.get(IMDB_LINK_CATEGORY).href}
                target="_blank"
                {...(compact ? { tabIndex: -1 } : null)}
              >
                <div className={styles["label"]}>
                  {linksGroups.get(IMDB_LINK_CATEGORY).label}
                </div>
                <Icon className={styles["icon"]} name="imdb" />
              </Button>
            ) : null}
          </div>
        ) : null}
        {compact &&
        typeof description === "string" &&
        description.length > 0 ? (
          <div className={styles["description-container"]}>{description}</div>
        ) : null}
        {Array.from(linksGroups.keys())
          .filter((category) => {
            return (
              category !== IMDB_LINK_CATEGORY &&
              category !== SHARE_LINK_CATEGORY &&
              category !== WRITERS_LINK_CATEGORY
            )
          })
          .map((category, index) => (
            <MetaLinks
              key={index}
              className={styles["meta-links"]}
              label={category}
              links={linksGroups.get(category)}
            />
          ))}
        {!compact &&
        typeof description === "string" &&
        description.length > 0 ? (
          <div className={styles["description-container"]}>
            <div className={styles["label-container"]}>{t("SUMMARY")}</div>
            {description}
          </div>
        ) : null}
      </div>
      <div className={styles["action-buttons-container"]}>
        {typeof toggleInLibrary === "function" ? (
          <ActionButton
            className={styles["action-button"]}
            icon={inLibrary ? "remove-from-library" : "add-to-library"}
            label={inLibrary ? t("REMOVE_FROM_LIB") : t("ADD_TO_LIB")}
            tooltip={compact}
            tabIndex={compact ? -1 : 0}
            onClick={toggleInLibrary}
          />
        ) : null}
        {typeof trailerHref === "string" ? (
          <ActionButton
            className={styles["action-button"]}
            icon="trailer"
            label={t("TRAILER")}
            tabIndex={compact ? -1 : 0}
            href={trailerHref}
            tooltip={compact}
          />
        ) : null}
        {typeof showHref === "string" && compact ? (
          <ActionButton
            className={classnames(
              styles["action-button"],
              styles["show-button"],
            )}
            icon="play"
            label={t("SHOW")}
            tabIndex={compact ? -1 : 0}
            href={showHref}
          />
        ) : null}
        {linksGroups.has(SHARE_LINK_CATEGORY) && !compact ? (
          <Fragment>
            <ActionButton
              className={styles["action-button"]}
              icon="share"
              label={t("CTX_SHARE")}
              tooltip={true}
              tabIndex={compact ? -1 : 0}
              onClick={openShareModal}
            />
            {shareModalOpen ? (
              <ModalDialog
                title={t("CTX_SHARE")}
                onCloseRequest={closeShareModal}
              >
                <SharePrompt
                  className={styles["share-prompt"]}
                  url={linksGroups.get(SHARE_LINK_CATEGORY).href}
                />
              </ModalDialog>
            ) : null}
          </Fragment>
        ) : null}
      </div>
    </div>
  )
}

MetaPreview.Placeholder = MetaPreviewPlaceholder

export default MetaPreview
