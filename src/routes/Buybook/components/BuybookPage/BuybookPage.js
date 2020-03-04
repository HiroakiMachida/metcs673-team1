import React from 'react'
import Paper from '@material-ui/core/Paper'
import { useFirebase } from 'react-redux-firebase'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { useNotifications } from 'modules/notification'
import BuybookForm from '../BuybookForm'
import styles from './BuybookPage.styles'
import { DASHBOARD_PATH } from 'constants/paths'

const useStyles = makeStyles(styles)

function BuybookPage() {
  const classes = useStyles()
  const firebase = useFirebase()
  const { showError } = useNotifications()
  const history = useHistory()

  function onSubmitFail(formErrs, dispatch, err) {
    showError(formErrs ? 'Form Invalid' : err.message || 'Error')
  }

  function buybook(creds) {
    return history.push(`${DASHBOARD_PATH}`)
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.panel}>
        <BuybookForm onSubmit={buybook} onSubmitFail={onSubmitFail} />
      </Paper>
    </div>
  )
}

export default BuybookPage
