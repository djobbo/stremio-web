// Copyright (C) 2017-2023 Smart code 203358507

import { useModelState } from "stremio/common"

const useContinueWatchingPreview = () => {
  return useModelState({ model: "continue_watching_preview" })
}

export default useContinueWatchingPreview
