// Copyright (C) 2017-2023 Smart code 203358507

import useModelState from "stremio/common/useModelState"

const map = (ctx) => ({
  ...ctx.profile,
  settings: {
    ...ctx.profile.settings,
    streamingServerWarningDismissed: new Date(
      typeof ctx.profile.settings.streamingServerWarningDismissed === "string"
        ? ctx.profile.settings.streamingServerWarningDismissed
        : NaN,
    ),
  },
})

const useProfile = () => {
  return useModelState({ model: "ctx", map })
}

export default useProfile
