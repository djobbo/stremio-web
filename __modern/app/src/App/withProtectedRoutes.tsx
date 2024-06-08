// Copyright (C) 2017-2023 Smart code 203358507

import { useCallback, useEffect, useRef } from "react"
import { useProfile } from "stremio/common"
import { Intro } from "stremio/routes"

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
