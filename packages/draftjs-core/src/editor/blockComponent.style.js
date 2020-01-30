import { withStyles } from '@material-ui/core/styles';

export default withStyles(() => ({
  title: {
    display: 'inline-block',
    fontSize: 32,
    lineHeight: 1,
    // fontFamily: 'Palatino,Georgia,"Times New Roman",Times,serif',
    fontFamily: 'Roboto,"Times New Roman",Times,serif',
    marginBlockEnd: '0.4em',
    '&:before': {
      content: 'attr(data-section) ": "',
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 0.5 * 32,
      // fontWeight: 700,
      // lineHeight: 1,
      padding: '.2em .2em .2em 0em',
      // textTransform: 'uppercase',
      display: 'inline-block',
      // backgroundColor: '#F5F5F5',
      color: 'rgb(170, 170, 170)',
    },
    '& div': {
      display: 'inline',
    },
  },

  paragraph: {
    display: 'inline-block',
    marginBlockEnd: '0.6em',
  },
}));
