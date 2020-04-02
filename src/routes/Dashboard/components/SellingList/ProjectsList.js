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
import Button from '@material-ui/core/Button'
import { useNotifications } from 'modules/notification'
import LoadingSpinner from 'components/LoadingSpinner'
import SellingPostTile from '../SellingPostTile'
import NewProjectTile from '../NewProjectTile'
import NewProjectDialog from '../NewProjectDialog'
import styles from './ProjectsList.styles'
import { POST_LIST_PATH } from 'constants/paths'


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
  
  function updateCategory(ref, title){
    const url = 'http://52.7.150.192:8000/predict';
    //const url = 'http://www.mocky.io/v2/5e7eb394300000da134afb7c';
    const data = {
      "document": title,
      "question": "Name the category."
    }
    const othePram = {
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
      method: "POST"
    }
    return fetch(url,othePram)
      .then(response => 
        response.json().then(data => ({
          data: data,
          status: response.status
      })
      ).then(res => {
        console.log(res.status, res.data)
        ref.update({category: res.data.result.answer})
      }))
      .catch(error=>console.log(error))
  }

  function addProject(newInstance) {
    const file = document.getElementById("image").files[0]
    console.log(file);
    const reader = new FileReader();

    if (!auth.uid) {
      return showError('You must be logged in to create a post')
    }


    if(file){
      reader.addEventListener("load", function () {
        // convert image file to base64 string
        persist(reader.result);
        //preview.src = reader.result;
      }, false);
      reader.readAsDataURL(file);
    }else{
      console.log("no file!");
      var newBooksKey = firebase.database().ref().child('books').push().key;
      var newNotificationsKey = firebase.database().ref().child('notifications').push().key;

      var updates = {};
      updates['/books/' + newBooksKey] = {
        ...newInstance,
        createdBy: auth.uid,
        createdAt: firebase.database.ServerValue.TIMESTAMP
      };
      updates['/notifications/' + newNotificationsKey] = {
        userId: auth.uid,
        body: `"${newInstance.title}" posted for selling.`,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
      };

      return firebase.database().ref().update(updates)
        .then((ret) => {
          console.log(ret);
          console.log(typeof updateCategory);
          updateCategory(ret, newInstance.title);
          toggleDialog();
          showSuccess('Post added successfully');
        })
        .catch(err => {
          console.error('Error:', err) // eslint-disable-line no-console
          showError(err.message || 'Could not add post')
          return Promise.reject(err)
        })
    }

  

    var persist = function(img){
      return firebase
        .push('books', {
          ...newInstance,
          createdBy: auth.uid,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
          attached: img
        })
        .then((ret) => {
          console.log(ret);
          console.log(typeof updateCategory);
          updateCategory(ret, newInstance.title);
          toggleDialog()
          showSuccess('Post updated successfully')
        })
        .catch(err => {
          console.error('Error:', err) // eslint-disable-line no-console
          showError(err.message || 'Could not add post')
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
      <h2>Selling
        <Button onClick={() => history.push(`${POST_LIST_PATH}`) }>
          Go To Book Selling Page
        </Button></h2>
      <NewProjectDialog
        onSubmit={addProject}
        open={newDialogOpen}
        onRequestClose={toggleDialog}
      />
      <div className={classes.tiles}>
        {!isEmpty(projects) &&
          projects.filter(p => p && p.value.createdBy === auth.uid && p.value.wanting !== true).map((project, ind) => {
            return (
              <SellingPostTile
                key={`Project-${project.key}-${ind}`}
                name={project && project.value.title}
                title={project && project.value.title}
                category = {project && project.value.category}
                isbn={project && project.value.isbn}
                status={project && project.value.status}
                delivery_status={project && project.value.delivery_status}
                buyer_id={project && project.value.buyer_id}
                price={project && project.value.price}
                projectId={project.key}
                attached={project && project.value.attached}
                recepient={project && project.value.recepient}
                address={project && project.value.address}
                reviewText = {project && project.value.reviewText}
                book={project}
              />
            )
          })}
        <NewProjectTile onClick={toggleDialog} />
      </div>
    </div>
  )
}

export default ProjectsList
