// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import { ModalsContainerProvider } from "../ModalsContainerContext"

const Route = ({ children }) => {
  return (
    <div className={"route-container"}>
      <ModalsContainerProvider>
        <div className={"route-content"}>{children}</div>
      </ModalsContainerProvider>
    </div>
  )
}

Route.propTypes = {
  children: PropTypes.node,
}

export default Route
