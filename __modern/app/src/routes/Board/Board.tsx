// Copyright (C) 2017-2023 Smart code 203358507

import classnames from "classnames"
import debounce from "lodash.debounce"
import { useTranslation } from "react-i18next"

import {
  MainNavBars,
  MetaRow,
  ContinueWatchingItem,
  MetaItem,
  StreamingServerWarning,
  useStreamingServer,
  useNotifications,
  withCoreSuspender,
  getVisibleChildrenRange,
  EventModal,
} from "stremio/common"

import useBoard from "./useBoard"
import useContinueWatchingPreview from "./useContinueWatchingPreview"
import * as styles from "./styles.module.less"
import { useRef, useCallback, useLayoutEffect } from "react"

const THRESHOLD = 5

const Board = () => {
  const { t } = useTranslation()
  const streamingServer = useStreamingServer()
  const continueWatchingPreview = useContinueWatchingPreview()
  const [board, loadBoardRows] = useBoard()
  const notifications = useNotifications()
  const boardCatalogsOffset = continueWatchingPreview.items.length > 0 ? 1 : 0
  const scrollContainerRef = useRef()
  const onVisibleRangeChange = useCallback(() => {
    const range = getVisibleChildrenRange(scrollContainerRef.current)
    if (range === null) {
      return
    }

    const start = Math.max(0, range.start - boardCatalogsOffset - THRESHOLD)
    const end = range.end - boardCatalogsOffset + THRESHOLD
    if (end < start) {
      return
    }

    loadBoardRows({ start, end })
  }, [boardCatalogsOffset])
  const onScroll = useCallback(debounce(onVisibleRangeChange, 250), [
    onVisibleRangeChange,
  ])
  useLayoutEffect(() => {
    onVisibleRangeChange()
  }, [board.catalogs, onVisibleRangeChange])
  return (
    <div className={styles["board-container"]}>
      <EventModal />
      <MainNavBars className={styles["board-content-container"]} route="board">
        <div
          ref={scrollContainerRef}
          className={styles["board-content"]}
          onScroll={onScroll}
        >
          {continueWatchingPreview.items.length > 0 ? (
            <MetaRow
              className={classnames(
                styles["board-row"],
                styles["continue-watching-row"],
                "animation-fade-in",
              )}
              title={t("BOARD_CONTINUE_WATCHING")}
              catalog={continueWatchingPreview}
              itemComponent={ContinueWatchingItem}
              notifications={notifications}
            />
          ) : null}
          {board.catalogs.map((catalog, index) => {
            switch (catalog.content?.type) {
              case "Ready": {
                return (
                  <MetaRow
                    key={index}
                    className={classnames(
                      styles["board-row"],
                      styles[
                        `board-row-${catalog.content.content[0].posterShape}`
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
                      styles["board-row"],
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
                      styles["board-row"],
                      styles["board-row-poster"],
                      "animation-fade-in",
                    )}
                    catalog={catalog}
                  />
                )
              }
            }
          })}
        </div>
      </MainNavBars>
      {streamingServer.settings !== null &&
      streamingServer.settings.type === "Err" ? (
        <StreamingServerWarning className={styles["board-warning-container"]} />
      ) : null}
    </div>
  )
}

const BoardFallback = () => (
  <div className={styles["board-container"]}>
    <MainNavBars className={styles["board-content-container"]} route="board" />
  </div>
)

export default withCoreSuspender(Board, BoardFallback)
