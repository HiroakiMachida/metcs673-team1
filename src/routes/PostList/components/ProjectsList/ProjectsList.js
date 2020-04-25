import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx';
import { useSelector } from 'react-redux'
import {
  useFirebase,
  useFirebaseConnect,
  isLoaded,
  isEmpty
} from 'react-redux-firebase'
import { useNotifications } from 'modules/notification'
import LoadingSpinner from 'components/LoadingSpinner'
import ProjectTile from '../ProjectTile'
import BuyBookDialog from '../BuyBookDialog'
import styles from './ProjectsList.styles'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio'
import Input from '@material-ui/core/Input'
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import { FormControlLabel, Checkbox } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';


const useStyles = makeStyles(styles)

function useProjectsList() {
  const { showSuccess, showError } = useNotifications()
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
        `startAt=${params.get('title')}`
      ],
    },
    {
      path: 'users'
    },
    {
      path: 'books',
      storeAs: 'autocomplete'
    }, 
  ])

  // Get projects from redux state
  const projects = useSelector(state => state.firebase.ordered.books)
  const users = useSelector(state => state.firebase.ordered.users)
  const autocomplete = useSelector(state => state.firebase.ordered.autocomplete)

  // New dialog
  const [newDialogOpen, changeDialogState] = useState(false)
  const [book, changeBook] = useState('book')
  const toggleDialog = () => changeDialogState(!newDialogOpen)

  function buyBook(newInstance) {
    if (!auth.uid) {
      return showError('You must be logged in to create a project')
    }
    console.log(newInstance)
    return firebase
      .update('books/'+book.key, {
        ...newInstance,
        buyer_id: auth.uid,
        delivery_status: 'sold'
      })
      .then(() => {
        toggleDialog()
        showSuccess('Bought it successfully')
        window.location.href = "/dashboard";
      })
      .catch(err => {
        console.error('Error:', err) // eslint-disable-line no-console
        showError(err.message || 'Could not add project')
        return Promise.reject(err)
      })
  }

  return { projects, buyBook, newDialogOpen, toggleDialog, params, changeBook, book, users, autocomplete }
}


function ProjectsList() {
  const classes = useStyles()
  const {
    projects,
    buyBook,
    newDialogOpen,
    toggleDialog,
    params,
    changeBook,
    book,
    users,
    autocomplete
  } = useProjectsList()


  const [open, setOpen] = React.useState(false);
  const price = "Price Range:   "
  const pricerange = " <= price <= "
  const bookstatus = "Book Status: "
  const bookclassify = "Book Category: "
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const a = "fdsfds";

  const [state,setState] = useState({
    checkedA: false,
    checkedB: false,
    checkedC: false,
    checked1: false,
    checked2: false,
    checked3: false,
    checked4: false,

  });



  const handleChange = (event) => {
    setState({ ...state, [event.target.name]:event.target.checked});
  };

  const handleDrawer = () => {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }

  const advancesearch = () => {
    var pl = params.get("priceupper")
    var pu = params.get("priceupper")
    console.log(pu)
    console.log(pl)
  }


  // Show spinner while projects are loading
  if (!isLoaded(projects) || !isLoaded(users)) {
    return <LoadingSpinner />
  }

  function upper() {
    return (params.get("priceupper") === "" || params.get("priceupper") === null) ? Infinity : params.get("priceupper")
  }

  function lower() {
    return (params.get("pricelower") === "" || params.get("pricelower") === null) ? 0 : params.get("pricelower")
  }

  function checkedA() {
    return (params.get("checkedA") === null ) ? "Dirty" : params.get("checkedA")
  }

  function checkedB() {
    return (params.get("checkedB") === null ) ? "Clean" : params.get("checkedB")
  }

  function checkedC() {
    return (params.get("checkedC") === null ) ? "Very Good" : params.get("checkedC")
  }

  function checkedABC() {
    return ((params.get("checkedA") === null ) && (params.get("checkedB") === null ) && (params.get("checkedC") === null ))
  }

  function checked1() {
    return (params.get("checked1") === null ) ? "Algorithm" : params.get("checked1")
  }

  function checked2() {
    return (params.get("checked2") === null ) ? "Computer Science" : params.get("checked2")
  }

  function checked3() {
    return (params.get("checked3") === null ) ? "Java" : params.get("checked3")
  }

  function checked4() {
    return (params.get("checked4") === null ) ? "Software Engineering" : params.get("checked4")
  }

  function checked1234() {
    return ((params.get("checked1") === null ) && (params.get("checked2") === null ) && (params.get("checked3") === null )
    && (params.get("checked4") === null ))
  }

  Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
  };

  const allcategory = []

  function getAllCategory() {
    projects.forEach(element => {
      if (!allcategory.includes(element.value.category) && element.value.category != undefined) {
        allcategory.push(element.value.category)
      }
      /*
      if (!state.allcategory.some(row => row.includes(element.value.category)) && element.value.category !== undefined){
        state.allcategory.push( [element.value.category, true]);
      }*/
    });
  }


  //getAllCategory()

  /**
   * 
          {allcategory.map(cate => {
            return (
              <FormControlLabel control={<Checkbox checked={state.checked1} onChange={handleChange}name="checked1" />}
                          key={cate}  label={cate} name={cate} value={cate}
              />
            )
          })}
   */


  return (
    <div className={classes.root}>
      <form action="/posts/" style={{ display: "inline-flex"}}>
        <Autocomplete
        id="search-input"
        freeSolo
        options={autocomplete.map(option => option.value.title)}
        renderInput={options => (
            <TextField {...options} name="title" label="search" margin="normal" variant="outlined" style={{ width: 300,background: "white" } } placeholder={params.get('title')||"Search"} />
        )}
      />
        <Button type="submit" variant="contained" color="primary" style={{ margin: "15px",marginTop:"21px"}}>Search</Button>

      </form>
              
      <Button edge="start"
            type="submit"
            variant="contained"
            color="primary"
            style={{ margin: "15px",marginTop:"21px"}}
            aria-label="open drawer"
            onClick={handleDrawer}
            className={clsx(open)}> Advance Search
      </Button>
      <div>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >

        <form action="/posts/" style={{ display: "inline-flex", flexDirection: "column"}}>
          <section style={{ display: "inline-flex", flexDirection: "row"}}>
        <h1> { price }</h1>
        <Autocomplete
          id="price-lower"
          freeSolo
          options={autocomplete.map(option => option.value.price)}
          renderInput={options => (
            <TextField {...options} name="pricelower" label="0" margin="normal" variant="outlined"  style={{ background: "white" }} placeholder={params.get('pricelower')||"0"} />
          )}
        />
        <h1> { pricerange } </h1>
        <Autocomplete
          id="price-lower"
          freeSolo
          options={autocomplete.map(option => option.value.price)}
          renderInput={options => (
            <TextField {...options} name="priceupper" value="Infinity" label="Infinity" margin="normal" variant="outlined" style={{ background: "white" }}  placeholder={params.get('priceupper')||"Infinity"} />
          )}
        />
        </section>
        <section style={{ display: "inline-flex", flexDirection: "row"}}>
        <h1>{ bookstatus }</h1>
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={state.checkedA} onChange={handleChange} name="checkedA" />}
                            label="Dirty" name="Dirty" value="Dirty"
          />
          <FormControlLabel control={<Checkbox checked={state.checkedB} onChange={handleChange} name="checkedB" />}
                            label="Clean" name="Clean" value="Clean"
          />
          <FormControlLabel control={<Checkbox checked={state.checkedC} onChange={handleChange} name="checkedC" />}
                            label="Very Good" name="Very Good" value="Very Good"
          />
        </FormGroup>
        </section>
        <section style={{ display: "inline-flex", flexDirection: "row"}}>
        <h1>{ bookclassify }</h1>
        <FormGroup row>
          <FormControlLabel control={<Checkbox checked={state.checked1} onChange={handleChange} name="checked1" />}
                            label="Algorithm" name="Algorithm" value="Algorithm"
          />
          <FormControlLabel control={<Checkbox checked={state.checked2} onChange={handleChange} name="checked2" />}
                            label="Computer Science" name="Computer Science" value="Computer Science"
          />
          <FormControlLabel control={<Checkbox checked={state.checked3} onChange={handleChange} name="checked3" />}
                            label="Java" name="Java" value="Java"
          />
          <FormControlLabel control={<Checkbox checked={state.checked4} onChange={handleChange} name="checked4" />}
                            label="Software Engineering" name="Software Engineering" value="Software Engineering"
          />
        </FormGroup>
        </section>
        <Button type="submit" variant="contained" color="primary" style={{ margin: "15px",marginTop:"21px", width : 200,}}>Search</Button>

        </form>

        </Drawer>
        </div>

      <BuyBookDialog
        onSubmit={buyBook}
        open={newDialogOpen}
        onRequestClose={toggleDialog}
        book={book}
        users={users}
      />

      <h2>Search result - Books you can buy</h2>
      <div className={classes.tiles}>
        {!isEmpty(projects) &&
          projects.filter(e=>!e.value.delivery_status 
                        && e.value.wanting !== true 
                        && e.value.price <= upper()
                        && e.value.price >= lower()
                        && (checkedABC() ? true : (e.value.status == checkedA()
                          || e.value.status == checkedB()
                          || e.value.status == checkedC()))
                        && (checked1234() ? true : (e.value.category == checked1()
                          || e.value.category == checked2()
                          || e.value.category == checked3()
                          || e.value.category == checked4()))
                        ).map((project, ind) => {
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
                toggleDialog={toggleDialog}
                changeBook={changeBook}
                project={project}

              />
            )
          })}
      </div>
    </div>
  )
}

export default ProjectsList