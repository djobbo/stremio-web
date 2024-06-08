// Copyright (C) 2017-2023 Smart code 203358507

import { useCallback, useMemo, useState } from "react"

const useMetaExtensionTabs = (metaExtensions) => {
  const tabs = useMemo(() => {
    return metaExtensions.map((extension) => ({
      id: extension.url,
      label: extension.addon.manifest.name,
      logo: extension.addon.manifest.logo,
      icon: "addons",
      onClick: () => setSelected(extension),
    }))
  }, [metaExtensions])
  const [selected, setSelected] = useState(null)
  const clear = useCallback(() => {
    setSelected(null)
  }, [])
  return [tabs, selected, clear]
}

export default useMetaExtensionTabs
