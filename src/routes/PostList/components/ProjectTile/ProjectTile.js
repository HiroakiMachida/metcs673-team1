import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useFirebase } from 'react-redux-firebase'
import useNotifications from 'modules/notification/useNotifications'

import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import { makeStyles } from '@material-ui/core/styles'
import styles from './ProjectTile.styles'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import BuyBookDialog from '../BuyBookDialog'


const useStyles = makeStyles(styles)

function ProjectTile({ name, title, isbn, status, price, projectId, showDelete, attached,  changeBook, project,sellerId ,users,auth}) {
  const classes = useStyles()
  const history = useHistory()
  const firebase = useFirebase()
  const { showError, showSuccess } = useNotifications()



  // New dialog
  const [newDialogOpen, changeDialogState] = useState(false)
  const toggleDialog = () => changeDialogState(!newDialogOpen)


  function goToProject() {
    //TODO
    //return history.push(`${BUYBOOK_PATH}?isbn=${isbn}&name=${name}&title=${title}&status=${status}&price=${price}`)
  }


  function submitBuyBook(params){

    var newNotificationsSellerKey = firebase.database().ref().child('notifications').push().key;
    var newNotificationsBuyerKey = firebase.database().ref().child('notifications').push().key;


    var updates = {};
    updates['/books/'+projectId] = {
      ...project.value,
      buyer_id: auth.uid,
      delivery_status: 'sold'
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
      <div className={classes.top}>
        {attached ? (<img src={attached} height="50" width="50" alt="cover" />):''}
        {showDelete ? (
          <Tooltip title="buy">
            <IconButton onClick={ showBuyBookDialog }>
              <ShoppingCartIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </div>
      <div className={classes.top}>
        <span className={classes.title} onClick={goToProject}>
          {title || 'No Title'}
        </span>
      </div>
      <div className={classes.top}>
        <span className={classes.isbn} onClick={goToProject}>
          {isbn || 'No ISBN'}
        </span>
      </div>
      <div className={classes.top}>
        <span className={classes.status} onClick={goToProject}>
          {status || 'No Status'}
        </span>
      </div>
      <div className={classes.top}>
        <span className={classes.price} onClick={goToProject}>
          {price || 'No Price'}
        </span>
      </div>
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
