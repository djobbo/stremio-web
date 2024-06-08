import classnames from "classnames"
import { useTranslation } from "react-i18next"
import Button from "stremio/common/Button"

import styles from "./styles.module.less"

type MetaLinksProps = {
  className?: string
  label?: string
  links?: {
    label?: string
    href?: string
  }[]
}

const MetaLinks = ({ className, label, links }: MetaLinksProps) => {
  const { t } = useTranslation()
  return (
    <div className={classnames(className, styles["meta-links-container"])}>
      {typeof label === "string" && label.length > 0 ? (
        <div className={styles["label-container"]}>
          {t(`LINKS_${label.toUpperCase()}`)}
        </div>
      ) : null}
      {Array.isArray(links) && links.length > 0 ? (
        <div className={styles["links-container"]}>
          {links.map(({ label, href }, index) => (
            <Button
              key={index}
              className={styles["link-container"]}
              title={label}
              href={href}
            >
              {t(label)}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default MetaLinks
