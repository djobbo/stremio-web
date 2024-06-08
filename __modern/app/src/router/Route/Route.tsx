import type { ReactNode } from "react"

import { ModalsContainerProvider } from "../ModalsContainerContext"

type RouteProps = {
  children?: ReactNode
}

const Route = ({ children }: RouteProps) => {
  return (
    <div className="route-container">
      <ModalsContainerProvider>
        <div className="route-content">{children}</div>
      </ModalsContainerProvider>
    </div>
  )
}

export default Route
