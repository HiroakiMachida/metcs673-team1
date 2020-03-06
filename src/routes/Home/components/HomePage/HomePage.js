import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import {
  DASHBOARD_PATH,
  LOGIN_PATH,
  SIGNUP_PATH
} from 'constants/paths'
import styles from './HomePage.styles'

const useStyles = makeStyles(styles)

function Home() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className="flex-row-center">
        <h2>For users</h2>
      </div>
      <div className="flex-row-center">
        <div className={classes.section}>
          <h3>Concept</h3>
          Users can buy & sell used textbooks<br/>
          <img src={ require('static/concept.png') } alt="concept"/><br/>
          User A posts textbook for selling<br/>
          User B buys textbook<br/>
          User A ships textbook<br/>
          User B receives textbook!<br/>
        </div>
        <div className={classes.section}>
          <h4>How to use</h4>
          
          <a href="https://github.com/HiroakiMachida/metcs673-team1/tree/master/docs">
          User manual
          </a>
        </div>
        <div className={classes.section}>
          <h4>Start here</h4>
          <Link to={SIGNUP_PATH}>Signup</Link>
          <Link to={LOGIN_PATH}>Login</Link>
          <Link to={DASHBOARD_PATH}>Dashboard</Link>
        </div>
      </div>
      <div className="flex-row-center">
        <h2>For developers</h2>
      </div>
      <div className="flex-row-center">
        <div className={classes.section}>
          <h4>GitHub</h4>
          <a href="https://github.com/HiroakiMachida/metcs673-team1">
          metcs673-team1
          </a>
        </div>
      </div>
      <div className="flex-row-center">
        <div className={classes.section}>
          <h4>Cypress</h4>
          <a href="http://team1.work/cypress/log">
          Test log
          </a>
          <a href="http://team1.work/cypress/screenshots/">
          Screenshots
          </a>
          <a href="http://team1.work/cypress/videos/">
          Videos
          </a><br/>
          <span>from&nbsp;
          <a href="http://team1.work/cypress/">
          Cypress folder
          </a></span>
        </div>
      </div>
    </div>
  )
}

export default Home
