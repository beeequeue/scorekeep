// Hot loader must be imported first
import { hot } from 'react-hot-loader/root'
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ApolloProvider } from '@apollo/react-common'
import loadable, { LoadableComponent } from '@loadable/component'

import { client } from '@/apollo'
import { getUserFromCookie, UserContext } from '@/hooks/user'
import { Page } from '@/pages/constants'

const pages: Array<[Page, LoadableComponent<any>, boolean?]> = [
  [
    Page.LANDING,
    loadable(() =>
      import(/* webpackChunkName: "landing" */ './pages/boardgame/add'),
    ),
    true,
  ],
  [
    Page.LOGIN,
    loadable(() =>
      import(/* webpackChunkName: "login" */ './pages/connect/login'),
    ),
  ],
  [
    Page.CONNECT_FAILED,
    loadable(() =>
      import(/* webpackChunkName: "connect-failed" */ './pages/connect/failed'),
    ),
  ],
  [
    Page.ADD_MATCH,
    loadable(() =>
      import(/* webpackChunkName: "match-add" */ './pages/match/add'),
    ),
  ],
  [
    Page.ADD_BOARDGAME,
    loadable(() =>
      import(/* webpackChunkName: "boardgame-add" */ './pages/boardgame/add'),
    ),
  ],
]

const AppComponent = () => (
  <React.StrictMode>
    <ApolloProvider client={client}>
      <UserContext.Provider value={getUserFromCookie()}>
        <BrowserRouter>
          <Switch>
            {pages.map(([page, Component, exact]) => (
              <Route
                path={page}
                key={page}
                component={Component}
                exact={exact}
              />
            ))}
          </Switch>
        </BrowserRouter>
      </UserContext.Provider>
    </ApolloProvider>
  </React.StrictMode>
)

export const App = hot(AppComponent)
