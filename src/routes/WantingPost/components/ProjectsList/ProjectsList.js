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
import BuyBookDialog from '../BuyBookDialog'
import styles from './ProjectsList.styles'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';


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
        'limitToLast=100'
      ]
    }, {
      path: 'users'
    },
    {
      path: 'books',
      storeAs: 'autocomplete'
    }, 
  ])

  // Get projects from redux state
  const projects = useSelector(state => state.firebase.ordered.books)
  const users = useSelector(state => state.firebase.ordered.users)
  const autocomplete = useSelector(state => state.firebase.ordered.autocomplete)

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
        buyer_id: auth.uid,
        delivery_status: 'sold',
        wanting: 'false'
      })
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

  return { projects, buyBook, newDialogOpen, toggleDialog, params, changeBook, book, users, autocomplete }
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
    users,
    autocomplete
  } = useProjectsList()

  // Show spinner while projects are loading
  if (!isLoaded(projects) || !isLoaded(users)) {
    return <LoadingSpinner />
  }


  return (
    <div className={classes.root}>
      <form action="/posts/" style={{ display: "inline-flex"}}>
        <Autocomplete
        id="search-input"
        freeSolo
        options={autocomplete.map(option => option.value.title)}
        renderInput={options => (
            <TextField {...options} name="title" label="search" margin="normal" variant="outlined" style={{ width: 300,background: "white" } } placeholder={params.get('title')||"Search"} />
        )}
      />
        <Button type="submit" variant="contained" color="primary" style={{ margin: "15px",marginTop:"21px"}}>Search</Button>
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
          projects.filter(e=> e.value.wanting === true).map((project, ind) => {
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