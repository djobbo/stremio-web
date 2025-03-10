import classnames from "classnames"
import { useCallback, useLayoutEffect, useMemo, useRef } from "react"
import {
  Button,
  Chips,
  DelayedRenderer,
  Image,
  LibItem,
  MainNavBars,
  Multiselect,
  routesRegexp,
  useNotifications,
  useOnScrollToBottom,
  useProfile,
  withCoreSuspender,
} from "stremio/common"
import NotFound from "stremio/routes/NotFound"

import styles from "./styles.module.less"
import useLibrary from "./useLibrary"
import useSelectableInputs from "./useSelectableInputs"

const SCROLL_TO_BOTTOM_TRESHOLD = 400

function withModel(Library) {
  const withModel = ({ urlParams, queryParams }) => {
    const model = useMemo(() => {
      return typeof urlParams.path === "string"
        ? urlParams.path.match(routesRegexp.library.regexp)
          ? "library"
          : urlParams.path.match(routesRegexp.continuewatching.regexp)
            ? "continue_watching"
            : null
        : null
    }, [urlParams.path])

    if (model === null) {
      return <NotFound />
    }

    return (
      <Library
        key={model}
        model={model}
        urlParams={urlParams}
        queryParams={queryParams}
      />
    )
  }

  withModel.displayName = "withModel"

  return withModel
}

type LibraryProps = {
  model?: "library" | "continue_watching"
  urlParams?: {
    type?: string
  }
  queryParams?: URLSearchParams
}

const Library = ({ model, urlParams, queryParams }: LibraryProps) => {
  const profile = useProfile()
  const notifications = useNotifications()
  const [library, loadNextPage] = useLibrary(model, urlParams, queryParams)
  const [typeSelect, sortChips, hasNextPage] = useSelectableInputs(library)
  const scrollContainerRef = useRef(null)
  const onScrollToBottom = useCallback(() => {
    if (hasNextPage) {
      loadNextPage()
    }
  }, [hasNextPage, loadNextPage])
  const onScroll = useOnScrollToBottom(
    onScrollToBottom,
    SCROLL_TO_BOTTOM_TRESHOLD,
  )

  useLayoutEffect(() => {
    if (
      profile.auth !== null &&
      library.selected &&
      library.selected.request.page === 1 &&
      library.catalog.length !== 0
    ) {
      scrollContainerRef.current.scrollTop = 0
    }
  }, [profile.auth, library.selected])

  return (
    <MainNavBars className={styles["library-container"]} route={model}>
      <div className={styles["library-content"]}>
        {model === "continue_watching" || profile.auth !== null ? (
          <div className={styles["selectable-inputs-container"]}>
            <Multiselect
              {...typeSelect}
              className={styles["select-input-container"]}
            />
            <Chips
              {...sortChips}
              className={styles["select-input-container"]}
            />
          </div>
        ) : null}
        {model === "library" && profile.auth === null ? (
          <div
            className={classnames(
              styles["message-container"],
              styles["no-user-message-container"],
            )}
          >
            <Image
              className={styles["image"]}
              src="/images/anonymous.png"
              alt={" "}
            />
            <div className={styles["message-label"]}>
              Library is only available for logged in users!
            </div>
            <Button className={styles["login-button-container"]} href="#/intro">
              <div className={styles["label"]}>LOG IN</div>
            </Button>
          </div>
        ) : library.selected === null ? (
          <DelayedRenderer delay={500}>
            <div className={styles["message-container"]}>
              <Image
                className={styles["image"]}
                src="/images/empty.png"
                alt={" "}
              />
              <div className={styles["message-label"]}>
                {model === "library" ? "Library" : "Continue Watching"} not
                loaded!
              </div>
            </div>
          </DelayedRenderer>
        ) : library.catalog.length === 0 ? (
          <div className={styles["message-container"]}>
            <Image
              className={styles["image"]}
              src="/images/empty.png"
              alt={" "}
            />
            <div className={styles["message-label"]}>
              Empty {model === "library" ? "Library" : "Continue Watching"}
            </div>
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className={classnames(
              styles["meta-items-container"],
              "animation-fade-in",
            )}
            onScroll={onScroll}
          >
            {library.catalog.map((libItem, index) => (
              <LibItem
                {...libItem}
                notifications={notifications}
                removable={model === "library"}
                key={index}
              />
            ))}
          </div>
        )}
      </div>
    </MainNavBars>
  )
}

const LibraryFallback = ({ model }) => (
  <MainNavBars className={styles["library-container"]} route={model} />
)

export default withModel(withCoreSuspender(Library, LibraryFallback))
