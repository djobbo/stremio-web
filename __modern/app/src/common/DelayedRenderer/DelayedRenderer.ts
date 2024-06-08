// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import { useState, useEffect } from "react"

const DelayedRenderer = ({ children, delay }) => {
  const [render, setRender] = useState(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setRender(true)
    }, delay)
    return () => {
      clearTimeout(timeout)
    }
  }, [])
  return render ? children : null
}

DelayedRenderer.propTypes = {
  children: PropTypes.node,
}

export default DelayedRenderer
