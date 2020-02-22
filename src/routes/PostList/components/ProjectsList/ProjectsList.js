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
import BuyBookDialog from '../BuyBookDialog'
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
      path: 'books',
      queryParams: [
        'orderByChild=title',
        `startAt=${params.get('title')}`,
        'limitToLast=10'
      ]
    }, {
      path: 'users'
    }
  ])

  // Get projects from redux state
  const projects = useSelector(state => state.firebase.ordered.books)
  const users = useSelector(state => state.firebase.ordered.users)

  // New dialog
  const [newDialogOpen, changeDialogState] = useState(false)
  const [book, changeBook] = useState('book')
  const toggleDialog = () => changeDialogState(!newDialogOpen)

  function buyBook(newInstance) {
    if (!auth.uid) {
      return showError('You must be logged in to create a project')
    }
    console.log(newInstance)
    return firebase
      .update('books/'+book.key, {
        ...newInstance,
        delivery_status: 'sold'
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

  return { projects, buyBook, newDialogOpen, toggleDialog, params, changeBook, book, users }
}

function ProjectsList() {
  const classes = useStyles()
  const {
    projects,
    buyBook,
    newDialogOpen,
    toggleDialog,
    params,
    changeBook,
    book,
    users
  } = useProjectsList()

  // Show spinner while projects are loading
  if (!isLoaded(projects) || !isLoaded(users)) {
    return <LoadingSpinner />
  }

  return (
    <div className={classes.root}>
      <form action="/posts/">
        <input name="title" type="text" placeholder={params.get('title')||"Search"} />
        <button>Search</button>
      </form>
      <BuyBookDialog
        onSubmit={buyBook}
        open={newDialogOpen}
        onRequestClose={toggleDialog}
        book={book}
        users={users}
      />
      <h2>Search result</h2>
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
                createdBy={project && project.value.createdBy}
                price={project && project.value.price}
                projectId={project.key}
                attached={project && project.value.attached}
                toggleDialog={toggleDialog}
                changeBook={changeBook}
                project={project}

              />
            )
          })}
      </div>
    </div>
  )
}

export default ProjectsList
