import type { ReactNode } from "react"
import { useCallback, useMemo, useReducer, useState } from "react"

import ToastContext from "./ToastContext"
import ToastItem from "./ToastItem"

const DEFAULT_TIMEOUT = 3000

type ToastProviderProps = {
  className?: string
  children?: ReactNode
}

const ToastProvider = ({ className, children }: ToastProviderProps) => {
  const [container, setContainer] = useState(null)
  const [items, dispatch] = useReducer((items, action) => {
    switch (action.type) {
      case "add":
        return items.concat(action.item)
      case "remove":
        return items.filter((item) => item.id !== action.id)
      case "clear":
        return []
      default:
        return items
    }
  }, [])
  const itemOnClose = useCallback((event) => {
    clearTimeout(event.dataset.id)
    dispatch({ type: "remove", id: event.dataset.id })
  }, [])
  const toast = useMemo(() => {
    const filters = []

    return {
      addFilter: (filter) => {
        filters.push(filter)
      },
      removeFilter: (filter) => {
        const index = filters.indexOf(filter)

        if (index > -1) {
          filters.splice(index, 1)
        }
      },
      show: (item) => {
        if (filters.some((filter) => filter(item))) {
          return
        }

        const timeout =
          typeof item.timeout === "number" && !isNaN(item.timeout)
            ? item.timeout
            : DEFAULT_TIMEOUT
        const id = setTimeout(() => {
          dispatch({ type: "remove", id })
        }, timeout)

        dispatch({
          type: "add",
          item: {
            ...item,
            id,
            dataset: {
              ...item.dataset,
              id,
            },
            onClose: itemOnClose,
          },
        })
      },
      clear: () => {
        dispatch({ type: "clear" })
      },
    }
  }, [])

  return (
    <ToastContext.Provider value={toast}>
      {container instanceof HTMLElement ? children : null}
      <div ref={setContainer} className={className}>
        {items.map((item, index) => (
          <ToastItem key={index} {...item} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
