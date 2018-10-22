
import React from 'react';
import sortBy from 'lodash/sortBy';
import classNames from 'classnames';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination  from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { N1PropTypes } from 'n1-core';
import { createScratch } from 'n1-core/app';

import { clickSortColumn, gotoPage, setRowsPerPage } from './table.actions';
import { LinkComponent } from '../link';
import styled from './table.style';

export const DEF_ROWS_PER_PAGE = [10, 25, 100];

export const TableComponent = styled(({ 
  id, data, columns, onRowSelected, onColumnSelected,
  dataSize = data.size, dataOffset = 0,
  title,
  showHeader = true, showFooter = false, 
  rowsPerPage, rowsPerPageOptions = DEF_ROWS_PER_PAGE,
  initOrder = 'asc',
  scratch, classes 
}) => {
  let state;
  if (!(scratch.table && scratch.table[id])) {
    const s = {};
    s.rowsPerPage = rowsPerPage || rowsPerPageOptions[0] || 10;
    const c = columns.find(c => c.sortable);
    if (c) {
      s.orderBy = c.id;
      s.order = initOrder;
    }
    setTimeout(() => createScratch(['table', id], s));
    return (<div />);
  }
  state = scratch.table[id];
  if (!rowsPerPage) {
    rowsPerPage = state.rowsPerPage || rowsPerPageOptions[0] || 10;
  }

  let rows = data;
  if (state.orderBy) {
    rows = sortBy(rows, [state.orderBy]);
    if (state.order === 'desc') {
      rows = rows.reverse();
    }
  }

  const onSortingChange = (column) => {
    let order = 'asc';
    if (state.orderBy === column.id) {
      order = state.order === 'asc' ? 'desc' : 'asc';
    }
    clickSortColumn(id, column.id, order, dataOffset, rowsPerPage);
  }

  // TODO: A bit of a hack to further customize column cells. 
  // Need to find cleaner solution
  const colCellClasses = {};
  columns.map(c => {
    const p = c.padding || 'default';
    const sn = 'tableCell_' + p;
    const ov = [];
    if (classes[sn]) ov.push(classes[sn]);
    if (c.fill === true) {
      ov.push(classes.tableCell_fill);
    }
    colCellClasses[c.id] = ov.length > 0 ? classNames(...ov, classes.tableCell) : classes.tableCell;
    return c;
  });

  const renderTitle = () => {
    if (title) {
      return (
        <Typography type="headline" component="h3" className={classes.title}>
          { title }
        </Typography>
      );
    }
  }
  const renderHeaderCells = () => {
    return columns
    .filter(c => c.visible === undefined || c.visible === true)
    .map(column => (
      <TableCell
        key={column.id}
        numeric={column.numeric}
        padding={column.padding || 'default'}
        className={colCellClasses[column.id]}
      >
        <TableSortLabel
          active={state.orderBy === column.id}
          direction={state.order}
          onClick={() => onSortingChange(column)}
        >
          {column.label}
        </TableSortLabel>
      </TableCell>
    ));
  };

  const renderHeader = () => {
    if (showHeader) {
      return (
        <TableHead>
          <TableRow className={classes.table_head_row}>
            { renderHeaderCells() }
          </TableRow>
        </TableHead>
      );
    }
  }

  const columnValue = (row, column) => {
    if (column.value) {
      return column.value(row);
    } 
    const v = row[column.id];
    if (column.onSelect) {
      return (
        <LinkComponent onClick={() => column.onSelect(row)}>{v}</LinkComponent>
      )
    } else {
      return v;
    }
  }

  const renderRows = () => {
    const keyCol = (columns.find(c => c.isKey === true) || columns[0]).id;
    return rows.map(row => {
      const key = row[keyCol];
      return (
        <TableRow
          hover
          onClick={ () => { if (onRowSelected) onRowSelected(row); } }
          key={key}
        >
          { columns
            .filter(c => c.visible === undefined || c.visible === true)
            .map(column => {
              const value = columnValue(row, column);
              const cn = colCellClasses[column.id]; // classes.tableCell
              return (
                <TableCell
                  key={column.id}
                  numeric={column.numeric}
                  padding={column.padding || 'default'}
                  onClick={ () => { if (onColumnSelected) onColumnSelected({value, column, row}); } }
                  className={ cn }
                >
                  { value }
                </TableCell>
          )})}
        </TableRow>      
      );
    });
  };


  function onChangePage(ev, page) {
    const o = page * rowsPerPage;
    const offset = o < 0 ? 0 : o;
    gotoPage(id, offset, rowsPerPage, state.orderBy, state.order);
  }

  function onChangeRowsPerPage(evt) {
    const t = evt.target;
    const rpp = t.value;
    setRowsPerPage(id, rpp);
    gotoPage(id, dataOffset, rpp, state.orderBy, state.order);
  }

  const renderFooter = () => {
    if (! showFooter) return;

    const page = Math.round(dataOffset / rowsPerPage);
    return (
      <TableFooter>
        <tr>
          <TablePagination
            count={dataSize}
            rowsPerPage={state.rowsPerPage || 10}
            page={page}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
            rowsPerPageOptions={ [10, 25, 100] }
          />
        </tr>
      </TableFooter>
    );
  }

  return (
    <Paper className={classes.paper}>
      { renderTitle() }
      <Table>
        { renderHeader() }
        <TableBody>
          { renderRows() }
        </TableBody>
        { renderFooter() }
      </Table>
    </Paper>
  );

});

TableComponent.propTypes = {
  id: N1PropTypes.string.isRequired,
  data: N1PropTypes.array.isRequired,
  columns: N1PropTypes.array.isRequired,
  onRowSelected: N1PropTypes.func,
  scratch: N1PropTypes.shape().isRequired,
};


