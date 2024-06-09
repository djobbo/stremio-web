// Copyright (C) 2017-2023 Smart code 203358507

import { useMemo } from "react"

const usePWA = () => {
  const isPWA = useMemo(() => {
    const isIOSPWA = window.navigator.standalone
    const isAndroidPWA = window.matchMedia("(display-mode: standalone)").matches

    return [isIOSPWA, isAndroidPWA]
  }, [])

  return isPWA
}

export default usePWA
