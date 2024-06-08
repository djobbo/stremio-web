import classnames from "classnames"
import { default as Icon } from "@stremio/stremio-icons/react"
import Button from "stremio/common/Button"
import Image from "stremio/common/Image"
import useFullscreen from "stremio/common/useFullscreen"
import usePWA from "stremio/common/usePWA"
import SearchBar from "./SearchBar"
import NavMenu from "./NavMenu"
import styles from "./styles.module.less"
import { t } from "i18next"
import { memo, useCallback } from "react"

type HorizontalNavBarProps = {
  className?: string
  route?: string
  query?: string
  title?: string
  backButton?: boolean
  searchBar?: boolean
  addonsButton?: boolean
  fullscreenButton?: boolean
  navMenu?: boolean
}

const HorizontalNavBar = memo(
  ({
    className,
    route,
    query,
    title,
    backButton,
    searchBar,
    addonsButton,
    fullscreenButton,
    navMenu,
    ...props
  }: HorizontalNavBarProps) => {
    const backButtonOnClick = useCallback(() => {
      window.history.back()
    }, [])
    const [fullscreen, requestFullscreen, exitFullscreen] = useFullscreen()
    const [isIOSPWA] = usePWA()
    const renderNavMenuLabel = useCallback(
      ({ ref, className, onClick, children }) => (
        <Button
          ref={ref}
          className={classnames(
            className,
            styles["button-container"],
            styles["menu-button-container"],
          )}
          tabIndex={-1}
          onClick={onClick}
        >
          <Icon className={styles["icon"]} name="person-outline" />
          {children}
        </Button>
      ),
      [],
    )
    return (
      <nav
        {...props}
        className={classnames(
          className,
          styles["horizontal-nav-bar-container"],
        )}
      >
        {backButton ? (
          <Button
            className={classnames(
              styles["button-container"],
              styles["back-button-container"],
            )}
            tabIndex={-1}
            onClick={backButtonOnClick}
          >
            <Icon className={styles["icon"]} name="chevron-back" />
          </Button>
        ) : (
          <div className={styles["logo-container"]}>
            <Image
              className={styles["logo"]}
              src="/images/stremio_symbol.png"
              alt={" "}
            />
          </div>
        )}
        {typeof title === "string" && title.length > 0 ? (
          <h2 className={styles["title"]}>{title}</h2>
        ) : null}
        {searchBar && route !== "addons" ? (
          <SearchBar
            className={styles["search-bar"]}
            query={query}
            active={route === "search"}
          />
        ) : null}
        <div className={styles["buttons-container"]}>
          {addonsButton ? (
            <Button
              className={styles["button-container"]}
              href="#/addons"
              title={t("ADDONS")}
              tabIndex={-1}
            >
              <Icon className={styles["icon"]} name="addons-outline" />
            </Button>
          ) : null}
          {!isIOSPWA && fullscreenButton ? (
            <Button
              className={styles["button-container"]}
              title={fullscreen ? t("EXIT_FULLSCREEN") : t("ENTER_FULLSCREEN")}
              tabIndex={-1}
              onClick={fullscreen ? exitFullscreen : requestFullscreen}
            >
              <Icon
                className={styles["icon"]}
                name={fullscreen ? "minimize" : "maximize"}
              />
            </Button>
          ) : null}
          {navMenu ? <NavMenu renderLabel={renderNavMenuLabel} /> : null}
        </div>
      </nav>
    )
  },
)

HorizontalNavBar.displayName = "HorizontalNavBar"

export default HorizontalNavBar
