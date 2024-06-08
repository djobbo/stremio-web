// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import { useTranslation } from "react-i18next"
import { default as Icon } from "@stremio/stremio-icons/react"
import { useRouteFocused } from "stremio-router"
import { useServices } from "stremio/services"
import useToast from "stremio/common/Toast/useToast"
import Button from "stremio/common/Button"
import TextInput from "stremio/common/TextInput"
import * as styles from "./styles.module.less"
import { useRef, useCallback, useEffect } from "react"

const SharePrompt = ({ className, url }) => {
  const { t } = useTranslation()
  const { core } = useServices()
  const toast = useToast()
  const inputRef = useRef(null)
  const routeFocused = useRouteFocused()
  const selectInputContent = useCallback(() => {
    if (inputRef.current !== null) {
      inputRef.current.select()
    }
  }, [])
  const copyToClipboard = useCallback(() => {
    if (inputRef.current !== null) {
      inputRef.current.select()
      document.execCommand("copy")
      toast.show({
        type: "success",
        title: "Copied to clipboard",
        timeout: 3000,
      })
    }
  }, [])
  useEffect(() => {
    if (routeFocused && inputRef.current !== null) {
      inputRef.current.select()
    }
  }, [routeFocused])
  useEffect(() => {
    core.transport.analytics({
      event: "Share",
      args: {
        url: url,
      },
    })
  }, [url])
  return (
    <div className={classnames(className, styles["share-prompt-container"])}>
      <div className={styles["buttons-container"]}>
        <Button
          className={classnames(
            styles["button-container"],
            styles["facebook-button"],
          )}
          title="Facebook"
          href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          target="_blank"
        >
          <Icon className={styles["icon"]} name="facebook" />
        </Button>
        <Button
          className={classnames(styles["button-container"], styles["x-button"])}
          title="X (Twitter)"
          href={`https://twitter.com/intent/tweet?text=${url}`}
          target="_blank"
        >
          <Icon className={styles["icon"]} name="x" />
        </Button>
        <Button
          className={classnames(
            styles["button-container"],
            styles["reddit-button"],
          )}
          title="Reddit"
          href={`https://www.reddit.com/submit?url=${url}`}
          target="_blank"
        >
          <Icon className={styles["icon"]} name="reddit" />
        </Button>
      </div>
      <div className={styles["url-container"]}>
        <TextInput
          ref={inputRef}
          className={styles["url-text-input"]}
          type="text"
          readOnly={true}
          defaultValue={url}
          onClick={selectInputContent}
          tabIndex={-1}
        />
        <Button
          className={styles["copy-button"]}
          title="Copy to clipboard"
          onClick={copyToClipboard}
        >
          <Icon className={styles["icon"]} name="link" />
          <div className={styles["label"]}>{t("COPY")}</div>
        </Button>
      </div>
    </div>
  )
}

SharePrompt.propTypes = {
  className: PropTypes.string,
  url: PropTypes.string,
}

export default SharePrompt
