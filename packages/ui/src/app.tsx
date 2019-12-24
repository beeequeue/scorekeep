// Hot loader must be imported first
import { hot } from 'react-hot-loader/root'
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ApolloProvider } from '@apollo/react-common'
import loadable from '@loadable/component'

import { client } from '@/apollo'
import { Page } from '@/pages/constants'

const AddMatchPage = loadable(() =>
  import(/* webpackChunkName: "match-add" */ './pages/match/add'),
)
const AddBoardgamePage = loadable(() =>
  import(/* webpackChunkName: "boardgame-add" */ './pages/boardgame/add'),
)

const AppComponent = () => (
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path={Page.ADD_MATCH}
            key={Page.ADD_MATCH}
            component={AddMatchPage}
          />
          <Route
            exact
            path={Page.ADD_BOARDGAME}
            key={Page.ADD_BOARDGAME}
            component={AddBoardgamePage}
          />
        </Switch>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
)

export const App = hot(AppComponent)
