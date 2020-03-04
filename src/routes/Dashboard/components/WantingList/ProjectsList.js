import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  useFirebase,
  useFirebaseConnect,
  isLoaded,
  isEmpty
} from 'react-redux-firebase'
import { useNotifications } from 'modules/notification'
import Button from '@material-ui/core/Button'
import LoadingSpinner from 'components/LoadingSpinner'
import WantingPostTile from '../WantingPostTile'
import SellingPostTile from '../SellingPostTile'
import NewProjectTile from '../NewProjectTile'
import NewProjectDialog from '../NewProjectDialog'
import styles from './ProjectsList.styles'
import { createSelector } from 'reselect'
import { WANTING_POST_PATH } from 'constants/paths'



const useStyles = makeStyles(styles)

function useProjectsList() {
  const { showSuccess, showError } = useNotifications()
  const firebase = useFirebase()

  // Get auth from redux state
  const auth = useSelector(state => state.firebase.auth)
  // Create listeners based on current users UID
  
  useFirebaseConnect([
    {
      path: 'books',
      queryParams: [
//        'orderByChild=createdBy',
//        `equalTo=${auth.uid}`,
        'limitToLast=10'
      ]
    }
  ])
  
  // Get projects from redux state
  const projects = useSelector(state => state.firebase.ordered.books)

  // New dialog
  const [newDialogOpen, changeDialogState] = useState(false)
  const toggleDialog = () => changeDialogState(!newDialogOpen)

  function addProject(newInstance) {

    const preview = document.querySelector('img');
    const file = document.getElementById("image").files[0]
    const reader = new FileReader();

    reader.addEventListener("load", function () {
      // convert image file to base64 string
      persist(reader.result)
      //preview.src = reader.result;
    }, false);
  
    if (file) {
      reader.readAsDataURL(file);
    }
  


    if (!auth.uid) {
      return showError('You must be logged in to create a project')
    }
    var persist = function(arg1){
    return firebase
      .push('books', {
        ...newInstance,
        createdBy: auth.uid,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        attached: arg1,
        wanting: 'true'

      })
      .then(() => {
        toggleDialog()
        showSuccess('Status updated successfully')
      })
      .catch(err => {
        console.error('Error:', err) // eslint-disable-line no-console
        showError(err.message || 'Could not add project')
        return Promise.reject(err)
      })
    }
  }

  return { projects, addProject, newDialogOpen, toggleDialog, auth }
}

function ProjectsList() {
  const classes = useStyles()
  const history = useHistory()
  const {
    projects,
    addProject,
    newDialogOpen,
    toggleDialog,
    auth
  } = useProjectsList()

  // Show spinner while projects are loading
  if (!isLoaded(projects)) {
    return <LoadingSpinner />
  }

  return (
    <div className={classes.root}>
      <h2>Wanting
        <Button onClick={() => history.push(`${WANTING_POST_PATH}`) }>
          Go To Wanting Page
        </Button>
      </h2>
      
      <NewProjectDialog
        onSubmit={addProject}
        open={newDialogOpen}
        onRequestClose={toggleDialog}
      />
      <div className={classes.tiles}>
        {!isEmpty(projects) &&
          projects.filter(p => p && p.value.createdBy == auth.uid).map((project, ind) => {
            return (
              <WantingPostTile
                key={`Project-${project.key}-${ind}`}
                name={project && project.value.title}
                title={project && project.value.title}
                isbn={project && project.value.isbn}
                status={project && project.value.status}
                delivery_status={project && project.value.delivery_status}
                buyer_id={project && project.value.buyer_id}
                price={project && project.value.price}
                projectId={project.key}
                attached={project && project.value.attached}
                recepient={project && project.value.recepient}
                address={project && project.value.address}
              />
            )
          })}
        <NewProjectTile onClick={toggleDialog} />
      </div>
    </div>
  )
}

export default ProjectsList
