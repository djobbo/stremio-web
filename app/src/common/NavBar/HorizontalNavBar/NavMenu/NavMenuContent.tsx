import { default as Icon } from "@stremio/stremio-icons/react"
import classnames from "classnames"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import Button from "stremio/common/Button"
import { withCoreSuspender } from "stremio/common/CoreSuspender"
import useFullscreen from "stremio/common/useFullscreen"
import useProfile from "stremio/common/useProfile"
import usePWA from "stremio/common/usePWA"
import useTorrent from "stremio/common/useTorrent"
import { useServices } from "stremio/services"

import styles from "./styles.module.less"

type NavMenuContentProps = {
  onClick?: (...args: unknown[]) => unknown
}

const NavMenuContent = ({ onClick }: NavMenuContentProps) => {
  const { t } = useTranslation()
  const { core } = useServices()
  const profile = useProfile()
  const { createTorrentFromMagnet } = useTorrent()
  const [fullscreen, requestFullscreen, exitFullscreen] = useFullscreen()
  const [isIOSPWA, isAndroidPWA] = usePWA()
  const logoutButtonOnClick = useCallback(() => {
    core.transport.dispatch({
      action: "Ctx",
      args: {
        action: "Logout",
      },
    })
  }, [])
  const onPlayMagnetLinkClick = useCallback(async () => {
    try {
      const clipboardText = await navigator.clipboard.readText()

      createTorrentFromMagnet(clipboardText)
    } catch (e) {
      console.error(e)
    }
  }, [])

  return (
    <div
      className={classnames(styles["nav-menu-container"], "animation-fade-in")}
      onClick={onClick}
    >
      <div className={styles["user-info-container"]}>
        <div
          className={styles["avatar-container"]}
          style={{
            backgroundImage:
              profile.auth === null
                ? `url('${"/images/anonymous.png"}')`
                : profile.auth.user.avatar
                  ? `url('${profile.auth.user.avatar}')`
                  : `url('${"/images/default_avatar.png"}')`,
          }}
        />
        <div className={styles["user-info-details"]}>
          <div className={styles["email-container"]}>
            <div className={styles["email-label"]}>
              {profile.auth === null
                ? t("ANONYMOUS_USER")
                : profile.auth.user.email}
            </div>
          </div>
          <Button
            className={styles["logout-button-container"]}
            title={
              profile.auth === null
                ? `${t("LOG_IN")} / ${t("SIGN_UP")}`
                : t("LOG_OUT")
            }
            href={profile.auth === null ? "#/intro" : null}
            onClick={profile.auth !== null ? logoutButtonOnClick : null}
          >
            <div className={styles["logout-label"]}>
              {profile.auth === null
                ? `${t("LOG_IN")} / ${t("SIGN_UP")}`
                : t("LOG_OUT")}
            </div>
          </Button>
        </div>
      </div>
      {!isIOSPWA && !isAndroidPWA ? (
        <div className={styles["nav-menu-section"]}>
          <Button
            className={styles["nav-menu-option-container"]}
            title={fullscreen ? t("EXIT_FULLSCREEN") : t("ENTER_FULLSCREEN")}
            onClick={fullscreen ? exitFullscreen : requestFullscreen}
          >
            <Icon
              className={styles["icon"]}
              name={fullscreen ? "minimize" : "maximize"}
            />
            <div className={styles["nav-menu-option-label"]}>
              {fullscreen ? t("EXIT_FULLSCREEN") : t("ENTER_FULLSCREEN")}
            </div>
          </Button>
        </div>
      ) : null}
      <div className={styles["nav-menu-section"]}>
        <Button
          className={styles["nav-menu-option-container"]}
          title={t("SETTINGS")}
          href="#/settings"
        >
          <Icon className={styles["icon"]} name="settings" />
          <div className={styles["nav-menu-option-label"]}>{t("SETTINGS")}</div>
        </Button>
        <Button
          className={styles["nav-menu-option-container"]}
          title={t("ADDONS")}
          href="#/addons"
        >
          <Icon className={styles["icon"]} name="addons-outline" />
          <div className={styles["nav-menu-option-label"]}>{t("ADDONS")}</div>
        </Button>
        <Button
          className={styles["nav-menu-option-container"]}
          title={t("PLAY_URL_MAGNET_LINK")}
          onClick={onPlayMagnetLinkClick}
        >
          <Icon className={styles["icon"]} name="magnet-link" />
          <div className={styles["nav-menu-option-label"]}>
            {t("PLAY_URL_MAGNET_LINK")}
          </div>
        </Button>
        <Button
          className={styles["nav-menu-option-container"]}
          title={t("HELP_FEEDBACK")}
          href="https://stremio.zendesk.com/"
          target="_blank"
        >
          <Icon className={styles["icon"]} name="help" />
          <div className={styles["nav-menu-option-label"]}>
            {t("HELP_FEEDBACK")}
          </div>
        </Button>
      </div>
      <div className={styles["nav-menu-section"]}>
        <Button
          className={styles["nav-menu-option-container"]}
          title={t("TERMS_OF_SERVICE")}
          href="https://www.stremio.com/tos"
          target="_blank"
        >
          <div className={styles["nav-menu-option-label"]}>
            {t("TERMS_OF_SERVICE")}
          </div>
        </Button>
        <Button
          className={styles["nav-menu-option-container"]}
          title={t("PRIVACY_POLICY")}
          href="https://www.stremio.com/privacy"
          target="_blank"
        >
          <div className={styles["nav-menu-option-label"]}>
            {t("PRIVACY_POLICY")}
          </div>
        </Button>
        {profile.auth !== null ? (
          <Button
            className={styles["nav-menu-option-container"]}
            title={t("USER_PANEL")}
            href="https://www.stremio.com/acc-settings"
            target="_blank"
          >
            <div className={styles["nav-menu-option-label"]}>
              {t("USER_PANEL")}
            </div>
          </Button>
        ) : null}
      </div>
    </div>
  )
}

const NavMenuContentFallback = () => (
  <div className={styles["nav-menu-container"]} />
)

export default withCoreSuspender(NavMenuContent, NavMenuContentFallback)
