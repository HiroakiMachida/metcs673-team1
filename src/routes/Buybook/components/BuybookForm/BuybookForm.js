import React from 'react'
import PropTypes from 'prop-types'
import { Formik, Field, Form } from 'formik'
import { TextField } from 'formik-material-ui'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import styles from './BuybookForm.styles'
import ProjectTile from 'routes/PostList/components/ProjectTile'
import { useSelector } from 'react-redux'
import {
  useFirebase,
  useFirebaseConnect,
  isLoaded,
  isEmpty
} from 'react-redux-firebase'

const useStyles = makeStyles(styles)

function useProjectsList() {
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
    }
  ])

  // Get projects from redux state
  const projects = useSelector(state => state.firebase.ordered.books)
  

  return { projects, params }
}

function BuybookForm({ onSubmit }) {

  const classes = useStyles()

  function handleSubmit(values, { setSubmitting }) {
    onSubmit(values).then(() => {
      setSubmitting(false)
    })
  }

  const {
    projects,
    params
  } = useProjectsList()

  let pid = new URLSearchParams(window.location.search);
  const isbn = pid.get('isbn')
  const name = pid.get('name')
  const title = pid.get('title')
  const status = pid.get('status')
  const price = pid.get('price')
  function infomation(){
  return (
    <div className={classes.tiles}>
        {!isEmpty(projects) &&
          projects.filter(p => p && p.value.isbn == isbn).map((project, ind) => {
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
  )}

  return (
    <Formik initialValues={{ postID: '',
                            ISBN: isbn, 
                            title: title,
                            price: price,
                            name: name,
                            address: '',
                            payment: '' }} onSubmit={handleSubmit}>
      {({ touched, isSubmitting }) => (
        <Form className={classes.root}>
          <label>Buy Book</label>
          <Field
            label="post ID"
            type="text"
            name="postID"
            //validate={validateEmail}
            component={TextField}
            margin="normal"
            fullWidth
          />
          <Field
            
            initialValues="Init"
            label="ISBN"
            type="text"
            name="ISBN"
            component={TextField}
            margin="normal"
            fullWidth
          />
          <Field
            initialValues="Init"
            label="Title"
            type="text"
            name="title"
            component={TextField}
            margin="normal"
            fullWidth
          />
          <Field
            label="Price"
            type="text"
            name="price"
            component={TextField}
            margin="normal"
            fullWidth
          />
          <Field
            label="Name"
            type="text"
            name="name"
            component={TextField}
            margin="normal"
            fullWidth
          />
          <Field
            label="Address"
            type="text"
            name="address"
            component={TextField}
            margin="normal"
            fullWidth
          />
          <Field
            label="Payment"
            type="text"
            name="payment"
            component={TextField}
            margin="normal"
            fullWidth
          />
          <div className={classes.submit}>
            <Button
              color="primary"
              type="submit"
              variant="contained"
              disabled={Object.keys(touched).length === 0 || isSubmitting}>
              {isSubmitting ? 'Loading' : 'Buybook'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}


BuybookForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default BuybookForm
