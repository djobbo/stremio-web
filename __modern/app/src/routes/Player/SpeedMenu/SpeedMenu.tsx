import classnames from "classnames"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"

import Option from "./Option"
import styles from "./styles.module.less"

const RATES = Array.from(Array(8).keys(), (n) => n * 0.25 + 0.25).reverse()

type SpeedMenuProps = {
  className?: string
  playbackSpeed?: number
  onPlaybackSpeedChanged?: (...args: unknown[]) => unknown
}

const SpeedMenu = ({
  className,
  playbackSpeed,
  onPlaybackSpeedChanged,
}: SpeedMenuProps) => {
  const { t } = useTranslation()
  const onMouseDown = useCallback((event) => {
    event.nativeEvent.speedMenuClosePrevented = true
  }, [])
  const onOptionSelect = useCallback(
    (value) => {
      if (typeof onPlaybackSpeedChanged === "function") {
        onPlaybackSpeedChanged(value)
      }
    },
    [onPlaybackSpeedChanged],
  )

  return (
    <div
      className={classnames(className, styles["speed-menu-container"])}
      onMouseDown={onMouseDown}
    >
      <div className={styles["title"]}>{t("PLAYBACK_SPEED")}</div>
      <div className={styles["options-container"]}>
        {RATES.map((rate) => (
          <Option
            className={styles["option"]}
            key={rate}
            value={rate}
            selected={rate === playbackSpeed}
            onSelect={onOptionSelect}
          />
        ))}
      </div>
    </div>
  )
}

export default SpeedMenu
