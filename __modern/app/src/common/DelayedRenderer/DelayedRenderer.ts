import type { ReactNode } from "react"
import { useEffect, useState } from "react"

type DelayedRendererProps = {
  children?: ReactNode
  delay: number
}

const DelayedRenderer = ({ children, delay }: DelayedRendererProps) => {
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

export default DelayedRenderer
