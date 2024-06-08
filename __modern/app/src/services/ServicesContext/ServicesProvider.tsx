// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import ServicesContext from "./ServicesContext"

const ServicesProvider = ({ services = {}, children }) => {
  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  )
}

ServicesProvider.propTypes = {
  services: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

export default ServicesProvider
