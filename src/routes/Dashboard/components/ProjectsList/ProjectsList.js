import React from 'react';
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
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { POST_LIST_PATH } from 'constants/paths'
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom'
import Divider from '@material-ui/core/Divider';



const useStyles = makeStyles(styles)

function ProjectsList() {
  const classes = useStyles()
  const history = useHistory()



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
      <form action="/posts/" style={{ display: "inline-flex"}}>
        <TextField name="title" label="search" margin="normal" variant="outlined" style={{ width: 300,background: "white" } } />
        <Button type="submit" variant="contained" color="primary" style={{ margin: "15px",marginTop:"21px"}}>Search</Button>
      </form>   

      
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <h1>Notifications</h1>
            {!isEmpty(notifications) &&
              notifications.map((notification, ind) => {
                return (
                  <Alert severity="info" style={{ marginTop: "5px", marginBottom: "5px"}}>{notification.value.body}</Alert>
                )
              })}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <h1>Sell textbooks to market</h1>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              1. Selling
              <Button onClick={() => history.push(`${POST_LIST_PATH}`) }>
                Go To Book Selling Page
              </Button>
            </Typography>
            <SellingList/>
            <Divider style={{ marginTop: "30px"}}/>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              2. Sold</Typography> Confirm payment, ship and click "shipped" button.
            <SellingList delivery_status='sold'/>
            <Divider style={{ marginTop: "30px"}}/>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              3. Shipping now</Typography>
            <SellingList delivery_status='shipping'/>
            <Divider style={{ marginTop: "30px"}}/>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              4. Received by buyer</Typography>
            <SellingList delivery_status='received'/>
            <SellingList delivery_status='review_submitted'/>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <h1>Buy textbooks from market</h1>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              1. Purchased</Typography>
            <BuyingList />
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              2. Shpping now</Typography> When received, click "received" button.
            <BuyingList />
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              3. Received</Typography>
            <BuyingList />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <WantingList/>
          </Paper>
        </Grid>
      </Grid>

      
    </div>
  )
}

export default ProjectsList