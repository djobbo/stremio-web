import ModalsContainerContext from "./ModalsContainerContext"
import { ReactNode, useState } from "react"

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
