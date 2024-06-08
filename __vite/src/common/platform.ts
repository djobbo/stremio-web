// Copyright (C) 2017-2023 Smart code 203358507

// this detects ipad properly in safari
// while bowser does not
function iOS() {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  )
}

import Bowser from "bowser"

const browser = Bowser.parse(window.navigator?.userAgent || "")

const name = iOS() ? "ios" : (browser?.os?.name || "unknown").toLowerCase()

const isMobile = () => {
  return name === "ios" || name === "android"
}

export { name, isMobile }
