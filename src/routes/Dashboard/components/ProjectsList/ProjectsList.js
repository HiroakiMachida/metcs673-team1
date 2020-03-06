import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import styles from './ProjectsList.styles'
import WantingList from '../WantingList'
import SellingList from '../SellingList'
import BuyingList from '../BuyingList'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(styles)

function ProjectsList() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <form action="/posts/" style={{ display: "inline-flex"}}>
            <TextField name="title" label="search" margin="normal" variant="outlined" style={{ width: 300,background: "white" } } />
        <Button type="submit" variant="contained" color="primary" style={{ margin: "15px",marginTop:"21px"}}>Search</Button>
      </form>   
      <WantingList/>
      <SellingList/>
      <BuyingList />
    </div>
  )
}

export default ProjectsList
