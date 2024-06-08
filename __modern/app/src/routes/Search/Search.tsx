import classnames from "classnames"
import debounce from "lodash.debounce"
import { useTranslation } from "react-i18next"
import { default as Icon } from "@stremio/stremio-icons/react"

import {
  Image,
  MainNavBars,
  MetaRow,
  MetaItem,
  withCoreSuspender,
  getVisibleChildrenRange,
} from "stremio/common"

import useSearch from "./useSearch"
import styles from "./styles.module.less"
import { useCallback, useLayoutEffect, useMemo, useRef } from "react"

const THRESHOLD = 100

type SearchProps = {
  queryParams?: URLSearchParams
}

const Search = ({ queryParams }: SearchProps) => {
  const { t } = useTranslation()
  const [search, loadSearchRows] = useSearch(queryParams)
  const query = useMemo(() => {
    return search.selected !== null
      ? search.selected.extra.reduceRight((query, [name, value]) => {
          if (name === "search") {
            return value
          }

          return query
        }, null)
      : null
  }, [search.selected])
  const scrollContainerRef = useRef()
  const onVisibleRangeChange = useCallback(() => {
    if (search.catalogs.length === 0) {
      return
    }

    const range = getVisibleChildrenRange(scrollContainerRef.current, THRESHOLD)
    if (range === null) {
      return
    }

    loadSearchRows(range)
  }, [search.catalogs])
  const onScroll = useCallback(debounce(onVisibleRangeChange, 250), [
    onVisibleRangeChange,
  ])
  useLayoutEffect(() => {
    onVisibleRangeChange()
  }, [search.catalogs, onVisibleRangeChange])
  return (
    <MainNavBars
      className={styles["search-container"]}
      route="search"
      query={query}
    >
      <div
        ref={scrollContainerRef}
        className={styles["search-content"]}
        onScroll={onScroll}
      >
        {query === null ? (
          <div className={classnames(styles["search-hints-wrapper"])}>
            <div
              className={classnames(
                styles["search-hints-title-container"],
                "animation-fade-in",
              )}
            >
              <div className={styles["search-hints-title"]}>
                {t("SEARCH_ANYTHING")}
              </div>
            </div>
            <div
              className={classnames(
                styles["search-hints-container"],
                "animation-fade-in",
              )}
            >
              <div className={styles["search-hint-container"]}>
                <Icon className={styles["icon"]} name="trailer" />
                <div className={styles["label"]}>{t("SEARCH_CATEGORIES")}</div>
              </div>
              <div className={styles["search-hint-container"]}>
                <Icon className={styles["icon"]} name="actors" />
                <div className={styles["label"]}>{t("SEARCH_PERSONS")}</div>
              </div>
              <div className={styles["search-hint-container"]}>
                <Icon className={styles["icon"]} name="link" />
                <div className={styles["label"]}>{t("SEARCH_PROTOCOLS")}</div>
              </div>
              <div className={styles["search-hint-container"]}>
                <Icon className={styles["icon"]} name="imdb-outline" />
                <div className={styles["label"]}>{t("SEARCH_TYPES")}</div>
              </div>
            </div>
          </div>
        ) : search.catalogs.length === 0 ? (
          <div className={styles["message-container"]}>
            <Image
              className={styles["image"]}
              src="/images/empty.png"
              alt={" "}
            />
            <div className={styles["message-label"]}>
              {t("STREMIO_TV_SEARCH_NO_ADDONS")}
            </div>
          </div>
        ) : (
          search.catalogs.map((catalog, index) => {
            switch (catalog.content?.type) {
              case "Ready": {
                return (
                  <MetaRow
                    key={index}
                    className={classnames(
                      styles["search-row"],
                      styles[
                        `search-row-${catalog.content.content[0].posterShape}`
                      ],
                      "animation-fade-in",
                    )}
                    catalog={catalog}
                    itemComponent={MetaItem}
                  />
                )
              }
              case "Err": {
                return (
                  <MetaRow
                    key={index}
                    className={classnames(
                      styles["search-row"],
                      "animation-fade-in",
                    )}
                    catalog={catalog}
                    message={catalog.content.content}
                  />
                )
              }
              default: {
                return (
                  <MetaRow.Placeholder
                    key={index}
                    className={classnames(
                      styles["search-row"],
                      styles["search-row-poster"],
                      "animation-fade-in",
                    )}
                    catalog={catalog}
                  />
                )
              }
            }
          })
        )}
      </div>
    </MainNavBars>
  )
}

const SearchFallback = ({ queryParams }) => (
  <MainNavBars
    className={styles["search-container"]}
    route="search"
    query={queryParams.get("search") ?? queryParams.get("query")}
  />
)

export default withCoreSuspender(Search, SearchFallback)
