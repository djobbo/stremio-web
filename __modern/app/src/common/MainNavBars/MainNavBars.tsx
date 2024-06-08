// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import { VerticalNavBar, HorizontalNavBar } from "stremio/common/NavBar"
import * as styles from "./styles.module.less"
import { memo } from "react"

const TABS = [
  { id: "board", label: "Board", icon: "home", href: "#/" },
  { id: "discover", label: "Discover", icon: "discover", href: "#/discover" },
  { id: "library", label: "Library", icon: "library", href: "#/library" },
  { id: "addons", label: "ADDONS", icon: "addons", href: "#/addons" },
  { id: "settings", label: "SETTINGS", icon: "settings", href: "#/settings" },
]

const MainNavBars = memo(({ className, route, query, children }) => {
  return (
    <div className={classnames(className, styles["main-nav-bars-container"])}>
      <HorizontalNavBar
        className={styles["horizontal-nav-bar"]}
        route={route}
        query={query}
        backButton={false}
        searchBar={true}
        addonsButton={true}
        fullscreenButton={true}
        navMenu={true}
      />
      <VerticalNavBar
        className={styles["vertical-nav-bar"]}
        selected={route}
        tabs={TABS}
      />
      <div className={styles["nav-content-container"]}>{children}</div>
    </div>
  )
})

MainNavBars.displayName = "MainNavBars"

MainNavBars.propTypes = {
  className: PropTypes.string,
  route: PropTypes.string,
  query: PropTypes.string,
  children: PropTypes.node,
}

export default MainNavBars
