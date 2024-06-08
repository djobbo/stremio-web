import classnames from "classnames"
import debounce from "lodash.debounce"
import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import { Slider } from "stremio/common"
import { useRouteFocused } from "stremio-router"

import styles from "./styles.module.less"

type VolumeSliderProps = {
  className?: string
  volume?: number
  onVolumeChangeRequested?: (...args: unknown[]) => unknown
}

const VolumeSlider = ({
  className,
  volume,
  onVolumeChangeRequested,
}: VolumeSliderProps) => {
  const disabled = volume === null || isNaN(volume)
  const routeFocused = useRouteFocused()
  const [slidingVolume, setSlidingVolume] = useState(null)
  const resetVolumeDebounced = useCallback(
    debounce(() => {
      setSlidingVolume(null)
    }, 100),
    [],
  )
  const onSlide = useCallback(
    (volume) => {
      resetVolumeDebounced.cancel()
      setSlidingVolume(volume)
      if (typeof onVolumeChangeRequested === "function") {
        onVolumeChangeRequested(volume)
      }
    },
    [onVolumeChangeRequested],
  )
  const onComplete = useCallback(
    (volume) => {
      resetVolumeDebounced()
      setSlidingVolume(volume)
      if (typeof onVolumeChangeRequested === "function") {
        onVolumeChangeRequested(volume)
      }
    },
    [onVolumeChangeRequested],
  )
  useLayoutEffect(() => {
    if (!routeFocused || disabled) {
      resetVolumeDebounced.cancel()
      setSlidingVolume(null)
    }
  }, [routeFocused, disabled])
  useEffect(() => {
    return () => {
      resetVolumeDebounced.cancel()
    }
  }, [])
  return (
    <Slider
      className={classnames(className, styles["volume-slider"], {
        active: slidingVolume !== null,
      })}
      value={
        !disabled ? (slidingVolume !== null ? slidingVolume : volume) : 100
      }
      minimumValue={0}
      maximumValue={100}
      disabled={disabled}
      onSlide={onSlide}
      onComplete={onComplete}
    />
  )
}

export default VolumeSlider
