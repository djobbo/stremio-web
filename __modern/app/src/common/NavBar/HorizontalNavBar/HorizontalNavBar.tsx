// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import { default as Icon } from "@stremio/stremio-icons/react"
import Button from "stremio/common/Button"
import Image from "stremio/common/Image"
import useFullscreen from "stremio/common/useFullscreen"
import usePWA from "stremio/common/usePWA"
import SearchBar from "./SearchBar"
import NavMenu from "./NavMenu"
import * as styles from "./styles.less"
import { t } from "i18next"
import { memo, useCallback } from "react"

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
  }) => {
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
              src={require("/images/stremio_symbol.png")}
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

HorizontalNavBar.propTypes = {
  className: PropTypes.string,
  route: PropTypes.string,
  query: PropTypes.string,
  title: PropTypes.string,
  backButton: PropTypes.bool,
  searchBar: PropTypes.bool,
  addonsButton: PropTypes.bool,
  fullscreenButton: PropTypes.bool,
  navMenu: PropTypes.bool,
}

export default HorizontalNavBar
