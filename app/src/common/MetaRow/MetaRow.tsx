// Copyright (C) 2017-2023 Smart code 203358507

import { default as Icon } from "@stremio/stremio-icons/react"
import classnames from "classnames"
import type { ElementType } from "react"
import { createElement, useMemo } from "react"
import ReactIs from "react-is"
import Button from "stremio/common/Button"
import { CATALOG_PREVIEW_SIZE } from "stremio/common/CONSTANTS"
import useTranslate from "stremio/common/useTranslate"

import MetaRowPlaceholder from "./MetaRowPlaceholder"
import styles from "./styles.module.less"

type MetaRowProps = {
  className?: string
  title?: string
  message?: string
  catalog?: {
    id?: string
    name?: string
    type?: string
    addon?: {
      manifest?: {
        id?: string
        name?: string
      }
    }
    content?: {
      content?:
        | string
        | {
            posterShape?: string
          }[]
    }
    items?: {
      posterShape?: string
    }[]
    deepLinks?: {
      discover?: string
      library?: string
    }
  }
  itemComponent?: ElementType
  notifications?: object
}

const MetaRow = ({
  className,
  title,
  catalog,
  message,
  itemComponent,
  notifications,
}: MetaRowProps) => {
  const t = useTranslate()

  const catalogTitle = useMemo(() => {
    return title ?? t.catalogTitle(catalog)
  }, [title, catalog, t.catalogTitle])

  const items = useMemo(() => {
    return catalog?.items ?? catalog?.content?.content
  }, [catalog])

  const href = useMemo(() => {
    return catalog?.deepLinks?.discover ?? catalog?.deepLinks?.library
  }, [catalog])

  return (
    <div className={classnames(className, styles["meta-row-container"])}>
      <div className={styles["header-container"]}>
        {typeof catalogTitle === "string" && catalogTitle.length > 0 ? (
          <div className={styles["title-container"]} title={catalogTitle}>
            {catalogTitle}
          </div>
        ) : null}
        {href ? (
          <Button
            className={styles["see-all-container"]}
            title={t.string("BUTTON_SEE_ALL")}
            href={href}
            tabIndex={-1}
          >
            <div className={styles["label"]}>{t.string("BUTTON_SEE_ALL")}</div>
            <Icon className={styles["icon"]} name="chevron-forward" />
          </Button>
        ) : null}
      </div>
      {typeof message === "string" && message.length > 0 ? (
        <div className={styles["message-container"]} title={message}>
          {message}
        </div>
      ) : (
        <div className={styles["meta-items-container"]}>
          {ReactIs.isValidElementType(itemComponent)
            ? items.slice(0, CATALOG_PREVIEW_SIZE).map((item, index) => {
                return createElement(itemComponent, {
                  ...item,
                  key: index,
                  className: classnames(
                    styles["meta-item"],
                    styles["poster-shape-poster"],
                    styles[`poster-shape-${item.posterShape}`],
                  ),
                  notifications,
                })
              })
            : null}
          {Array(Math.max(0, CATALOG_PREVIEW_SIZE - items.length))
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className={classnames(
                  styles["meta-item"],
                  styles["poster-shape-poster"],
                )}
              />
            ))}
        </div>
      )}
    </div>
  )
}

MetaRow.Placeholder = MetaRowPlaceholder

export default MetaRow
