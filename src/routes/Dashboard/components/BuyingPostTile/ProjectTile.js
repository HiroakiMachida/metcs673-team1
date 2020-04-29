import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useFirebase } from 'react-redux-firebase'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import RateReviewIcon from '@material-ui/icons/RateReview';
import { makeStyles } from '@material-ui/core/styles'
import useNotifications from 'modules/notification/useNotifications'
import styles from './ProjectTile.styles'
import NewReviewDialog from '../NewReviewDialog'
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles(styles)

function ProjectTile({ name, title, category, isbn, status, delivery_status, createdBy, price, projectId, showDelete, attached, reviewText, book, recipient, address,}) {
  const classes = useStyles()
  const firebase = useFirebase()
  const { showError, showSuccess } = useNotifications()

  // New dialog
  const [newDialogOpen, changeDialogState] = useState(false)
  const toggleDialog = () => changeDialogState(!newDialogOpen)
  
  function submitReviewForBook(params) {
    var newNotificationsSellerKey = firebase.database().ref().child('notifications').push().key;
    var updates = {};
    updates['/books/'+projectId] = {
      ...book.value,
      delivery_status: 'review_submitted',
      reviewText: params.reviewText
    };
    updates['/notifications/' + newNotificationsSellerKey] = {
      userId: book.value.createdBy,
      body: `"${book.value.title}" review submitted.`,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    };

    return firebase.database().ref().update(updates)
      .then(() => showSuccess('Book review submitted successfully'))
      .catch(err => {
        console.error('Error:', err) // eslint-disable-line no-console
        showError(err.message || 'Could not submit book review')
        return Promise.reject(err)
      })
  }

  function updateProject() {
    var newNotificationsSellerKey = firebase.database().ref().child('notifications').push().key;
    var updates = {};
    updates['/books/'+projectId] = {
      ...book.value,
      delivery_status: 'received'
    };
    updates['/notifications/' + newNotificationsSellerKey] = {
      userId: book.value.createdBy,
      body: `"${book.value.title}" received.`,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    };
    return firebase.database().ref().update(updates)
      .then(() => showSuccess('Book received successfully'))
      .catch(err => {
        console.error('Error:', err) // eslint-disable-line no-console
        showError(err.message || 'Could not update book')
        return Promise.reject(err)
      })
  }

  function showBookReviewDialog(){
    toggleDialog()
  }

  return (
    <Paper className={classes.root}>
      <NewReviewDialog
        onSubmit={submitReviewForBook}
        bookId={projectId}
        open={newDialogOpen}
        onRequestClose={toggleDialog}
        title={title}
        isbn={isbn}
        status={status}
      />

      <div className={classes.top}>
        
        {delivery_status==='received' ? (
          <Tooltip title="Submit Review">
            <IconButton onClick={showBookReviewDialog}>
              <RateReviewIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </div>
      <div className={classes.top}>
        {attached ? (<img src={attached} height="50" width="50" alt="cover" style={{marginBottom: '10px'}}/>):''}
        {delivery_status==='shipping' ? (
          <Tooltip title="received">
            <IconButton onClick={updateProject}>
              <MenuBookIcon />
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
              <Chip size="small" label="Category"  />  
            </th>
            <th>
             {category || 'No Category'}
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
              {price ? '$'+ price : 'No Price'}
            </th>
          </tr>
          {delivery_status==="sold" || delivery_status==="shipping"  || delivery_status==="received" || delivery_status==="review_submitted" ? (
            <tr>
              <th>
                <Chip size="small" label="Recipient"  color="secondary"/>  
              </th>
              <th>
                {recipient || 'No Recipient'}
              </th>
            </tr>
          ) : null}
          {delivery_status==="sold" || delivery_status==="shipping" || delivery_status==="received" || delivery_status==="review_submitted" ? (
            <tr>
              <th>
                <Chip size="small" label="Address"  color="secondary"/>  
              </th>
              <th>
                {address || 'No Address'}
              </th>
            </tr>
          ) : null}
          {delivery_status==="review_submitted" ? (
            <tr>
              <th>
                <Chip size="small" label="Review" color="primary" />  
              </th>
              <th>
                {reviewText || 'No Review Submitted'}
              </th>
            </tr>
          ) : null}
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
