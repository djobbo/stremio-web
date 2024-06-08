// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import { default as Icon } from "@stremio/stremio-icons/react"
import Button from "stremio/common/Button"
import Image from "stremio/common/Image"
import * as styles from "./styles.less"
import { useCallback } from "react"

const NavTabButton = ({
  className,
  logo,
  icon,
  label,
  href,
  selected,
  onClick,
}) => {
  const renderLogoFallback = useCallback(
    () =>
      typeof icon === "string" && icon.length > 0 ? (
        <Icon className={styles["icon"]} name={icon} />
      ) : null,
    [icon],
  )
  return (
    <Button
      className={classnames(className, styles["nav-tab-button-container"], {
        selected: selected,
      })}
      title={label}
      tabIndex={-1}
      href={href}
      onClick={onClick}
    >
      {typeof logo === "string" && logo.length > 0 ? (
        <Image
          className={styles["logo"]}
          src={logo}
          alt={" "}
          renderFallback={renderLogoFallback}
        />
      ) : typeof icon === "string" && icon.length > 0 ? (
        <Icon
          className={styles["icon"]}
          name={selected ? icon : `${icon}-outline`}
        />
      ) : null}
      {typeof label === "string" && label.length > 0 ? (
        <div className={styles["label"]}>{label}</div>
      ) : null}
    </Button>
  )
}

NavTabButton.propTypes = {
  className: PropTypes.string,
  logo: PropTypes.string,
  icon: PropTypes.string,
  label: PropTypes.string,
  href: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
}

export default NavTabButton
