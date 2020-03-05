import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useFirebase } from 'react-redux-firebase'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'
import Tooltip from '@material-ui/core/Tooltip'
import LocalShippingIcon from '@material-ui/icons/LocalShipping'
import { makeStyles } from '@material-ui/core/styles'
import { LIST_PATH } from 'constants/paths'
import useNotifications from 'modules/notification/useNotifications'
import styles from './ProjectTile.styles'

const useStyles = makeStyles(styles)

function ProjectTile({ name, title, isbn, status, delivery_status, buyer_id, price, projectId, showDelete, attached, recepient, address, reviewText}) {
  const classes = useStyles()
  const history = useHistory()
  const firebase = useFirebase()
  const { showError, showSuccess } = useNotifications()

  function goToProject() {
    return history.push(`${LIST_PATH}/${projectId}`)
  }

  function updateProject() {
    return firebase
      .update(`books/${projectId}`, { delivery_status: 'shipping' })
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
    <Paper className={classes.root}
      style={delivery_status==='received'?{background:"grey"}:{}}
    >
      <div className={classes.top}>
        <span className={classes.delivery_status} onClick={goToProject} >
          {delivery_status==='received' ? 'Received by buyer.' : ''}
        </span>
      </div>
      <div className={classes.top}>
        <span className={classes.delivery_status} onClick={goToProject} style={{color:"red"}}>
          {delivery_status==='sold' ? 'Sold! Confirm payment, ship, and click "shipped"!': ''}
          {delivery_status==='sold' ? <br/>: ''}
          {delivery_status==='sold' ? recepient: ''}
          {delivery_status==='sold' ? <br/>: ''}
          {delivery_status==='sold' ? address: ''}
          {delivery_status==='shipping' ? 'Shipping now' : ''}
          
          {console.log( " DS : "  + delivery_status)}
        </span>
      </div>
      <div className={classes.top}>
        {attached ? (<img src={attached} height="50" width="50" alt="cover"/>):''}
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
      {delivery_status==="review_submitted" ? (
          <div className={classes.top}>
          <span className={classes.price} onClick={goToProject}>
            {reviewText || 'No Review Submitted'}<br/>
            
          </span>
        </div>
        ) : null}
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
