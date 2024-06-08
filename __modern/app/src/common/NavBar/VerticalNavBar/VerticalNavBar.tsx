// Copyright (C) 2017-2023 Smart code 203358507

import classnames from "classnames"
import { useTranslation } from "react-i18next"
import NavTabButton from "./NavTabButton"
import styles from "./styles.module.less"
import { memo } from "react"

type VerticalNavBarProps = {
  className?: string
  selected?: string
  tabs?: {
    id: string
    label: string
    logo?: string
    icon?: string
    href?: string
    onClick?: () => void
  }[]
}

const VerticalNavBar = memo(
  ({ className, selected, tabs }: VerticalNavBarProps) => {
    const { t } = useTranslation()
    return (
      <nav
        className={classnames(className, styles["vertical-nav-bar-container"])}
      >
        {Array.isArray(tabs)
          ? tabs.map((tab, index) => (
              <NavTabButton
                key={index}
                className={styles["nav-tab-button"]}
                selected={tab.id === selected}
                href={tab.href}
                logo={tab.logo}
                icon={tab.icon}
                label={t(tab.label)}
                onClick={tab.onClick}
              />
            ))
          : null}
      </nav>
    )
  },
)

VerticalNavBar.displayName = "VerticalNavBar"

export default VerticalNavBar
