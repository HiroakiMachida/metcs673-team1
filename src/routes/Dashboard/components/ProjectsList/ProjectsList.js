import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import styles from './ProjectsList.styles'
import SellingList from '../SellingList'
import BuyingList from '../BuyingList'


const useStyles = makeStyles(styles)

function ProjectsList() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <form action="/posts/">
        <input name="title" type="text" placeholder="Search" />
        <button>Search</button>        
      </form>
      <SellingList/>
      <BuyingList />
    </div>
  )
}

export default ProjectsList
