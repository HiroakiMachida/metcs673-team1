import React from 'react';
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
import Quagga from 'quagga';

const useStyles = makeStyles(styles)

function NewProjectDialog({ onSubmit, open, onRequestClose }) {
  const classes = useStyles()

  function handleSubmit(values, { setSubmitting }) {
    return onSubmit(values).then(() => {
      setSubmitting(false)
    })
  }



  function inputFile(){
    const file = document.getElementById("quaggaFile").files[0];
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      // convert image file to base64 string
      analyzeQuaggaFile(reader.result);
      //preview.src = reader.result;
    }, false);
    reader.readAsDataURL(file);
  }

  function analyzeQuaggaFile(src){
  Quagga.decodeSingle({
//    src: "/image-002.jpg",
    src: src,
    numOfWorkers: 0,  // Needs to be 0 when used within node
    inputStream: {
        size: 800  // restrict input-size to be 800px in width (long-side)
    },
    decoder: {
        readers: ["ean_reader"] // List of active readers
    },
  }, function(result) {
      if(result.codeResult) {
          console.log("result", result.codeResult.code);
          document.getElementById("quaggaIsbn").value = result.codeResult.code  ;
      } else {
          console.log("not detected");
      }
  });
}

  return (
    <Dialog open={open} onClose={onRequestClose}>
      <DialogTitle id="new-project-dialog-title">Sell book</DialogTitle>

      <Formik initialValues={{ name: '' }} onSubmit={handleSubmit}>
        {({ errors, isSubmitting }) => (
          <Form className={classes.root}>
            <DialogContent>
              <Field
                id="quaggaIsbn"
                name="isbn"
                label="ISBN"
                component={TextField}
                margin="normal"
                fullWidth
              />
              Scan bar code:<input id="quaggaFile" type="file" accept="image/*" capture="camera" onChange={inputFile}/>
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
              Book cover:<input id="image" type="file"/>
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
