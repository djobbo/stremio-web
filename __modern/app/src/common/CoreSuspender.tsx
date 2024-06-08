// Copyright (C) 2017-2023 Smart code 203358507

import {
  Suspense,
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useServices } from "stremio/services"

const CoreSuspenderContext = createContext(null)

CoreSuspenderContext.displayName = "CoreSuspenderContext"

function wrapPromise(promise) {
  let status = "pending"
  let result
  const suspender = promise.then(
    (resp) => {
      status = "success"
      result = resp
    },
    (error) => {
      status = "error"
      result = error
    },
  )
  return {
    read() {
      if (status === "pending") {
        throw suspender
      } else if (status === "error") {
        throw result
      } else if (status === "success") {
        return result
      }
    },
  }
}

const useCoreSuspender = () => {
  return useContext(CoreSuspenderContext)
}

const withCoreSuspender = (Component, Fallback = () => {}) => {
  return function withCoreSuspender(props) {
    const { core } = useServices()
    const parentSuspender = useCoreSuspender()
    const [render, setRender] = useState(parentSuspender === null)
    const statesRef = useRef({})
    const streamsRef = useRef({})
    const getState = useCallback((model) => {
      if (!statesRef.current[model]) {
        statesRef.current[model] = wrapPromise(core.transport.getState(model))
      }

      return statesRef.current[model].read()
    }, [])
    const decodeStream = useCallback((stream) => {
      if (!streamsRef.current[stream]) {
        streamsRef.current[stream] = wrapPromise(
          core.transport.decodeStream(stream),
        )
      }

      return streamsRef.current[stream].read()
    }, [])
    const suspender = useMemo(() => ({ getState, decodeStream }), [])
    useLayoutEffect(() => {
      if (!render) {
        setRender(true)
      }
    }, [])
    return render ? (
      <Suspense fallback={<Fallback {...props} />}>
        <CoreSuspenderContext.Provider value={suspender}>
          <Component {...props} />
        </CoreSuspenderContext.Provider>
      </Suspense>
    ) : null
  }
}

export { useCoreSuspender, withCoreSuspender }
