import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import styles from './ProjectsList.styles'
import WantingList from '../WantingList'
import SellingList from '../SellingList'
import BuyingList from '../BuyingList'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Alert from '@material-ui/lab/Alert';
import { useSelector } from 'react-redux'
import {
  // useFirebase,
  useFirebaseConnect,
  isEmpty
} from 'react-redux-firebase'

const useStyles = makeStyles(styles)

function ProjectsList() {
  const classes = useStyles()

  // const firebase = useFirebase()
  const auth = useSelector(state => state.firebase.auth)
  
  useFirebaseConnect([
    {
      path: 'notifications',
      queryParams: [
        'orderByChild=userId',
        `equalTo=${auth.uid}`,
        'limitToLast=5'
      ]
    }
  ])
  const notifications = useSelector(state => state.firebase.ordered.notifications)

  console.log(notifications)

  return (
    <div className={classes.root}>
      {!isEmpty(notifications) &&
          notifications.map((notification, ind) => {
            return (
              <Alert severity="info" style={{ marginTop: "30px"}}>{notification.value.body}</Alert>
            )
      })}
      <form action="/posts/" style={{ display: "inline-flex"}}>
            <TextField name="title" label="search" margin="normal" variant="outlined" style={{ width: 300,background: "white" } } />
        <Button type="submit" variant="contained" color="primary" style={{ margin: "15px",marginTop:"21px"}}>Search</Button>
      </form>   
      <WantingList/>
      <SellingList/>
      <BuyingList />
    </div>
  )
}

export default ProjectsList