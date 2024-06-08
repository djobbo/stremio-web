// Copyright (C) 2017-2023 Smart code 203358507

import { useRef, useCallback } from "react"

const useAnimationFrame = () => {
  const animationFrameId = useRef(null)
  const cancel = useCallback(() => {
    cancelAnimationFrame(animationFrameId.current)
    animationFrameId.current = null
  }, [])
  const request = useCallback((cb) => {
    cancel()
    animationFrameId.current = requestAnimationFrame(() => {
      cb()
      animationFrameId.current = null
    })
  }, [])
  return [request, cancel]
}

export default useAnimationFrame
