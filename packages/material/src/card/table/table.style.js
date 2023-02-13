
import { withStyles } from '@material-ui/core/styles';

export default withStyles(theme => ({
  paper: {
    width: '100%',
    marginTop: 0,
    overflowX: 'auto',
  },
  title: {
    marginLeft: theme.spacing(3),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
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
  tableCell_overflow: { // need to set 'width' in header cells
    maxWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whitSpace: 'nowrap',
  },
  table_head_row: {
    height: 40,
  },
}));
