import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import {
  useFirebase,
  useFirebaseConnect,
  isLoaded,
  isEmpty
} from 'react-redux-firebase'
import LoadingSpinner from 'components/LoadingSpinner'
import BuyingPostTile from '../BuyingPostTile'
import ProjectTile from '../../../PostList/components/ProjectTile'

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
    },
    {
      path: 'users'
    }
  ])

  // Get projects from redux state

  const projects = useSelector(state => state.firebase.ordered.books)
  const users = useSelector(state => state.firebase.ordered.users)
  // New dialog


  return { projects, auth , users}
}

function ProjectsList({delivery_status}) {
  const classes = useStyles()
  const {
    projects,
    auth,
    users
  } = useProjectsList()

  const firebase = useFirebase()
  const user = firebase.database().ref('/users/' + auth.uid)
  let myuser;
  const preferences = [];
  user.on('value', function(snapshot) {
    //Do something with the data
    myuser = snapshot.val();
    if(myuser.preferences){
      preferences.push(...myuser.preferences);
    }
    console.log(myuser);
  });

  // Show spinner while projects are loading
  if (!isLoaded(projects)) {
    return <LoadingSpinner />
  }

  function categoryMatch(p){
    if(p.value.category && preferences.includes(p.value.category)){
        return true; 
    }else {
      return false;
    }
  }

  return (
    <div className={classes.root}>
      <div className={classes.tiles}>
        {!isEmpty(projects) &&
          projects.filter(p => p && p.value.delivery_status!== "sold" && p.value.delivery_status!== "review_submitted" && p.value.delivery_status!== "shipped"  && p.value.delivery_status!== "received" && p.value.createdBy !== auth.uid  && p.value.wanting !== true && (categoryMatch(p) ) ).map((project, ind) => {  
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
                project={project}
                sellerId={project && project.value.createdBy}
                users={users}
                auth={auth}
              />
            )
          })}
      </div>
    </div>
  )
}

export default ProjectsList
