import { forwardRef, useCallback } from "react"
import { TextInput } from "stremio/common"

type CredentialsTextInputProps = {
  onKeyDown?: (...args: unknown[]) => unknown
}

const CredentialsTextInput = forwardRef<HTMLElement, CredentialsTextInputProps>(
  (props, ref) => {
    const onKeyDown = useCallback(
      (event) => {
        if (typeof props.onKeyDown === "function") {
          props.onKeyDown(event)
        }

        if (!event.nativeEvent.navigationPrevented) {
          if (
            ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
              event.key,
            )
          ) {
            event.nativeEvent.spatialNavigationPrevented = true
          }

          if (!event.shiftKey) {
            if (event.key === "ArrowDown") {
              window.navigate("down")
            } else if (event.key === "ArrowUp") {
              window.navigate("up")
            }
          }
        }
      },
      [props.onKeyDown],
    )
    return <TextInput {...props} ref={ref} onKeyDown={onKeyDown} />
  },
)

CredentialsTextInput.displayName = "CredentialsTextInput"

export default CredentialsTextInput
