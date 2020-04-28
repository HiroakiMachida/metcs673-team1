export default theme => ({
  root: {
    ...theme.flexColumnCenter,
    paddingTop: theme.spacing(4),
    flexGrow: '2',
    boxSizing: 'border-box',
    overflowY: 'scroll'
  },
  tiles: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '-webkit-flex-flow': 'row wrap'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
})
