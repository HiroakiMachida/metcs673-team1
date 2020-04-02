import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx';
import { useSelector } from 'react-redux'
import {
  useFirebaseConnect,
  isLoaded,
  isEmpty
} from 'react-redux-firebase'
import LoadingSpinner from 'components/LoadingSpinner'
import ProjectTile from '../ProjectTile'
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
import { Field } from 'formik';


const useStyles = makeStyles(styles)

function useProjectsList() {
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
 
    return { projects, params, users, autocomplete,auth }
}


function ProjectsList() {
  const classes = useStyles()
  const {
    projects,
    params,
    users,
    autocomplete,
    auth
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

  const [state,setState] = useState({
    checkedA: true,
    checkedB: true,
    checkedC: true,
    checked1: true,
    checked2: true,
    checked3: true,
    checked4: true,
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
   //if(pl != "") pricelower = pl;
    //if(pu != "") priceupper = pu;
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
    return (params.get("checkedA") === null && params.get("title") !== null ) ? "Dirty" : params.get("checkedA")
  }

  function checkedB() {
    return (params.get("checkedB") === null && params.get("title") !== null ) ? "Clean" : params.get("checkedB")
  }

  function checkedC() {
    return (params.get("checkedC") === null && params.get("title") !== null ) ? "Very Good" : params.get("checkedC")
  }

  function checked1() {
    return (params.get("checked1") === null && params.get("title") !== null ) ? "Math" : params.get("checked1")
  }

  function checked2() {
    return (params.get("checked2") === null && params.get("title") !== null ) ? "Computer Science" : params.get("checked2")
  }

  function checked3() {
    return (params.get("checked3") === null && params.get("title") !== null ) ? "Literature" : params.get("checked3")
  }

  function checked4() {
    return (params.get("checked4") === null && params.get("title") !== null ) ? "Biological" : params.get("checked4")
  }

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
                            label="Math" name="Math" value="Math"
          />
          <FormControlLabel control={<Checkbox checked={state.checked2} onChange={handleChange} name="checked2" />}
                            label="Computer Science" name="Computer Science" value="Computer Science"
          />
          <FormControlLabel control={<Checkbox checked={state.checked3} onChange={handleChange} name="checked3" />}
                            label="Literature" name="Literature" value="Literature"
          />
          <FormControlLabel control={<Checkbox checked={state.checked4} onChange={handleChange} name="checked4" />}
                            label="Biological" name="Biological" value="Biological"
          />
        </FormGroup>
        </section>
        <Button type="submit" variant="contained" color="primary" style={{ margin: "15px",marginTop:"21px", width : 200,}}>Search</Button>

        </form>

        </Drawer>
        </div>



      <h2>Search result - Books you can buy</h2>
      <div className={classes.tiles}>
        {!isEmpty(projects) &&
          projects.filter(e=>!e.value.delivery_status 
                        && e.value.wanting !== true 
                        && e.value.price <= upper()
                        && e.value.price >= lower()
                        && (e.value.status == checkedA()
                          || e.value.status == checkedB()
                          || e.value.status == checkedC())
                        && (e.value.category == checked1()
                          || e.value.category == checked2()
                          || e.value.category == checked3()
                          || e.value.category == checked4())
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
                project={project}
                sellerId={project && project.value.createdBy}
                users={users}
                auth={auth}
              />
            )
          })}
      </div>
    </div>
  )
}

export default ProjectsList