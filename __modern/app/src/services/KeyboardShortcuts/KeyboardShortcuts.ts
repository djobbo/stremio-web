// Copyright (C) 2017-2023 Smart code 203358507

import EventEmitter from "eventemitter3"

function KeyboardShortcuts() {
  let active = false

  const events = new EventEmitter()

  function onKeyDown(event) {
    if (
      event.keyboardShortcutPrevented ||
      event.target.tagName === "INPUT" ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey ||
      event.metaKey
    ) {
      return
    }

    switch (event.code) {
      case "Digit0": {
        event.preventDefault()
        // @ts-expect-error we can set window.location as a string
        window.location = "#/search"
        break
      }
      case "Digit1": {
        event.preventDefault()
        // @ts-expect-error we can set window.location as a string
        window.location = "#/"
        break
      }
      case "Digit2": {
        event.preventDefault()
        // @ts-expect-error we can set window.location as a string
        window.location = "#/discover"
        break
      }
      case "Digit3": {
        event.preventDefault()
        // @ts-expect-error we can set window.location as a string
        window.location = "#/library"
        break
      }
      case "Digit4": {
        event.preventDefault()
        // @ts-expect-error we can set window.location as a string
        window.location = "#/addons"
        break
      }
      case "Digit5": {
        event.preventDefault()
        // @ts-expect-error we can set window.location as a string
        window.location = "#/settings"
        break
      }
      case "Backspace": {
        event.preventDefault()
        if (event.ctrlKey) {
          window.history.forward()
        } else {
          window.history.back()
        }

        break
      }
      case "KeyF": {
        event.preventDefault()
        if (document.fullscreenElement === document.documentElement) {
          document.exitFullscreen()
        } else {
          document.documentElement.requestFullscreen()
        }

        break
      }
    }
  }
  function onStateChanged() {
    events.emit("stateChanged")
  }

  Object.defineProperties(this, {
    active: {
      configurable: false,
      enumerable: true,
      get: function () {
        return active
      },
    },
  })

  this.start = function () {
    if (active) {
      return
    }

    window.addEventListener("keydown", onKeyDown)
    active = true
    onStateChanged()
  }
  this.stop = function () {
    window.removeEventListener("keydown", onKeyDown)
    active = false
    onStateChanged()
  }
}

export default KeyboardShortcuts
