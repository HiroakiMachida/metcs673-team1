import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import {
  useFirebaseConnect,
  isLoaded,
  isEmpty
} from 'react-redux-firebase'
import LoadingSpinner from 'components/LoadingSpinner'
import BuyingPostTile from '../BuyingPostTile'
import styles from './ProjectsList.styles'

const useStyles = makeStyles(styles)

function useProjectsList() {

  // Get auth from redux state
  const auth = useSelector(state => state.firebase.auth)
  // Create listeners based on current users UID
  useFirebaseConnect([
    {
      path: 'books',
      queryParams: [
//        'orderByChild=createdBy',
//        `equalTo=${auth.uid}`,
        // 'limitToLast=100'
      ]
    }
  ])

  // Get projects from redux state

  const projects = useSelector(state => state.firebase.ordered.books)

  // New dialog


  return { projects, auth }
}

function ProjectsList() {
  const classes = useStyles()
  const {
    projects,
    auth
  } = useProjectsList()

  // Show spinner while projects are loading
  if (!isLoaded(projects)) {
    return <LoadingSpinner />
  }

  return (
    <div className={classes.root}>
      <h2>Purchased</h2>
      <div className={classes.tiles}>
        {!isEmpty(projects) &&
          projects.filter(p => p && p.value.buyer_id === auth.uid).map((project, ind) => {  
            return (
              <BuyingPostTile
                key={`Project-${project.key}-${ind}`}
                name={project && project.value.title}
                title={project && project.value.title}
                category={project && project.value.category}
                isbn={project && project.value.isbn}
                status={project && project.value.status}
                createdBy={project && project.value.createdBy}
                price={project && project.value.price}
                projectId={project.key}
                attached={project.value.attached}
                delivery_status={project.value.delivery_status}
                reviewText={project.value.reviewText}
                
              />
            )
          })}
      </div>
    </div>
  )
}

export default ProjectsList
