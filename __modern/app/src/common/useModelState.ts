// Copyright (C) 2017-2023 Smart code 203358507

import intersection from "lodash.intersection"
import isEqual from "lodash.isequal"
import throttle from "lodash.throttle"
import { useInsertionEffect, useMemo, useReducer, useRef } from "react"
import { useCoreSuspender } from "stremio/common/CoreSuspender"
import { useServices } from "stremio/services"
import { useRouteFocused } from "stremio-router"

type useModelStateArgs = {
  model: string
  action?: any
  timeout?: number
  map?: (state: any) => any
  deps?: string[]
}

const useModelState = ({ action, ...args }: useModelStateArgs): any => {
  const { core } = useServices()
  const routeFocused = useRouteFocused()
  const mountedRef = useRef(false)
  const [model, timeout, map, deps] = useMemo(() => {
    return [args.model, args.timeout, args.map, args.deps]
  }, [])
  const { getState } = useCoreSuspender()
  const [state, setState] = useReducer(
    (prevState, nextState) => {
      return Object.keys(prevState).reduce((result, key) => {
        result[key] = isEqual(prevState[key], nextState[key])
          ? prevState[key]
          : nextState[key]

        return result
      }, {})
    },
    undefined,
    () => {
      if (typeof map === "function") {
        return map(getState(model))
      } else {
        return getState(model)
      }
    },
  )

  useInsertionEffect(() => {
    if (action) {
      core.transport.dispatch(action, model)
    }
  }, [action])
  useInsertionEffect(() => {
    return () => {
      core.transport.dispatch({ action: "Unload" }, model)
    }
  }, [])
  useInsertionEffect(() => {
    const onNewState = async (models) => {
      if (
        models.indexOf(model) === -1 &&
        (!Array.isArray(deps) || intersection(deps, models).length === 0)
      ) {
        return
      }

      const state = await core.transport.getState(model)

      if (typeof map === "function") {
        setState(map(state))
      } else {
        setState(state)
      }
    }
    const onNewStateThrottled = throttle(onNewState, timeout)

    if (routeFocused) {
      core.transport.on("NewState", onNewStateThrottled)
      if (mountedRef.current) {
        onNewState([model])
      }
    }

    return () => {
      onNewStateThrottled.cancel()
      core.transport.off("NewState", onNewStateThrottled)
    }
  }, [routeFocused])
  useInsertionEffect(() => {
    mountedRef.current = true
  }, [])

  return state
}

export default useModelState
