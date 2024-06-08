// Copyright (C) 2017-2023 Smart code 203358507

import classnames from "classnames"
import type { ReactNode } from "react"
import { forwardRef } from "react"
import ReactDOM from "react-dom"
import { default as FocusLock } from "react-focus-lock"

import { useModalsContainer } from "../ModalsContainerContext"

type ModalProps = {
  className?: string
  autoFocus?: boolean
  disabled?: boolean
  children: ReactNode
}

const Modal = forwardRef(function Modal(
  { className, autoFocus, disabled, children, ...props }: ModalProps,
  ref,
) {
  const modalsContainer = useModalsContainer()
  return ReactDOM.createPortal(
    <FocusLock
      ref={ref}
      className={classnames(className, "modal-container")}
      autoFocus={!!autoFocus}
      disabled={!!disabled}
      lockProps={props}
    >
      {children}
    </FocusLock>,
    modalsContainer,
  )
})

Modal.displayName = "Modal"

export default Modal
