import classnames from "classnames"
import debounce from "lodash.debounce"
import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import { Button, Slider, useBinaryState } from "stremio/common"
import { useRouteFocused } from "stremio-router"

import formatTime from "./formatTime"
import styles from "./styles.module.less"

type SeekBarProps = {
  className?: string
  time?: number
  duration?: number
  buffered?: number
  onSeekRequested?: (...args: unknown[]) => unknown
}

const SeekBar = ({
  className,
  time,
  duration,
  buffered,
  onSeekRequested,
}: SeekBarProps) => {
  const disabled =
    time === null || isNaN(time) || duration === null || isNaN(duration)
  const routeFocused = useRouteFocused()
  const [seekTime, setSeekTime] = useState(null)

  const [remainingTimeMode, , , toggleRemainingTimeMode] = useBinaryState(false)
  const resetTimeDebounced = useCallback(
    debounce(() => {
      setSeekTime(null)
    }, 1500),
    [],
  )
  const onSlide = useCallback((time) => {
    resetTimeDebounced.cancel()
    setSeekTime(time)
  }, [])
  const onComplete = useCallback(
    (time) => {
      resetTimeDebounced()
      setSeekTime(time)
      if (typeof onSeekRequested === "function") {
        onSeekRequested(time)
      }
    },
    [onSeekRequested],
  )

  useLayoutEffect(() => {
    if (!routeFocused || disabled) {
      resetTimeDebounced.cancel()
      setSeekTime(null)
    }
  }, [routeFocused, disabled])
  useEffect(() => {
    return () => {
      resetTimeDebounced.cancel()
    }
  }, [])

  return (
    <div
      className={classnames(className, styles["seek-bar-container"], {
        active: seekTime !== null,
      })}
    >
      <div className={styles["label"]}>
        {formatTime(seekTime !== null ? seekTime : time)}
      </div>
      <Slider
        className={classnames(styles["slider"], { active: seekTime !== null })}
        value={!disabled ? (seekTime !== null ? seekTime : time) : 0}
        buffered={buffered}
        minimumValue={0}
        maximumValue={duration}
        disabled={disabled}
        onSlide={onSlide}
        onComplete={onComplete}
      />
      <Button onClick={toggleRemainingTimeMode} tabIndex={-1}>
        <div className={styles["label"]}>
          {remainingTimeMode && duration !== null && !isNaN(duration)
            ? formatTime(duration - time, "-")
            : formatTime(duration)}
        </div>
      </Button>
    </div>
  )
}

export default SeekBar
