
import { withStyles } from '@material-ui/core/styles';

export default withStyles(theme => ({
  paper: {
    width: '100%',
    marginTop: 0,
    overflowX: 'auto',
  },
  title: {
    marginLeft: theme.spacing.unit(3),
    marginTop: theme.spacing.unit(2),
    marginBottom: theme.spacing.unit(1),
  },
  tableCell: {
    cursor: 'pointer',
    width: 'auto',
  },
  tableCell_dense: {
    paddingRight: 5,
    paddingLeft: 10,
  },
  tableCell_fill: {
    width: '100%',
  },
  table_head_row: {
    height: 40,
  },
}));
