// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import debounce from "lodash.debounce"
import { useTranslation } from "react-i18next"
import { default as Icon } from "@stremio/stremio-icons/react"
import { useRouteFocused } from "stremio-router"
import Button from "stremio/common/Button"
import TextInput from "stremio/common/TextInput"
import useTorrent from "stremio/common/useTorrent"
import { withCoreSuspender } from "stremio/common/CoreSuspender"
import useSearchHistory from "./useSearchHistory"
import useLocalSearch from "./useLocalSearch"
import * as styles from "./styles.module.less"
import useBinaryState from "stremio/common/useBinaryState"
import { memo, useState, useRef, useCallback, useEffect } from "react"

const SearchBar = memo(({ className, query, active }) => {
  const { t } = useTranslation()
  const routeFocused = useRouteFocused()
  const searchHistory = useSearchHistory()
  const localSearch = useLocalSearch()
  const { createTorrentFromMagnet } = useTorrent()

  const [historyOpen, openHistory, closeHistory] = useBinaryState(
    query === null ? true : false,
  )
  const [currentQuery, setCurrentQuery] = useState(query || "")

  const searchInputRef = useRef(null)
  const containerRef = useRef(null)

  const searchBarOnClick = useCallback(() => {
    if (!active) {
      window.location = "#/search"
    }
  }, [active])

  const searchHistoryOnClose = useCallback(
    (event) => {
      if (
        historyOpen &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        closeHistory()
      }
    },
    [historyOpen],
  )

  useEffect(() => {
    document.addEventListener("mousedown", searchHistoryOnClose)
    return () => {
      document.removeEventListener("mousedown", searchHistoryOnClose)
    }
  }, [searchHistoryOnClose])

  const queryInputOnChange = useCallback(() => {
    const value = searchInputRef.current.value
    setCurrentQuery(value)
    openHistory()
    try {
      createTorrentFromMagnet(value)
    } catch (error) {
      console.error("Failed to create torrent from magnet:", error)
    }
  }, [createTorrentFromMagnet])

  const queryInputOnSubmit = useCallback((event) => {
    event.preventDefault()
    const searchValue = `/search?search=${event.target.value}`
    setCurrentQuery(searchValue)
    if (searchInputRef.current && searchValue) {
      window.location.hash = searchValue
      closeHistory()
    }
  }, [])

  const queryInputClear = useCallback(() => {
    searchInputRef.current.value = ""
    setCurrentQuery("")
    window.location.hash = "/search"
  }, [])

  const updateLocalSearchDebounced = useCallback(
    debounce((query) => {
      localSearch.search(query)
    }, 250),
    [],
  )

  useEffect(() => {
    updateLocalSearchDebounced(currentQuery)
  }, [currentQuery])

  useEffect(() => {
    if (routeFocused && active) {
      searchInputRef.current.focus()
    }
  }, [routeFocused, active])

  useEffect(() => {
    return () => {
      updateLocalSearchDebounced.cancel()
    }
  }, [])

  return (
    <div
      className={classnames(className, styles["search-bar-container"], {
        active: active,
      })}
      onClick={searchBarOnClick}
      ref={containerRef}
    >
      {active ? (
        <TextInput
          key={query}
          ref={searchInputRef}
          className={styles["search-input"]}
          type="text"
          placeholder={t("SEARCH_OR_PASTE_LINK")}
          defaultValue={query}
          tabIndex={-1}
          onChange={queryInputOnChange}
          onSubmit={queryInputOnSubmit}
          onClick={openHistory}
        />
      ) : (
        <div className={styles["search-input"]}>
          <div className={styles["placeholder-label"]}>
            {t("SEARCH_OR_PASTE_LINK")}
          </div>
        </div>
      )}
      {currentQuery.length > 0 ? (
        <Button
          className={styles["submit-button-container"]}
          onClick={queryInputClear}
        >
          <Icon className={styles["icon"]} name="close" />
        </Button>
      ) : (
        <Button className={styles["submit-button-container"]}>
          <Icon className={styles["icon"]} name="search" />
        </Button>
      )}
      {historyOpen &&
      (searchHistory?.items?.length || localSearch?.items?.length) ? (
        <div className={styles["menu-container"]}>
          {searchHistory?.items?.length > 0 ? (
            <div className={styles["items"]}>
              <div className={styles["title"]}>
                <div className={styles["label"]}>
                  {t("STREMIO_TV_SEARCH_HISTORY_TITLE")}
                </div>
                <button
                  className={styles["search-history-clear"]}
                  onClick={searchHistory.clear}
                >
                  {t("CLEAR_HISTORY")}
                </button>
              </div>
              {searchHistory.items
                .slice(0, 8)
                .map(({ query, deepLinks }, index) => (
                  <Button
                    key={index}
                    className={styles["item"]}
                    href={deepLinks.search}
                    onClick={closeHistory}
                  >
                    {query}
                  </Button>
                ))}
            </div>
          ) : null}
          {localSearch?.items?.length ? (
            <div className={styles["items"]}>
              <div className={styles["title"]}>
                <div className={styles["label"]}>{t("SEARCH_SUGGESTIONS")}</div>
              </div>
              {localSearch.items.map(({ query, deepLinks }, index) => (
                <Button
                  key={index}
                  className={styles["item"]}
                  href={deepLinks.search}
                  onClick={closeHistory}
                >
                  {query}
                </Button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
})

SearchBar.displayName = "SearchBar"

SearchBar.propTypes = {
  className: PropTypes.string,
  query: PropTypes.string,
  active: PropTypes.bool,
}

const SearchBarFallback = ({ className }) => {
  const { t } = useTranslation()
  return (
    <label className={classnames(className, styles["search-bar-container"])}>
      <div className={styles["search-input"]}>
        <div className={styles["placeholder-label"]}>
          {t("SEARCH_OR_PASTE_LINK")}
        </div>
      </div>
      <Button className={styles["submit-button-container"]} tabIndex={-1}>
        <Icon className={styles["icon"]} name="search" />
      </Button>
    </label>
  )
}

SearchBarFallback.propTypes = SearchBar.propTypes

export default withCoreSuspender(SearchBar, SearchBarFallback)
