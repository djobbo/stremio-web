import { default as Icon } from "@stremio/stremio-icons/react"
import classnames from "classnames"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Button, Image } from "stremio/common"

import styles from "./styles.module.less"

type AddonProps = {
  className?: string
  id?: string
  name?: string
  version?: string
  logo?: string
  description?: string
  types?: string[]
  behaviorHints?: {
    adult?: boolean
    configurable?: boolean
    configurationRequired?: boolean
    p2p?: boolean
  }
  installed?: boolean
  onToggle?: (...args: unknown[]) => unknown
  onConfigure?: (...args: unknown[]) => unknown
  onShare?: (...args: unknown[]) => unknown
  dataset?: object
}

const Addon = ({
  className,
  id,
  name,
  version,
  logo,
  description,
  types,
  behaviorHints,
  installed,
  onToggle,
  onConfigure,
  onShare,
  dataset,
}: AddonProps) => {
  const { t } = useTranslation()
  const toggleButtonOnClick = useCallback(
    (event) => {
      if (typeof onToggle === "function") {
        onToggle({
          type: "toggle",
          nativeEvent: event.nativeEvent,
          reactEvent: event,
          dataset: dataset,
        })
      }
    },
    [onToggle, dataset],
  )
  const configureButtonOnClick = useCallback(
    (event) => {
      if (typeof onConfigure === "function") {
        onConfigure({
          type: "configure",
          nativeEvent: event.nativeEvent,
          reactEvent: event,
          dataset: dataset,
        })
      }
    },
    [onConfigure, dataset],
  )
  const shareButtonOnClick = useCallback(
    (event) => {
      if (typeof onShare === "function") {
        onShare({
          type: "share",
          nativeEvent: event.nativeEvent,
          reactEvent: event,
          dataset: dataset,
        })
      }
    },
    [onShare, dataset],
  )
  const onKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" && typeof onToggle === "function") {
        onToggle({
          type: "toggle",
          nativeEvent: event.nativeEvent,
          reactEvent: event,
          dataset: dataset,
        })
      }
    },
    [onToggle, dataset],
  )
  const renderLogoFallback = useCallback(
    () => <Icon className={styles["icon"]} name="addons" />,
    [],
  )

  return (
    <Button
      className={classnames(className, styles["addon-container"])}
      onKeyDown={onKeyDown}
    >
      <div className={styles["logo-container"]}>
        <Image
          className={styles["logo"]}
          src={logo}
          alt={" "}
          renderFallback={renderLogoFallback}
        />
      </div>
      <div className={styles["info-container"]}>
        <div
          className={styles["name-container"]}
          title={typeof name === "string" && name.length > 0 ? name : id}
        >
          {typeof name === "string" && name.length > 0 ? name : id}
        </div>
        {typeof version === "string" && version.length > 0 ? (
          <div className={styles["version-container"]} title={`v.${version}`}>
            v.{version}
          </div>
        ) : null}
        {Array.isArray(types) && types.length > 0 ? (
          <div className={styles["types-container"]}>
            {types.length === 1
              ? types.join("")
              : types.slice(0, -1).join(", ") + " & " + types[types.length - 1]}
          </div>
        ) : null}
        {typeof description === "string" && description.length > 0 ? (
          <div className={styles["description-container"]} title={description}>
            {description}
          </div>
        ) : null}
      </div>
      <div className={styles["buttons-container"]}>
        <div className={styles["action-buttons-container"]}>
          {!behaviorHints.configurationRequired &&
          behaviorHints.configurable ? (
            <Button
              className={styles["configure-button-container"]}
              title={t("ADDON_CONFIGURE")}
              tabIndex={-1}
              onClick={configureButtonOnClick}
            >
              <Icon className={styles["icon"]} name="settings" />
            </Button>
          ) : null}
          <Button
            className={
              installed
                ? styles["uninstall-button-container"]
                : styles["install-button-container"]
            }
            title={
              installed
                ? t("ADDON_UNINSTALL")
                : behaviorHints.configurationRequired
                  ? t("ADDON_CONFIGURE")
                  : t("ADDON_INSTALL")
            }
            tabIndex={-1}
            onClick={
              !installed && behaviorHints.configurationRequired
                ? configureButtonOnClick
                : toggleButtonOnClick
            }
          >
            <div className={styles["label"]}>
              {installed
                ? t("ADDON_UNINSTALL")
                : behaviorHints.configurationRequired
                  ? t("ADDON_CONFIGURE")
                  : t("ADDON_INSTALL")}
            </div>
          </Button>
        </div>
        <Button
          className={styles["share-button-container"]}
          title={t("SHARE_ADDON")}
          tabIndex={-1}
          onClick={shareButtonOnClick}
        >
          <Icon className={styles["icon"]} name="share" />
          <div className={styles["label"]}>{t("SHARE_ADDON")}</div>
        </Button>
      </div>
    </Button>
  )
}

export default Addon
