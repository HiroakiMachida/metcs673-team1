import React from 'react'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'
import { useFirebase } from 'react-redux-firebase'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import { makeStyles } from '@material-ui/core/styles'
import { LIST_PATH } from 'constants/paths'
import useNotifications from 'modules/notification/useNotifications'
import styles from './ProjectTile.styles'
import { BUYBOOK_PATH } from 'constants/paths'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'


const useStyles = makeStyles(styles)

function ProjectTile({ name, title, isbn, status, price, projectId, showDelete, attached, toggleDialog, changeBook, project }) {
  const classes = useStyles()
  const history = useHistory()
  const firebase = useFirebase()
  const { showError, showSuccess } = useNotifications()

  function goToProject() {
    //TODO
    return history.push(`${BUYBOOK_PATH}?isbn=${isbn}&name=${name}&title=${title}&status=${status}&price=${price}`)
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
  function buyBook(){
    changeBook(project)
    toggleDialog()
  }



  return (
    <Paper className={classes.root}>
      <div className={classes.top}>
        {attached ? (<img src={attached} height="50" width="50" />):''}
        {showDelete ? (
          <Tooltip title="buy">
            <IconButton onClick={ buyBook }>
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
