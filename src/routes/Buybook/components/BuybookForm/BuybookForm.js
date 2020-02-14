import React from 'react'
import PropTypes from 'prop-types'
import { Formik, Field, Form } from 'formik'
import { TextField } from 'formik-material-ui'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { validateEmail } from 'utils/form'
import styles from './BuybookForm.styles'

const useStyles = makeStyles(styles)

function BuybookForm({ onSubmit }) {
  const classes = useStyles()

  function handleSubmit(values, { setSubmitting }) {
    onSubmit(values).then(() => {
      setSubmitting(false)
    })
  }

  return (
    <Formik initialValues={{ postID: '', 
                            ISBN: '', 
                            title: '',
                            price: '',
                            name: '',
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
