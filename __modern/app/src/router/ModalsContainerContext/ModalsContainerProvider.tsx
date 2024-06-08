import type { ReactNode } from "react"
import { useState } from "react"

import ModalsContainerContext from "./ModalsContainerContext"

type ModalsContainerProviderProps = {
  children?: ReactNode
}

const ModalsContainerProvider = ({
  children,
}: ModalsContainerProviderProps) => {
  const [container, setContainer] = useState(null)
  return (
    <ModalsContainerContext.Provider value={container}>
      {container instanceof HTMLElement ? children : null}
      <div ref={setContainer} className="modals-container" />
    </ModalsContainerContext.Provider>
  )
}

export default ModalsContainerProvider
