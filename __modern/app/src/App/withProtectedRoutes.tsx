// Copyright (C) 2017-2023 Smart code 203358507

import { Intro } from "stremio/routes"
import { useProfile } from "stremio/common"
import { useRef, useEffect, useCallback } from "react"

const withProtectedRoutes = (Component) => {
  return function withProtectedRoutes(props) {
    const profile = useProfile()
    const previousAuthRef = useRef(profile.auth)
    useEffect(() => {
      if (previousAuthRef.current !== null && profile.auth === null) {
        window.location = "#/intro"
      }
      previousAuthRef.current = profile.auth
    }, [profile])
    const onRouteChange = useCallback(
      (routeConfig) => {
        if (profile.auth !== null && routeConfig.component === Intro) {
          window.location.replace("#/")
          return true
        }
      },
      [profile],
    )
    return <Component {...props} onRouteChange={onRouteChange} />
  }
}

export default withProtectedRoutes
