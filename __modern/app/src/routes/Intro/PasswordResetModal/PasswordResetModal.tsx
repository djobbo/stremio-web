import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ModalDialog } from "stremio/common"
import { useRouteFocused } from "stremio-router"

import CredentialsTextInput from "../CredentialsTextInput"
import styles from "./styles.module.less"

type PasswordResetModalProps = {
  email?: string
  onCloseRequest?: (...args: unknown[]) => unknown
}

const PasswordResetModal = ({
  email,
  onCloseRequest,
}: PasswordResetModalProps) => {
  const routeFocused = useRouteFocused()
  const [error, setError] = useState("")
  const emailRef = useRef(null)
  const goToPasswordReset = useCallback(() => {
    emailRef.current.value.length > 0 && emailRef.current.validity.valid
      ? window.open(
          "https://www.strem.io/reset-password/" + emailRef.current.value,
          "_blank",
        )
      : setError("Invalid email")
  }, [])
  const passwordResetModalButtons = useMemo(() => {
    return [
      {
        className: styles["cancel-button"],
        label: "Cancel",
        props: {
          onClick: onCloseRequest,
        },
      },
      {
        label: "Send",
        props: {
          onClick: goToPasswordReset,
        },
      },
    ]
  }, [onCloseRequest])
  const emailOnChange = useCallback(() => {
    setError("")
  }, [])
  useEffect(() => {
    if (routeFocused) {
      emailRef.current.focus()
    }
  }, [routeFocused])
  return (
    <ModalDialog
      className={styles["password-reset-modal-container"]}
      title="Password reset"
      buttons={passwordResetModalButtons}
      onCloseRequest={onCloseRequest}
    >
      <CredentialsTextInput
        ref={emailRef}
        className={styles["credentials-text-input"]}
        type="email"
        placeholder="Email"
        defaultValue={typeof email === "string" ? email : ""}
        onChange={emailOnChange}
        onSubmit={goToPasswordReset}
      />
      {error.length > 0 ? (
        <div className={styles["error-message"]}>{error}</div>
      ) : null}
    </ModalDialog>
  )
}

export default PasswordResetModal
