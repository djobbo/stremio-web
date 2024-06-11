// Copyright (C) 2017-2023 Smart code 203358507

import type { ReactNode, SyntheticEvent } from "react"
import { useCallback, useLayoutEffect, useState } from "react"

type ImageProps = {
  className?: string
  src?: string
  alt?: string
  fallbackSrc?: string
  renderFallback?: () => ReactNode
  onError?: (event: SyntheticEvent<HTMLImageElement, Event>) => void
}

const Image = ({
  className,
  src,
  alt,
  fallbackSrc,
  renderFallback,
  ...props
}: ImageProps) => {
  const [broken, setBroken] = useState(false)
  const onError = useCallback(
    (event) => {
      if (typeof props.onError === "function") {
        props.onError(event)
      }

      setBroken(true)
    },
    [props.onError],
  )

  useLayoutEffect(() => {
    setBroken(false)
  }, [src])

  return (broken || typeof src !== "string" || src.length === 0) &&
    (typeof renderFallback === "function" ||
      typeof fallbackSrc === "string") ? (
    typeof renderFallback === "function" ? (
      renderFallback()
    ) : (
      <img {...props} className={className} src={fallbackSrc} alt={alt} />
    )
  ) : (
    <img
      {...props}
      className={className}
      src={src}
      alt={alt}
      onError={onError}
    />
  )
}

export default Image
