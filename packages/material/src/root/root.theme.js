import { createMuiTheme } from '@material-ui/core/styles';

import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

export default (defTheme = createMuiTheme()) => {
  return createMuiTheme({
    palette: {
      primary: purple, // Purple and green play nicely together.
      secondary: {
        ...green,
        A400: '#00e677',
      },
      error: red,
    },  
    status: {
      danger: 'orange',
    },
    typography: {
      // fontFamily: '-apple-system,system-ui,BlinkMacSystemFont,' +
      //   '"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
      versionFootNote: {
        fontWeight: defTheme.typography.fontWeightMedium,
        fontSize: 10,
      }
    }
  });
};
