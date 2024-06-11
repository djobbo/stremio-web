import type { ReactNode } from "react"

import ServicesContext from "./ServicesContext"

type ServicesProviderProps = {
  services?: object
  children?: ReactNode[] | ReactNode
}

const ServicesProvider = ({
  services = {},
  children,
}: ServicesProviderProps) => {
  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  )
}

export default ServicesProvider
