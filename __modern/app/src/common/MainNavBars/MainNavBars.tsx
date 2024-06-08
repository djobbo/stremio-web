import classnames from "classnames"
import { VerticalNavBar, HorizontalNavBar } from "stremio/common/NavBar"
import styles from "./styles.module.less"
import { ReactNode, memo } from "react"

const TABS = [
  { id: "board", label: "Board", icon: "home", href: "#/" },
  { id: "discover", label: "Discover", icon: "discover", href: "#/discover" },
  { id: "library", label: "Library", icon: "library", href: "#/library" },
  { id: "addons", label: "ADDONS", icon: "addons", href: "#/addons" },
  { id: "settings", label: "SETTINGS", icon: "settings", href: "#/settings" },
]

type MainNavBarsProps = {
  className?: string
  route?: string
  query?: string
  children?: ReactNode
}

const MainNavBars = memo(
  ({ className, route, query, children }: MainNavBarsProps) => {
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
  },
)

MainNavBars.displayName = "MainNavBars"

export default MainNavBars
