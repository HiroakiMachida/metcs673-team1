import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useFirebase } from 'react-redux-firebase'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import RateReviewIcon from '@material-ui/icons/RateReview';
import { makeStyles } from '@material-ui/core/styles'
import { LIST_PATH } from 'constants/paths'
import useNotifications from 'modules/notification/useNotifications'
import styles from './ProjectTile.styles'
import { useSelector } from 'react-redux'
import NewReviewDialog from '../NewReviewDialog'

const useStyles = makeStyles(styles)

function ProjectTile({ name, title, isbn, status, delivery_status, createdBy, price, projectId, showDelete, attached }) {
  const classes = useStyles()
  const history = useHistory()
  const firebase = useFirebase()
  const { showError, showSuccess } = useNotifications()

  // New dialog
  const [newDialogOpen, changeDialogState] = useState(false)
  const toggleDialog = () => changeDialogState(!newDialogOpen)
  
  function submitReviewForBook(params) {
    
    return firebase
      .update(`books/${params.bookId}`, { delivery_status: 'review_submitted', reviewText: params.reviewText})
      .then(() => showSuccess('Book review submitted successfully'))
      .catch(err => {
        console.error('Error:', err) // eslint-disable-line no-console
        showError(err.message || 'Could not submit book review')
        return Promise.reject(err)
      })
  }
  
  function goToProject() {
    return history.push(`${LIST_PATH}/${projectId}`)
  }

  // function deleteProject() {
  //   return firebase
  //     .remove(`projects/${projectId}`)
  //     .then(() => showSuccess('Project deleted successfully'))
  //     .catch(err => {
  //       console.error('Error:', err) // eslint-disable-line no-console
  //       showError(err.message || 'Could not delete project')
  //       return Promise.reject(err)
  //     })
  // }

  function updateProject() {
    return firebase
      .update(`books/${projectId}`, { delivery_status: 'received' })
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
    <Paper className={classes.root}
      style={delivery_status==='received'?{background:"grey"}:{}}
    >
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
        <span className={classes.delivery_status} onClick={goToProject}>
          {delivery_status==="received" ? 'Received already.' : ''}
        </span>
      </div>
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
        <span className={classes.delivery_status} onClick={goToProject} style={{color:"red"}}>
        {delivery_status==="shipping" ? 'Shipping now! Click "received" when received.' : ''}
        </span>
      </div>
      <div className={classes.top}>
        {attached ? (<img src={attached} height="50" width="50" alt="cover" />):''}
        {delivery_status==='shipping' ? (
          <Tooltip title="received">
            <IconButton onClick={updateProject}>
              <MenuBookIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </div>
      <div className={classes.top}>
        <span className={classes.title} onClick={goToProject}>
          {title || 'No Name'}
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
