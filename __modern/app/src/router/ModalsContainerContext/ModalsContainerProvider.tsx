// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import ModalsContainerContext from "./ModalsContainerContext"
import { useState } from "react"

const ModalsContainerProvider = ({ children }) => {
  const [container, setContainer] = useState(null)
  return (
    <ModalsContainerContext.Provider value={container}>
      {container instanceof HTMLElement ? children : null}
      <div ref={setContainer} className="modals-container" />
    </ModalsContainerContext.Provider>
  )
}

ModalsContainerProvider.propTypes = {
  children: PropTypes.node,
}

export default ModalsContainerProvider
