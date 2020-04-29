import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useFirebase } from 'react-redux-firebase'
import useNotifications from 'modules/notification/useNotifications'

import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'
import styles from './ProjectTile.styles'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import BuyBookDialog from '../BuyBookDialog'
import Chip from '@material-ui/core/Chip';


const useStyles = makeStyles(styles);


function ProjectTile({ name, title, isbn, status, price, projectId, showDelete, attached,  changeBook, project,sellerId ,users,auth}) {
  const classes = useStyles()
  const firebase = useFirebase()
  const { showError, showSuccess } = useNotifications()



  // New dialog
  const [newDialogOpen, changeDialogState] = useState(false)
  const toggleDialog = () => changeDialogState(!newDialogOpen)


  // function goToProject() {
  //   //TODO
  //   //return history.push(`${BUYBOOK_PATH}?isbn=${isbn}&name=${name}&title=${title}&status=${status}&price=${price}`)
  // }


  function submitBuyBook(params){

    var newNotificationsSellerKey = firebase.database().ref().child('notifications').push().key;
    var newNotificationsBuyerKey = firebase.database().ref().child('notifications').push().key;

    console.log(params)
    var updates = {};
    updates['/books/'+projectId] = {
      ...project.value,
      buyer_id: auth.uid,
      delivery_status: 'sold',
      recipient: params.recipient,
      address: params.address,
    };
    updates['/notifications/' + newNotificationsSellerKey] = {
      userId: sellerId,
      body: `"${title}" sold.`,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    };
    updates['/notifications/' + newNotificationsBuyerKey] = {
      userId: auth.uid,
      body: `You bought "${title}".`,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    };

    return firebase.database().ref().update(updates)
    .then(() => {
      toggleDialog()
      showSuccess('Bought it successfully')
      window.location.href = "/dashboard";
    })
    .catch(err => {
      console.error('Error:', err) // eslint-disable-line no-console
      showError(err.message || 'Could not add project')
      return Promise.reject(err)
    })
  }

  function showBuyBookDialog(){
    toggleDialog()
  }

  return (
    <Paper className={classes.root}>
      <BuyBookDialog
        onSubmit={submitBuyBook}
        open={newDialogOpen}
        onRequestClose={toggleDialog}
        book={project}
        users={users}
        title={title}
        isbn={isbn}
        status={status}
        price={price}
        sellerId={project.value.c}
      />
      <div className={classes.top} style={{ marginBottom: "15px"}} >
        {attached ? (<img src={attached} height="50" width="50" alt="cover" />):''}
        {showDelete ? (
          <Tooltip title="buy">
            <IconButton onClick={ showBuyBookDialog }>
              <ShoppingCartIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </div>
      <table  style={{ marginRight: "10px", textAlign: 'left'}}>
        <tbody>
          <tr>
            <th>
              <Chip size="small" label="Title" />
            </th>
            <th>
              {title || 'No Title'}
            </th>
          </tr>
          <tr>
            <th>
              <Chip size="small" label="ISBN"  />  
            </th>
            <th>
                {isbn || 'No ISBN'}
            </th>
          </tr>
          <tr>
            <th>
              <Chip size="small" label="Status"  />  
            </th>
            <th>
              {status || 'No Status'}
            </th>
          </tr>
          <tr>
            <th>
              <Chip size="small" label="Price" />  
            </th>
            <th>
              {'$'+ price || 'No Price'}
            </th>
          </tr>
        </tbody>
      </table>
    </Paper>
  )
}

ProjectTile.propTypes = {
  projectId: PropTypes.string.isRequired,
  showDelete: PropTypes.bool,
  name: PropTypes.string
}

ProjectTile.defaultProps = {
  showDelete: true
}

export default ProjectTile
