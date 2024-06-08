// Copyright (C) 2017-2023 Smart code 203358507

import useModelState from "stremio/common/useModelState"
import { useServices } from "stremio/services"

const map = (ctx) => ({
  ...ctx.events,
})

const useEvents = () => {
  const { core } = useServices()

  const pullEvents = () => {
    core.transport.dispatch({
      action: "Ctx",
      args: {
        action: "GetEvents",
      },
    })
  }

  const dismissEvent = (id) => {
    core.transport.dispatch({
      action: "Ctx",
      args: {
        action: "DismissEvent",
        args: id,
      },
    })
  }

  const events = useModelState({ model: "ctx", map })
  return { events, pullEvents, dismissEvent }
}

export default useEvents
