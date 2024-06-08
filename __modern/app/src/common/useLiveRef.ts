// Copyright (C) 2017-2023 Smart code 203358507

import { useRef } from "react"

const useLiveRef = (value) => {
  const ref = useRef()
  ref.current = value
  return ref
}

export default useLiveRef
