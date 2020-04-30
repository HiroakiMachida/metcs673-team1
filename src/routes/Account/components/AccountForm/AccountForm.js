import React from 'react'
import PropTypes from 'prop-types'
import { Formik, Field, Form } from 'formik'
import { TextField } from 'formik-material-ui'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { validateEmail } from 'utils/form'
import ProviderDataForm from '../ProviderDataForm'
import styles from './AccountForm.styles'
import ToggleButton from '@material-ui/lab/ToggleButton';

const useStyles = makeStyles(styles)

function AccountForm({ account, onSubmit }) {
  const classes = useStyles()

  var [softwareEngineering, seSelected] = React.useState(account.preferences ? account.preferences.includes("Software Engineering") : false);
  var [java, javaSelected] = React.useState(account.preferences ? account.preferences.includes("JAVA") : false);
  var [uml, umlSelected] = React.useState(account.preferences ? account.preferences.includes("UML") : false);
  var [ai, aiSelected] = React.useState( account.preferences ? account.preferences.includes("AI") : false);

  function handleSubmit(values, { setSubmitting }) {
    values.preferences = [];
    if(java){
      values.preferences.push("JAVA")
    }
    if(softwareEngineering){
      values.preferences.push("Software Engineering")
    }
    if(ai){
      values.preferences.push("AI")
    }
    if(uml){
      values.preferences.push("UML")
    }

    onSubmit(values).then(() => {
      setSubmitting(false)
    })
  }

  const { isLoaded, isEmpty, ...cleanAccount } = account

  return (
    <Formik initialValues={cleanAccount} onSubmit={handleSubmit}>
      {({ errors, touched, isSubmitting }) => (
        <Form className={classes.root}>
          <div className={classes.fields}>
            <Field
              name="displayName"
              label="Display Name"
              component={TextField}
              margin="normal"
              fullWidth
            />
            <Field
              type="email"
              name="email"
              validate={validateEmail}
              component={TextField}
              margin="normal"
              fullWidth
            />
            <Field
              name="avatarUrl"
              label="Avatar Url"
              component={TextField}
              margin="normal"
              fullWidth
            />
            <div align="left" className={classes.fields} >
            <label>Preferences</label>
            <br></br>
        
            <ToggleButton value="Software Engineering" 
               selected = {softwareEngineering}
               onChange={() => {
                seSelected(!softwareEngineering)
              }}
                aria-label="Software Engineering">
              <label>Software Engineering</label>
            </ToggleButton>

 
            <ToggleButton value="Java" 
               selected = {java}
               onChange={() =>  javaSelected(!java)}
                aria-label="Java">
              <label>Java</label>
            </ToggleButton>

            <ToggleButton value="UML" 
               selected = {uml}
               onChange={() => {
                umlSelected(!uml)
              }}
                aria-label="UML">
              <label>UML</label>
            </ToggleButton>

            <ToggleButton value="AI" 
               selected = {ai}
               onChange={() => {
                aiSelected(!ai)
              }}
                aria-label="ai">
              <label>Artificial Intelligence</label>
            </ToggleButton>
            </div>
          </div>
          {!!account && !!account.providerData && (
            <div>
              <Typography variant="h6">Linked Accounts</Typography>
              <ProviderDataForm providerData={account.providerData} />
            </div>
          )}
          <Button
            color="primary"
            type="submit"
            variant="contained"
            disabled={Object.keys(touched).length === 0 || isSubmitting}>
            {isSubmitting ? 'Saving' : 'Save'}
          </Button>
        </Form>
      )}
    </Formik>
  )
}

AccountForm.propTypes = {
  account: PropTypes.object,
  onSubmit: PropTypes.func.isRequired
}

export default AccountForm
