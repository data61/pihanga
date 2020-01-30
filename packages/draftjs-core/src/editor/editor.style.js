import { withStyles } from '@material-ui/core/styles';

export default withStyles(theme => {
  const margin = theme.spacing(1);
  const padding = theme.spacing(1);
  return {
    outer: {
      //marginTop: theme.spacing(8),
      position: 'relative', // to allow inner elements to position relative to this
      border: '1px solid rgba(0, 0, 0, 0.055)',
      backgroundColor: 'white',
      margin,
      padding,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      height: `calc(100% - ${margin + padding}px)`,
    },
  };
});
