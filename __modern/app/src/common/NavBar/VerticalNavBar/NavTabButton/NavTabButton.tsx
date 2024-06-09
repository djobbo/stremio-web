import { default as Icon } from "@stremio/stremio-icons/react"
import classnames from "classnames"
import { useCallback } from "react"
import Button from "stremio/common/Button"
import Image from "stremio/common/Image"

import styles from "./styles.module.less"

type NavTabButtonProps = {
  className?: string
  logo?: string
  icon?: string
  label?: string
  href?: string
  selected?: boolean
  onClick?: (...args: unknown[]) => unknown
}

const NavTabButton = ({
  className,
  logo,
  icon,
  label,
  href,
  selected,
  onClick,
}: NavTabButtonProps) => {
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

export default NavTabButton
