// Copyright (C) 2017-2023 Smart code 203358507

import PropTypes from "prop-types"
import { forwardRef, useCallback } from "react"
import { TextInput } from "stremio/common"

const CredentialsTextInput = forwardRef((props, ref) => {
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
})

CredentialsTextInput.displayName = "CredentialsTextInput"

CredentialsTextInput.propTypes = {
  onKeyDown: PropTypes.func,
}

export default CredentialsTextInput
