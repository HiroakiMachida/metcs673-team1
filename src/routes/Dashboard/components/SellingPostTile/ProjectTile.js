import React from 'react'
import PropTypes from 'prop-types'
import { useFirebase } from 'react-redux-firebase'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Tooltip from '@material-ui/core/Tooltip'
import LocalShippingIcon from '@material-ui/icons/LocalShipping'
import { makeStyles } from '@material-ui/core/styles'
import useNotifications from 'modules/notification/useNotifications'
import styles from './ProjectTile.styles'
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles(styles)

function ProjectTile({ name, title, category, isbn, status, delivery_status, buyer_id, price, projectId, showDelete, attached, recipient, address, reviewText, book}) {
  const classes = useStyles()
  const firebase = useFirebase()
  const { showError, showSuccess } = useNotifications()

  function updateProject() {

    var newNotificationsBuyerKey = firebase.database().ref().child('notifications').push().key;

    var updates = {};
    updates['/books/'+projectId] = {
      ...book.value,
      delivery_status: 'shipping'
    };
    updates['/notifications/' + newNotificationsBuyerKey] = {
      userId: book.value.buyer_id,
      body: `"${book.value.title}" shipped.`,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    };

    return firebase.database().ref().update(updates)
    .then(() => showSuccess('Post updated successfully'))
    .catch(err => {
      console.error('Error:', err) // eslint-disable-line no-console
      showError(err.message || 'Could not update post')
      return Promise.reject(err)
    })
  }


  function deleteBook() {
    return firebase
      .remove(`books/${projectId}`)
      .then(() => showSuccess('Book deleted successfully'))
      .catch(err => {
        console.error('Error:', err) // eslint-disable-line no-console
        showError(err.message || 'Could not delete book')
        return Promise.reject(err)
      })
  }

  return (
    <Paper className={classes.root}>
        {console.log( " DS : "  + delivery_status)}
      <div className={classes.top}>
        {attached ? (<img src={attached} height="50" width="50" alt="cover" style={{marginBottom: '10px'}}/>):''}
        {!delivery_status ? (
          <Tooltip title="delete">
            <IconButton onClick={deleteBook}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : null}
        {delivery_status==="sold" ? (
          <Tooltip title="shipped">
            <IconButton onClick={updateProject}>
              <LocalShippingIcon />
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
