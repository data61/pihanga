
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

import { Card, PiPropTypes } from '@pihanga/core';

import { LinkComponent } from '../../component/link';
import styled from './table.style';

export const DEF_ROWS_PER_PAGE = [10, 25, 100];

export const TableCardComponent = styled(({ 
  data, 
  columns,
  orderBy,
  orderDir = 'asc',
  onRowSelected, onColumnSelected,
  clickSortColumn, gotoPage, setRowsPerPage,
  dataOffset = 0,
  title,
  showHeader = true, 
  rowsPerPage = DEF_ROWS_PER_PAGE[0], 
  rowsPerPageOptions = DEF_ROWS_PER_PAGE,
  classes 
}) => {
  let rows = data;
  const dataSize = data.length;
  if (!orderBy) {
    // find first sortable one as default
    orderBy = columns.find(c => c.sortable);
  }
  if (orderBy) {
    rows = sortBy(rows, [orderBy]);
    if (orderDir === 'desc') {
      rows = rows.reverse();
    }
  }
  rows = rows.slice(dataOffset, rowsPerPage);
  const showFooter = dataSize !== rows.length;

  const onSortingChange = (column) => {
    let order = 'asc';
    if (orderBy === column.id) {
      order = orderDir === 'asc' ? 'desc' : 'asc';
    }
    clickSortColumn({orderBy: column.id, orderDir: order});
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
    if (c.overflow === true) {
      ov.push(classes.tableCell_overflow);
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
        align={column.align || column.numeric ? 'right' : 'left' }
        padding={column.padding || 'default'}
        className={colCellClasses[column.id]}
        style={column.headerStyle}
      >
        <TableSortLabel
          active={orderBy === column.id}
          direction={orderDir}
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

  const renderColumnValue = (row, column) => {
    if (column.renderer) {
      return (<Card cardName={column.renderer} row={row} column={column}/>);
    } 
    let v = column.value ? column.value(row) : row[column.id];
    if (isNaN(v) && typeof v !== 'string' ) {
      v = (<pre>{JSON.stringify(v, null, 2)}</pre>);
    }
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
          onClick={ () => { if (onRowSelected) onRowSelected({row}); } }
          key={key}
        >
          { columns
            .filter(c => c.visible === undefined || c.visible === true)
            .map(column => {
              const value = renderColumnValue(row, column);
              const cn = colCellClasses[column.id]; // classes.tableCell
              return (
                <TableCell
                  key={column.id}
                  align={column.align | column.numeric ? 'right' : 'left' }
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
    if (offset === dataOffset) {
      // same value, ignore
      return;
    }
    gotoPage({offset, rowsPerPage, orderBy, orderDir});
  }

  function onChangeRowsPerPage(evt) {
    const t = evt.target;
    const rpp = t.value;
    if (rpp === rowsPerPage) {
      // same value, igonore
      return;
    }
    setRowsPerPage({rowsPerPage: rpp});
    gotoPage({dataOffset, rowsPerPage: rpp, orderBy, orderDir});
  }

  const renderFooter = () => {
    if (! showFooter) return;

    const page = Math.round(dataOffset / rowsPerPage);
    return (
      <TableFooter>
        <tr>
          <TablePagination
            count={dataSize}
            rowsPerPage={rowsPerPage || 10}
            page={page}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
            rowsPerPageOptions={ rowsPerPageOptions }
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

TableCardComponent.propTypes = {
  data: PiPropTypes.array.isRequired,
  columns: PiPropTypes.array.isRequired,
  onRowSelected: PiPropTypes.func,
};


