import React from 'react'
import { Switch, Route } from 'react-router-dom'
// import CoreLayout from '../layouts/CoreLayout'
import Home from './Home'
import LoginRoute from './Login'
import SignupRoute from './Signup'
import ProjectsRoute from './Projects'
import WantingPostRoute from './WantingPost'
import PostListRoute from './PostList'
import DashboardRoute from './Dashboard'
import AccountRoute from './Account'
import NotFoundRoute from './NotFound'
import Dashboard from '../layouts/Dashborad/Dashboard'


export default function createRoutes(store) {
  return (
    <Dashboard>
      <Switch>
        <Route exact path={Home.path} component={() => <Home.component />} />
        {/* Build Route components from routeSettings */
        [
          AccountRoute,
          ProjectsRoute,
          SignupRoute,
          WantingPostRoute,
          PostListRoute,
          DashboardRoute,
          LoginRoute,
          /* Add More Routes Here */
        ].map((settings, index) => (
          <Route key={`Route-${index}`} {...settings} />
        ))}
        <Route component={NotFoundRoute.component} />
      </Switch>
    </Dashboard>
  )
}
