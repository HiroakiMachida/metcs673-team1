import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useFirebase } from 'react-redux-firebase'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import LocalShippingIcon from '@material-ui/icons/LocalShipping'
import { makeStyles } from '@material-ui/core/styles'
import { LIST_PATH } from 'constants/paths'
import useNotifications from 'modules/notification/useNotifications'
import styles from './ProjectTile.styles'

const useStyles = makeStyles(styles)

function ProjectTile({ name, title, isbn, status, delivery_status, buyer_id, price, projectId, showDelete }) {
  const classes = useStyles()
  const history = useHistory()
  const firebase = useFirebase()
  const { showError, showSuccess } = useNotifications()

  function goToProject() {
    return history.push(`${LIST_PATH}/${projectId}`)
  }

  function deleteProject() {
    return firebase
      .remove(`projects/${projectId}`)
      .then(() => showSuccess('Project deleted successfully'))
      .catch(err => {
        console.error('Error:', err) // eslint-disable-line no-console
        showError(err.message || 'Could not delete project')
        return Promise.reject(err)
      })
  }

  function updateProject() {
    return firebase
      .update(`books/${projectId}`, { delivery_status: 'shipped' })
      .then(() => showSuccess('Post updated successfully'))
      .catch(err => {
        console.error('Error:', err) // eslint-disable-line no-console
        showError(err.message || 'Could not update post')
        return Promise.reject(err)
      })
  }

  return (
    <Paper className={classes.root} style={delivery_status ? {background: "grey"} : {}}>
      <div className={classes.top}>
        <span className={classes.name} onClick={goToProject}>
          {name || 'No Name'}
        </span>
        {showDelete ? (
          <Tooltip title="shipped">
            <IconButton onClick={updateProject}>
              <LocalShippingIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </div>
      <div className={classes.top}>
        <span className={classes.title} onClick={goToProject}>
          Title: {title || 'No Name'}
        </span>
      </div>
      <div className={classes.top}>
        <span className={classes.isbn} onClick={goToProject}>
          ISBN: {isbn || 'No ISBN'}
        </span>
      </div>
      <div className={classes.top}>
        <span className={classes.status} onClick={goToProject}>
          Status: {status || 'No Status'}
        </span>
      </div>
      <div className={classes.top}>
        <span className={classes.price} onClick={goToProject}>
          Price: {price || 'No Price'}
        </span>
      </div>
      <div className={classes.top}>
        <span className={classes.buyer_id} onClick={goToProject}>
          Buyer: {buyer_id || 'No Buyer'}
        </span>
      </div>
      <div className={classes.top}>
        <span className={classes.delivery_status} onClick={goToProject}>
          {delivery_status ? `Delivery status:${delivery_status}` : ''}
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
