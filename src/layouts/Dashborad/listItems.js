import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { DASHBOARD_PATH, POST_LIST_PATH,WANTING_POST_PATH } from 'constants/paths'
import HomeIcon from '@material-ui/icons/Home';
import Home from 'routes/Home'



export const mainListItems = (
  <div>
    <ListItem button component="a" href={DASHBOARD_PATH}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>   
      <ListItemText primary="Dashboard" />    
    </ListItem>
    <ListItem button component="a" href={POST_LIST_PATH}>
      <ListItemIcon>
        <AddShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Buy book" />
    </ListItem>
    <ListItem button component="a" href={WANTING_POST_PATH}>
      <ListItemIcon>
        <RemoveShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Sell book" />
    </ListItem>
  </div>
);

export const homeItem = (
  <div>
    <ListItem button component="a" href={Home.path}>
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText primary="Top" />
    </ListItem>
  </div>
);

export const loginItems = (
  <div>
    <ListSubheader inset>Account</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AccountBoxIcon />
      </ListItemIcon>
      <ListItemText primary="Log in" />
    </ListItem>
  </div>
);

export const logoutItems = (
  <div>
    <ListSubheader inset>Account</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <ExitToAppIcon />
      </ListItemIcon>
      <ListItemText primary="Log out" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports (coming soon)</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
);