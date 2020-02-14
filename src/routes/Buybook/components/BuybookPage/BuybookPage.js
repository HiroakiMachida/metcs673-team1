import React from 'react'
import Paper from '@material-ui/core/Paper'
import { useFirebase } from 'react-redux-firebase'
import { makeStyles } from '@material-ui/core/styles'
import { useNotifications } from 'modules/notification'
import BuybookForm from '../BuybookForm'
import styles from './BuybookPage.styles'

const useStyles = makeStyles(styles)

function BuybookPage() {
  const classes = useStyles()
  const firebase = useFirebase()
  const { showError } = useNotifications()

  function onSubmitFail(formErrs, dispatch, err) {
    showError(formErrs ? 'Form Invalid' : err.message || 'Error')
  }

  function emailBuybook(creds) {
    return firebase
      //TODO link to dashboad
      .catch(err => showError(err.message))
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.panel}>
        <BuybookForm onSubmit={emailBuybook} onSubmitFail={onSubmitFail} />
      </Paper>
    </div>
  )
}

export default BuybookPage
