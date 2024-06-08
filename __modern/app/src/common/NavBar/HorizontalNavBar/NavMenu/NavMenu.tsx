import classnames from "classnames"
import { useCallback, useEffect, useMemo } from "react"
import Popup from "stremio/common/Popup"
import useBinaryState from "stremio/common/useBinaryState"
import { useRouteFocused } from "stremio-router"

import NavMenuContent from "./NavMenuContent"
import styles from "./styles.module.less"

type NavMenuProps = {
  renderLabel?: (...args: unknown[]) => unknown
}

const NavMenu = (props: NavMenuProps) => {
  const routeFocused = useRouteFocused()
  const [menuOpen, , closeMenu, toggleMenu] = useBinaryState(false)
  const popupLabelOnClick = useCallback(
    (event) => {
      if (!event.nativeEvent.togglePopupPrevented) {
        toggleMenu()
      }
    },
    [toggleMenu],
  )
  const popupMenuOnClick = useCallback((event) => {
    event.nativeEvent.togglePopupPrevented = true
  }, [])
  const renderLabel = useMemo(
    () =>
      ({ ref, className, children }) =>
        props.renderLabel({
          ref,
          className: classnames(className, { active: menuOpen }),
          onClick: popupLabelOnClick,
          children,
        }),
    [menuOpen, popupLabelOnClick, props.renderLabel],
  )
  const renderMenu = useCallback(
    () => <NavMenuContent onClick={popupMenuOnClick} />,
    [],
  )
  useEffect(() => {
    if (!routeFocused) {
      closeMenu()
    }
  }, [routeFocused])
  return (
    <Popup
      open={menuOpen}
      direction="bottom-left"
      onCloseRequest={closeMenu}
      renderLabel={renderLabel}
      renderMenu={renderMenu}
      className={styles["nav-menu-popup-label"]}
    />
  )
}

export default NavMenu
