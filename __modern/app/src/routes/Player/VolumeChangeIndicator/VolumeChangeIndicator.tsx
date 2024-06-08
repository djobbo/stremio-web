// Copyright (C) 2017-2023 Smart code 203358507

import VolumeSlider from "../ControlBar/VolumeSlider"
import { default as Icon } from "@stremio/stremio-icons/react"
import { default as classNames } from "classnames"
import styles from "./styles.module.less"
import { useBinaryState } from "stremio/common"
import { Fragment, memo, useEffect, useMemo, useRef } from "react"

type VolumeChangeIndicatorProps = {
  muted?: boolean
  volume?: number
}

const VolumeChangeIndicator = memo(
  ({ muted, volume }: VolumeChangeIndicatorProps) => {
    const [volumeIndicatorOpen, openVolumeIndicator, closeVolumeIndicator] =
      useBinaryState(false)
    const volumeChangeTimeout = useRef(null)
    const prevVolume = useRef(volume)

    const iconName = useMemo(() => {
      return typeof muted === "boolean" && muted
        ? "volume-mute"
        : volume === null || isNaN(volume)
          ? "volume-off"
          : volume < 30
            ? "volume-low"
            : volume < 70
              ? "volume-medium"
              : "volume-high"
    }, [muted, volume])

    useEffect(() => {
      if (prevVolume.current !== volume) {
        openVolumeIndicator()
        if (volumeChangeTimeout.current)
          clearTimeout(volumeChangeTimeout.current)
        volumeChangeTimeout.current = setTimeout(closeVolumeIndicator, 1500)
      }

      prevVolume.current = volume
    }, [volume])

    useEffect(() => {
      return () => {
        if (volumeChangeTimeout.current)
          clearTimeout(volumeChangeTimeout.current)
      }
    }, [])

    return (
      <Fragment>
        {volumeIndicatorOpen ? (
          <div
            className={classNames(
              styles["layer"],
              styles["volume-change-indicator"],
            )}
          >
            <Icon name={iconName} className={styles["volume-icon"]} />
            <VolumeSlider volume={volume} className={styles["volume-slider"]} />
          </div>
        ) : null}
      </Fragment>
    )
  },
)

VolumeChangeIndicator.displayName = "VolumeChangeIndicator"

export default VolumeChangeIndicator
