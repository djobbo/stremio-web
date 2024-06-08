// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import { useRouteFocused } from "stremio-router"
import Popup from "stremio/common/Popup"
import useBinaryState from "stremio/common/useBinaryState"
import NavMenuContent from "./NavMenuContent"
import styles from "./styles.module.less"
import { useCallback, useMemo, useEffect } from "react"

const NavMenu = (props) => {
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

NavMenu.propTypes = {
  renderLabel: PropTypes.func,
}

export default NavMenu
