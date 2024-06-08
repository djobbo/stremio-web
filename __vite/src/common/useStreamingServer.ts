// Copyright (C) 2017-2023 Smart code 203358507

import useModelState from "stremio/common/useModelState"

const useStreamingServer = () => {
  return useModelState({ model: "streaming_server" })
}

export default useStreamingServer
