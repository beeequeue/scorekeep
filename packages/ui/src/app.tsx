// Hot loader must be imported first
import { hot } from 'react-hot-loader/root'
import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ApolloProvider } from '@apollo/react-common'
import loadable from '@loadable/component'

import { client } from '@/apollo'
import { Page } from '@/pages/constants'

const LandingPage = loadable(() =>
  import(/* webpackChunkName: "landing" */ './pages/landing/landing'),
)

const AppComponent = () => (
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path={Page.LANDING}
            key={Page.LANDING}
            component={LandingPage}
          />
        </Switch>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
)

export const App = hot(AppComponent)
