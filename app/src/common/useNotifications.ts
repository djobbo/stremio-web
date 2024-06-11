// Copyright (C) 2017-2023 Smart code 203358507

import useModelState from "stremio/common/useModelState"

const map = (ctx) => ctx.notifications

const useNotifications = () => {
  return useModelState({ model: "ctx", map })
}

export default useNotifications
