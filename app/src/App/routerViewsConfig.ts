// Copyright (C) 2017-2023 Smart code 203358507

import { routesRegexp } from "stremio/common"
import * as routes from "stremio/routes"

const routerViewsConfig = [
  [
    {
      ...routesRegexp.board,
      component: routes.Board,
    },
  ],
  [
    {
      ...routesRegexp.intro,
      component: routes.Intro,
    },
    {
      ...routesRegexp.discover,
      component: routes.Discover,
    },
    {
      ...routesRegexp.library,
      component: routes.Library,
    },
    {
      ...routesRegexp.continuewatching,
      component: routes.Library,
    },
    {
      ...routesRegexp.search,
      component: routes.Search,
    },
  ],
  [
    {
      ...routesRegexp.metadetails,
      component: routes.MetaDetails,
    },
  ],
  [
    {
      ...routesRegexp.addons,
      component: routes.Addons,
    },
    {
      ...routesRegexp.settings,
      component: routes.Settings,
    },
  ],
  [
    {
      ...routesRegexp.player,
      component: routes.Player,
    },
  ],
]

export default routerViewsConfig
