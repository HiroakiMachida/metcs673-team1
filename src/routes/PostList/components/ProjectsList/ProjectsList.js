import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import {
  useFirebase,
  useFirebaseConnect,
  isLoaded,
  isEmpty
} from 'react-redux-firebase'
import { useNotifications } from 'modules/notification'
import LoadingSpinner from 'components/LoadingSpinner'
import ProjectTile from '../ProjectTile'
import NewProjectTile from '../NewProjectTile'
import NewProjectDialog from '../NewProjectDialog'
import styles from './ProjectsList.styles'

const useStyles = makeStyles(styles)

function useProjectsList() {
  const { showSuccess, showError } = useNotifications()
  const firebase = useFirebase()
  const search = window.location.search;
  const params = new URLSearchParams(search);

  // Get auth from redux state
  const auth = useSelector(state => state.firebase.auth)
  // Create listeners based on current users UID
  useFirebaseConnect([
    {
      path: 'projects',
      queryParams: [
        'orderByChild=title',
        `startAt=${params.get('title')}`,
        'limitToLast=10'
      ]
    }
  ])

  // Get projects from redux state
  const projects = useSelector(state => state.firebase.ordered.projects)

  // New dialog
  const [newDialogOpen, changeDialogState] = useState(false)
  const toggleDialog = () => changeDialogState(!newDialogOpen)

  function addProject(newInstance) {
    if (!auth.uid) {
      return showError('You must be logged in to create a project')
    }
    return firebase
      .push('projects', {
        ...newInstance,
        createdBy: auth.uid,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      })
      .then(() => {
        toggleDialog()
        showSuccess('Project added successfully')
      })
      .catch(err => {
        console.error('Error:', err) // eslint-disable-line no-console
        showError(err.message || 'Could not add project')
        return Promise.reject(err)
      })
  }

  return { projects, addProject, newDialogOpen, toggleDialog, params }
}

function ProjectsList() {
  const classes = useStyles()
  const {
    projects,
    addProject,
    newDialogOpen,
    toggleDialog,
    params
  } = useProjectsList()

  // Show spinner while projects are loading
  if (!isLoaded(projects)) {
    return <LoadingSpinner />
  }

  return (
    <div className={classes.root}>
      <form action="/posts/">
        <input name="title" type="text" value={params.get('title')} placeholder="Search" />
        <button>Search</button>
      </form>
      <NewProjectDialog
        onSubmit={addProject}
        open={newDialogOpen}
        onRequestClose={toggleDialog}
      />
      <div className={classes.tiles}>
        {!isEmpty(projects) &&
          projects.map((project, ind) => {
            return (
              <ProjectTile
                key={`Project-${project.key}-${ind}`}
                name={project && project.value.title}
                title={project && project.value.title}
                isbn={project && project.value.isbn}
                status={project && project.value.status}
                price={project && project.value.price}
                projectId={project.key}
              />
            )
          })}
      </div>
    </div>
  )
}

export default ProjectsList
