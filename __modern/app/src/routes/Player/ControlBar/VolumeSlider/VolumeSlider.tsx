// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import classnames from "classnames"
import debounce from "lodash.debounce"
import { useRouteFocused } from "stremio-router"
import { Slider } from "stremio/common"
import styles from "./styles.module.less"
import { useState, useCallback, useLayoutEffect, useEffect } from "react"

const VolumeSlider = ({ className, volume, onVolumeChangeRequested }) => {
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

VolumeSlider.propTypes = {
  className: PropTypes.string,
  volume: PropTypes.number,
  onVolumeChangeRequested: PropTypes.func,
}

export default VolumeSlider
