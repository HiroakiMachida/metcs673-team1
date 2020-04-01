import React from 'react'
import PropTypes from 'prop-types'
import { Formik, Field, Form } from 'formik'
import { TextField } from 'formik-material-ui'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Link from '@material-ui/core/Link';

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import styles from './AdvanceSearchDialog.styles'


const useStyles = makeStyles(styles)

function AdvanceSearchDialog({ onSubmit, open, onRequestClose }) {

  const classes = useStyles()


  function handleSubmit(values, { setSubmitting }) {
    return onSubmit(values).then(() => {
      setSubmitting(false)
    })
  }

  return (
    <Dialog open={open} onClose={onRequestClose}>
      <DialogTitle id="new-project-dialog-title">Buy</DialogTitle>
      
      <Formik initialValues={{  }} onSubmit={handleSubmit}>
        {({ errors, isSubmitting }) => (
          <Form className={classes.root}>
            <DialogContent>
              <Field
                name="title"
                component={TextField}
                margin="normal"
                fullWidth
                disabled={true}
              />
              <Field
                name="isbn"
                component={TextField}
                margin="normal"
                fullWidth
                disabled={true}
              />
              <Field
                name="status"
                component={TextField}
                margin="normal"
                fullWidth
                disabled={true}
              />
              <Field
                name="price"
                component={TextField}
                margin="normal"
                fullWidth
                disabled={true}
              />
              <Field
                name="recepient"
                component={TextField}
                margin="normal"
                placeholder="Your name"
                fullWidth
              />
              <Field
                name="address"
                component={TextField}
                margin="normal"
                placeholder="Your shpping address"
                fullWidth
              />

            </DialogContent>
            <DialogActions>
              <Button onClick={onRequestClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Buying...' : 'Buy'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}

AdvanceSearchDialog.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired
}

export default AdvanceSearchDialog
