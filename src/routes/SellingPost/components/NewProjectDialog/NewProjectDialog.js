import React, { useState, setState } from 'react';
import PropTypes from 'prop-types'
import { Formik, Field, Form } from 'formik'
import { TextField} from 'formik-material-ui'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import styles from './NewProjectDialog.styles'

const useStyles = makeStyles(styles)

function NewProjectDialog({ onSubmit, open, onRequestClose }) {
  const classes = useStyles()

  function handleSubmit(values, { setSubmitting }) {
    return onSubmit(values).then(() => {
      setSubmitting(false)
    })
  }

  function previewFile() {
    const preview = document.querySelector('img');
    const file = document.getElementById("image").files[0]
    const reader = new FileReader();
  
    reader.addEventListener("load", function () {
      // convert image file to base64 string
      preview.src = reader.result;
    }, false);
  
    if (file) {
      reader.readAsDataURL(file);
    }

  }

  return (
    <Dialog open={open} onClose={onRequestClose}>
      <DialogTitle id="new-project-dialog-title">New Project</DialogTitle>
      <Formik initialValues={{ name: '' }} onSubmit={handleSubmit}>
        {({ errors, isSubmitting }) => (
          <Form className={classes.root}>
            <DialogContent>
              <Field
                name="isbn"
                label="ISBN"
                component={TextField}
                margin="normal"
                fullWidth
              />
              <Field
                name="title"
                label="Title"
                component={TextField}
                margin="normal"
                fullWidth
              />
              <Field
                name="status"
                label="Status"
                component={TextField}
                margin="normal"
                fullWidth
              />
              <Field
                name="price"
                label="Price"
                component={TextField}
                margin="normal"
                fullWidth
              />
              <input id="image" type="file"/>
            </DialogContent>
            <DialogActions>
              <Button onClick={onRequestClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}

NewProjectDialog.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
}

export default NewProjectDialog
