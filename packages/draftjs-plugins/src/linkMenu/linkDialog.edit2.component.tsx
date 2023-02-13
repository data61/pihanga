/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-use-before-define */
// import React = require('react');
import * as React from 'react';
// import React from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
// import LocationOnIcon from '@material-ui/icons/LocationOn';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// import { makeStyles } from '@material-ui/core/styles';
// import parse from 'autosuggest-highlight/parse';
// import throttle from 'lodash/throttle';
import { isUri } from 'valid-url';

import { LinkEntityState } from './index';
import styled from './linkDialog.edit2.style';

export const Source2Icon = {
  DuckDuckGo: 'https://duckduckgo.com/favicon.ico',
} as {[name: string]: string};

type LinkDialogType = {
  value: string;
  link: LinkEntityState;
  editorID: string;

  search?: Search;
  options: any[];
  optionSnippetLength: number;

  onSelected: any;
  onValue: any;
  onClose: any;
  classes: any;
};

// type OptionElement = {
//   url: string;
//   title?: string;
//   snippet?: string;
//   source?: string;
// }

type Search = {
  query: string;
  result: LinkEntityState[];
}

function isURL(url: string): boolean {
  return isUri(url);
}

export const LinkDialogEdit = styled((props: LinkDialogType) => {
  const {
    value,
    link,
    editorID,

    search,
    // options,
    optionSnippetLength = 60,

    onSelected,
    onValue,
    onClose,
    classes,
  } = props;
  const closeTimeout = React.useRef<any>();
  const isNotUrl = React.useRef<boolean>(false); // prevent <RET> on non url entry

  let options: LinkEntityState[] = [];
  if (search && value && value.startsWith(search.query || '')) {
    console.log('SEARCH', value, search);
    options = search.result;
  }

  // // eslint-disable-next-line no-shadow
  // const dispatch = (opts: string, f: any) => {
  //   f({ editorID, value });
  // };

  function onChange(e: React.ChangeEvent<{}>, l: LinkEntityState | null) {
    isNotUrl.current = false; // changed entry
    const url = l ? l.url : '';
    onValue({ editorID, value: url, link: l });
    return false;
  }

  function onInputChange(_: React.ChangeEvent<{}>, v: string) {
    if (v !== value) {
      isNotUrl.current = false; // changed entry
      onValue({ editorID, value: v, link: { url: v } });
    }
    return false;
  }

  /**
   * Currently we trigger a 'onClose' event when this dialog looses focus. However,
   * we still trigger an 'onBlur' event when we try to switch between the two text
   * fields. So we delay the 'onClose' by a bit and delete the timeout if in the
   * mean time the other filed gets focus.
   *
   * Maybe a cleaner solution is to look at the selection, like 'linkDialog.display'
   * or add a 'cancel' button to exit the dialog prematurely.
   */
  function onBlur() {
    // console.log("LINK BLUR");
    closeTimeout.current = setTimeout(() => {
      closeTimeout.current = null;
      onClose({ editorID });
    }, 100) as any;
  }

  function onFocus() {
    // console.log("LINK FOCUS");
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
      closeTimeout.current = null;
    }
  }

  function checkSubmit(e: any) {
    if (e && e.keyCode === 13) {
      console.log('>>>>>END', value, link.url);
      if (isURL(value)) {
        onSelected({ editorID, link });
        onClose({ editorID });
      } else {
        isNotUrl.current = true;
        onValue({ editorID, value, link }); // force repaint of text field
      }
      e.preventDefault();
    }
    return false;
  }
  function renderInput(params: any) {
    const isError = isNotUrl.current;
    const label = `Link${isError ? ' - not a valid url' : ''}`;
    return (
      <TextField
        {...params}
        label={label}
        inputProps={{ ...params.inputProps, onKeyUp: checkSubmit }}
        variant="outlined"
        autoFocus
        fullWidth
        onFocus={onFocus}
        error={isError}
      />
    );
  }

  function ellipseText(text: string, length:number = optionSnippetLength) {
    if (text.length <= length) return text;

    // Note: Seem to require funky type gymnastic
    const { line } = text.split(' ').reduce((p, w) => {
      if (p.cnt > length) return p;

      const wl = w.length;
      return { line: p.line.concat(w), cnt: p.cnt + wl };
    }, { line: [] as string[], cnt: 0 } as any) as {line: string[]; cnt: number};
    return `${line.join(' ')}...`;
  }

  function renderOptionIcon(option: LinkEntityState) {
    if (option.source) {
      const icon = Source2Icon[option.source];
      if (icon) {
        return <img className={classes.icon} src={icon} alt={option.title} />;
      }
    }
    return null;
  }

  function renderOption(option: LinkEntityState) {
    return (
      <Grid container alignItems="flex-start">
        <Grid item>
          { renderOptionIcon(option) }
        </Grid>
        <Grid item xs>
          <Typography variant="body1">
            {option.title}
          </Typography>
          { renderOptionSnippet(option) }
        </Grid>
      </Grid>
    );
  }

  function renderOptionSnippet(option: LinkEntityState) {
    if (!option.snippet) {
      return null;
    } else {
      return (
        <Typography variant="body2" color="textSecondary">
          {ellipseText(option.snippet)}
        </Typography>
      );
    }
  }

  function getOptionLabel(option: LinkEntityState) {
    return option.url;
  }

  function filterOptions(x: any) {
    return x;
  }

  return (
    <Paper className={classes.paper}>
      <Autocomplete
        id="linkDialog-edit-url"
        value={{ url: value || '' }}
        onChange={onChange}
        onInputChange={onInputChange}
        className={classes.autoComplete}
        getOptionLabel={getOptionLabel}
        filterOptions={filterOptions}
        options={options}
        autoComplete
        includeInputInList
        freeSolo
        // disableOpenOnFocus
        renderInput={renderInput}
        renderOption={renderOption}
        size="small"
        onBlur={onBlur}
        open
      />
    </Paper>
  );
});

export default LinkDialogEdit;
