import React from 'react'
import PropTypes from 'prop-types'
import { Formik, Field, Form } from 'formik'
import { TextField} from 'formik-material-ui'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import styles from './NewReviewDialog.styles'

const useStyles = makeStyles(styles)

function NewReviewDialog({ onSubmit,bookId, open, onRequestClose, title, isbn, status }) {
  const classes = useStyles()

  function handleSubmit(values, { setSubmitting }) {
    return onSubmit(values).then(() => {
      setSubmitting(false)
      onRequestClose();
    })
  }

  return (
    <Dialog open={open} onClose={onRequestClose}>
      <DialogTitle id="new-project-dialog-title">Submit Review</DialogTitle>
      <Formik initialValues={{ bookId: bookId }} onSubmit={handleSubmit}>
        {({ errors, isSubmitting }) => (
          <Form className={classes.root}>
            <DialogContent>
            <Field
                name="Book ID"
                component={TextField}
                margin="normal"
                placeholder={bookId}
                fullWidth
                disabled={true}
             />
            <Field
                name="title"
                component={TextField}
                margin="normal"
                placeholder={title}
                fullWidth
                disabled={true}
             />
              <Field
                name="isbn"
                component={TextField}
                margin="normal"
                placeholder={isbn}
                fullWidth
                disabled={true}
              />
              <Field
                name="reviewText"
                multiline
                rows={2}
                rowsMax={4}
                component={TextField}
                margin="normal"
                placeholder="Place your review here"
                fullWidth
                
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onRequestClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}

NewReviewDialog.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
}

export default NewReviewDialog
