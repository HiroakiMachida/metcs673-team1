export default theme => ({
  root: {
    ...theme.flexColumnCenter,
    paddingTop: theme.spacing(1),
    flexGrow: '2',
    boxSizing: 'border-box',
    overflowY: 'scroll',
    alignItems: 'left'
  },
  tiles: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '-webkit-flex-flow': 'row wrap'
  },
  h2: {
    align: 'left'
  }
})
