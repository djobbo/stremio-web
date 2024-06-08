import classnames from "classnames"
import { useCallback, useLayoutEffect, useRef } from "react"
import useAnimationFrame from "stremio/common/useAnimationFrame"
import useLiveRef from "stremio/common/useLiveRef"
import { useRouteFocused } from "stremio-router"

import styles from "./styles.module.less"

type SliderProps = {
  className?: string
  value?: number
  buffered?: number
  minimumValue?: number
  maximumValue?: number
  disabled?: boolean
  onSlide?: (...args: unknown[]) => unknown
  onComplete?: (...args: unknown[]) => unknown
}

const Slider = ({
  className,
  value,
  buffered,
  minimumValue,
  maximumValue,
  disabled,
  onSlide,
  onComplete,
}: SliderProps) => {
  const minimumValueRef = useLiveRef(
    minimumValue !== null && !isNaN(minimumValue) ? minimumValue : 0,
  )
  const maximumValueRef = useLiveRef(
    maximumValue !== null && !isNaN(maximumValue) ? maximumValue : 100,
  )
  const valueRef = useLiveRef(
    value !== null && !isNaN(value)
      ? Math.min(
          maximumValueRef.current,
          Math.max(minimumValueRef.current, value),
        )
      : 0,
  )
  const bufferedRef = useLiveRef(
    buffered !== null && !isNaN(buffered)
      ? Math.min(
          maximumValueRef.current,
          Math.max(minimumValueRef.current, buffered),
        )
      : 0,
  )
  const onSlideRef = useLiveRef(onSlide)
  const onCompleteRef = useLiveRef(onComplete)
  const sliderContainerRef = useRef(null)
  const routeFocused = useRouteFocused()
  const [requestThumbAnimation, cancelThumbAnimation] = useAnimationFrame()
  const calculateValueForMouseX = useCallback((mouseX) => {
    if (sliderContainerRef.current === null) {
      return 0
    }

    const { x: sliderX, width: sliderWidth } =
      sliderContainerRef.current.getBoundingClientRect()
    const thumbStart = Math.min(Math.max(mouseX - sliderX, 0), sliderWidth)
    const value =
      (thumbStart / sliderWidth) *
        (maximumValueRef.current - minimumValueRef.current) +
      minimumValueRef.current
    return value
  }, [])
  const retainThumb = useCallback(() => {
    window.addEventListener("blur", onBlur)
    window.addEventListener("mouseup", onMouseUp)
    window.addEventListener("mousemove", onMouseMove)
    document.documentElement.className = classnames(
      document.documentElement.className,
      styles["active-slider-within"],
    )
  }, [])
  const releaseThumb = useCallback(() => {
    cancelThumbAnimation()
    window.removeEventListener("blur", onBlur)
    window.removeEventListener("mouseup", onMouseUp)
    window.removeEventListener("mousemove", onMouseMove)
    const classList = document.documentElement.className.split(" ")
    const classIndex = classList.indexOf(styles["active-slider-within"])
    if (classIndex !== -1) {
      classList.splice(classIndex, 1)
      document.documentElement.className = classnames(classList)
    }
  }, [])
  const onBlur = useCallback(() => {
    if (typeof onSlideRef.current === "function") {
      onSlideRef.current(valueRef.current)
    }

    if (typeof onCompleteRef.current === "function") {
      onCompleteRef.current(valueRef.current)
    }

    releaseThumb()
  }, [])
  const onMouseUp = useCallback((event) => {
    const value = calculateValueForMouseX(event.clientX)
    if (typeof onCompleteRef.current === "function") {
      onCompleteRef.current(value)
    }

    releaseThumb()
  }, [])
  const onMouseMove = useCallback((event) => {
    requestThumbAnimation(() => {
      const value = calculateValueForMouseX(event.clientX)
      if (typeof onSlideRef.current === "function") {
        onSlideRef.current(value)
      }
    })
  }, [])
  const onMouseDown = useCallback((event) => {
    if (event.button !== 0) {
      return
    }

    const value = calculateValueForMouseX(event.clientX)
    if (typeof onSlideRef.current === "function") {
      onSlideRef.current(value)
    }

    retainThumb()
  }, [])
  useLayoutEffect(() => {
    if (!routeFocused || disabled) {
      releaseThumb()
    }
  }, [routeFocused, disabled])
  useLayoutEffect(() => {
    return () => {
      releaseThumb()
    }
  }, [])
  const thumbPosition = Math.max(
    0,
    Math.min(
      1,
      (valueRef.current - minimumValueRef.current) /
        (maximumValueRef.current - minimumValueRef.current),
    ),
  )
  const bufferedPosition = Math.max(
    0,
    Math.min(
      1,
      (bufferedRef.current - minimumValueRef.current) /
        (maximumValueRef.current - minimumValueRef.current),
    ),
  )
  return (
    <div
      ref={sliderContainerRef}
      className={classnames(className, styles["slider-container"], {
        disabled: disabled,
      })}
      onMouseDown={onMouseDown}
    >
      <div className={styles["layer"]}>
        <div className={styles["track"]} />
      </div>
      <div className={styles["layer"]}>
        <div
          className={styles["track-before"]}
          style={{ width: `calc(100% * ${bufferedPosition})` }}
        />
      </div>
      <div className={styles["layer"]}>
        <div
          className={styles["track-after"]}
          style={{ width: `calc(100% * ${thumbPosition})` }}
        />
      </div>
      <div className={styles["layer"]}>
        <div
          className={styles["thumb"]}
          style={{ marginLeft: `calc(100% * ${thumbPosition})` }}
        />
      </div>
    </div>
  )
}

export default Slider
