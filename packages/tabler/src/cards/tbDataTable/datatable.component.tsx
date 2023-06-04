import React, { Fragment } from 'react';
import { Card, PiCardSimpleProps, ReduxActionExt, dispatch } from '@pihanga/core';
import { IconCaretRight, IconCaretDown, IconBell, IconStar } from '@tabler/icons-react';
import { TbButtonType } from '../constants';

type DEF_ROW_TYPE = { [k: string]: any }

export type ComponentProps<D = DEF_ROW_TYPE> = {
  columns: Column[];
  data: Row<D>[];
  rowSelectionActionTemplate?: RowSelectActionTemplate<D>;
  showDetailActionTemplate?: ShowDetailActionTemplate;
  dataFormatter?: ColumnDict<ColumnFormatter>;
  hasDetails?: boolean; // if true rows could show details
  manageDetails?: boolean; // when true internally manage which detail card to show
  showLimit?: number; // max number of results to show (might be less than data)
  dataOffset?: number; // number of preceeding values not shown
  hasMore?: boolean; // true when there are more entries to display
  recordCount?: number; // number of records in dataset -1 .. unknown
  showPageSizeSelector?: boolean;
  showSearch?: boolean;
  cardOnEmpty?: string; // card to display when no items are available
};

export type ColumnFormatter = (el: any, column: Column) => string

export type Column = {
  label: string;
  title: string;
  type?: ColumnType;
  sortable?: boolean;
}

// Whenever something is added to ColumnType, also add it to ColumnDict
export enum ColumnType {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
  Progress = 'progress',
  Button = 'button',
  Hidden = 'hidden',
}

// Can't make [k in ColumnType]:T work for optional (?) values
type ColumnDict<T> = {
  string?: T;
  number?: T;
  boolean?: T;
  date?: T;
  progress?: T;
  button?: T;
  hidden?: T;
}

export type Row<T = DEF_ROW_TYPE> = {
  id: string | number;
  data: T; //{ [k: string]: T };
  detailCard?: string;
}

export type DetailContext<T = DEF_ROW_TYPE> = {
  row: Row<T>;
}

export type ShowDetailActionTemplate<T = DEF_ROW_TYPE> = ReduxActionExt & {
  row: Row<T>;
};

export type RowSelectEvent<T = DEF_ROW_TYPE> = {
  row: Row<T>;
};

export type RowSelectActionTemplate<T = DEF_ROW_TYPE> = ReduxActionExt & {
  row: Row<T>;
};

export type ColSortEvent = {
  isAscending: boolean;
  col: Column;
};


type ExtColumn = Column & {
  isDetail?: boolean;
}

const DetailColumn: ExtColumn = {
  label: 'details',
  title: '', // nothing to show in header
  type: ColumnType.String, // ignored
  sortable: false,
  isDetail: true,
}

type ButtonColumn = Column & {
  type: ColumnType.Button,
  refTitle?: string; // when set, take button title from respective row field
  buttonType?: TbButtonType;
}

export type DetailEvent<T = DEF_ROW_TYPE> = {
  row: Row<T>;
};

export type ShowDetailEvent<T = DEF_ROW_TYPE> = DetailEvent<T>;
export type HideDetailEvent<T = DEF_ROW_TYPE> = DetailEvent<T>;
export type ButtonEvent<T = DEF_ROW_TYPE> = {
  label: string;
  row: Row<T>;
}

type ComponentT<T> = ComponentProps<T> & {
  onRowSelect: (ev: RowSelectEvent<T>) => void;
  onColumnSort: (ev: ColSortEvent) => void;
  onShowDetail: (ev: ShowDetailEvent<T>) => void;
  onHideDetail: (ev: HideDetailEvent<T>) => void;
  onButtonClicked: (ev: ButtonEvent<T>) => void;
};

//export const Component = <T = DEF_ROW_TYPE,>(props: PiCardSimpleProps<ComponentT<T>>) => {
export function Component<T = DEF_ROW_TYPE>(props: PiCardSimpleProps<ComponentT<T>>) {
  const {
    columns = [],
    data = [],
    rowSelectionActionTemplate,
    showDetailActionTemplate,

    dataFormatter = {},
    hasDetails,
    manageDetails,
    showLimit = 10,
    dataOffset = 0,
    hasMore,
    recordCount = -1,
    showSearch,
    showPageSizeSelector,
    cardOnEmpty,
    onRowSelect,
    onColumnSort,
    onShowDetail,
    onHideDetail,
    onButtonClicked,
    cardName,
  } = props;
  const [showingDetail, setShowingDetail] = React.useState<Set<string | number>>(new Set<string | number>())

  const cols: ExtColumn[] = hasDetails ? [DetailColumn, ...columns] : columns
  const visibleCols = cols.filter((c) => c.type !== ColumnType.Hidden)

  function rowClicked(row: Row<T>) {
    if (hasDetails) {
      toggleDetails(row)
    } else {
      onRowSelect({ row })
    }
  }

  function sortClicked(col: Column, ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const t = ev.target as HTMLButtonElement;
    const cls = t.className
    const isAscending = cls.includes('asc')
    onColumnSort({ isAscending, col })
  }

  function isDetailShowing(row: Row<T>): boolean {
    if (manageDetails) {
      return showingDetail.has(row.id)
    } else {
      return row.detailCard != null
    }
  }

  function detailsIconClicked(row: Row<T>, ev: React.MouseEvent) {
    toggleDetails(row)
    ev.stopPropagation()
  }

  function buttonClicked(row: Row<T>, column: Column, ev: React.MouseEvent) {
    onButtonClicked({ label: column.label, row })
    ev.stopPropagation()
  }

  function toggleDetails(row: Row<T>) {
    if (isDetailShowing(row)) {
      // hide detail
      if (manageDetails) {
        showingDetail.delete(row.id)
        setShowingDetail(new Set(showingDetail))
      }
      onHideDetail({ row })
    } else {
      // show detail
      if (manageDetails) {
        showingDetail.add(row.id)
        setShowingDetail(new Set(showingDetail))
      }
      if (showDetailActionTemplate) {
        dispatch({
          ...showDetailActionTemplate,
          row,
        })
      } else {
        onShowDetail({ row })
      }
    }

  }

  function renderHeader() {
    if (!(showSearch || showPageSizeSelector)) return null;

    return (
      <div className="card-body border-bottom py-3">
        <div className="row">
          <div className="col">
            {renderSearch()}
          </div>
          <div className="col-auto d-flex">
            {renderPageSizeSelector()}
          </div>
        </div>
      </div>
    )
  }

  function renderSearch() {
    if (!showSearch) return null;

    return (
      <div className="ms-auto text-muted">
        Search:
        <div className="ms-2 d-inline-block">
          <input type="text" className="form-control form-control-sm" aria-label="Search invoice" />
        </div>
      </div>

    )
  }

  function renderPageSizeSelector() {
    if (!showPageSizeSelector) return null;
    return (
      <div className="text-muted">
        Show
        <div className="mx-2 d-inline-block">
          <input type="text" className="form-control form-control-sm" value={showLimit} size={3} aria-label="Invoices count" />
        </div>
        entries
      </div>
    )
  }

  function renderTable() {
    return (
      <table className={`table table-hover pi-table`}>
        <thead>
          <tr>
            {visibleCols.map(renderColumnHeader)}
          </tr>
        </thead>
        <tbody className="table-tbody">
          {renderTableContent()}
        </tbody>
      </table>
    )
  }

  function renderTableContent() {
    if (data.length === 0 && cardOnEmpty) {
      return renderCardOnEmpty(cardOnEmpty)
    }
    return data.map(renderRow)
  }

  function renderColumnHeader(col: Column, idx: number) {
    return (
      <th key={idx} className={`pi-th pi-th-${col.label} pi-th-${col.type || ColumnType.String}`}>
        {col.sortable && (
          <button className="table-sort"
            onClick={(el) => sortClicked(col, el)}
            data-sort={`sort-${col.label}`}
          >{col.title}</button>)}
        {!col.sortable ? col.title : null}
      </th>
    )
  }

  function getColValue(name: string, row: Row<T>): any {
    const d = row.data as { [k: string]: any }
    return d[name]
  }

  function renderRow(row: Row<T>, idx: number) {
    // console.log(">>ROW", row)
    // return (
    //   <Fragment key={row.id || idx}>
    //     <tr className={`pi-tr pi-tr-${row.id}`} onClick={() => rowClicked(row)} key={row.id || idx}>
    //       {visibleCols.map((c, idx) => renderCell(getColValue(c.label, row), c, row, idx))}
    //     </tr>
    //     {renderDetailCard(row, idx)}
    //   </Fragment >
    // )
    return (
      <>
        <tr className={`pi-tr pi-tr-${row.id}`} onClick={() => rowClicked(row)} key={row.id || idx}>
          {visibleCols.map((c, idx) => renderCell(getColValue(c.label, row), c, row, idx))}
        </tr>
        {renderDetailCard(row, idx)}
      </>
    )
  }

  function renderCell(value: unknown, col: ExtColumn, row: Row<T>, idx: number) {
    const f = col.type ? dataFormatter[col.type] : undefined
    if (f) {
      value = f(value, col)
    } else {
      if (col.isDetail) {
        return renderDetailsIcon(row, idx)
      }
      if (value && col.type === ColumnType.Progress) {
        return renderProgressBar(value as number, col, idx);
      }
      if (col.type === ColumnType.Button) {
        return renderButton(col as ButtonColumn, row, idx);
      }
    }
    return (
      <td key={idx} className={`sort-${col.label} pi-td pi-td-${col.label}`}>{`${value}`}</td>
    )
  }

  function renderDetailsIcon(row: Row<T>, idx: number) {
    const icon = isDetailShowing(row) ? <IconCaretDown /> : <IconCaretRight />
    return (
      <td key={idx} className={`pi-th pi-td-details-caret`}>
        <button className="btn btn-icon pi-td-details-caret" onClick={(ev) => detailsIconClicked(row, ev)}>{icon}</button>
      </td>
    )
  }

  function renderProgressBar(v: number, col: Column, idx: number) {
    return (
      <td className={`sort-${col.label}`} data-progress={v} key={idx}>
        <div className="row align-items-center">
          <div className="col-12 col-lg-auto">{v}%</div>
          <div className="col">
            <div className="progress" style={{ width: '5rem' }}>
              {/* <div className="progress-bar" style={{ width: '30%' }} role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="100" aria-label="30% Complete"> */}
              <div className="progress-bar" style={{ width: `${v}%` }} role="progressbar" aria-label={`${v}% Complete`}>
                <span className="visually-hidden">{`${v}% Complete`}</span>
              </div>
            </div>
          </div>
        </div>
      </td>
    )
  }

  function renderButton(col: ButtonColumn, row: Row<T>, idx: number) {
    const cls = ['pi-tb-datatable-button',
      `pi-tb-datatable-button-${col.label}`,
      `pi-tb-datatable-button-${col.label}-${cardName}`,
      'btn', `btn-${col.buttonType ? col.buttonType : TbButtonType.Primary}`,
    ]
    const title = col.refTitle ? getColValue(col.refTitle, row) : col.title
    return (
      <td key={idx} className={`pi-th pi-td-button`}>
        <button onClick={(ev) => buttonClicked(row, col, ev)}
          className={`${cls.join(' ')}`}
        >{title || '???'}</button>
      </td>
    )
  }

  function renderDetailCard(row: Row<T>, idx: number) {
    if (row.detailCard == null || !isDetailShowing(row)) return null

    return (
      <tr className={`pi-tb-datatable-tr-detail pi-pi-tb-datatable-tr-detail-${row.detailCard}`} key={`${row.id || idx}-detail`}>
        <td colSpan={100}>
          <Card cardName={row.detailCard} cardKey={row.id} row={row} />
        </td>
      </tr>
    )
  }

  function renderCardOnEmpty(cardName: string) {
    return (
      <tr className={`pi-tb-datatable-tr-empty-card pi-tb-datatable-tr-empty-card-${cardName}`}>
        <td colSpan={100}>
          <Card cardName={cardName} />
        </td>
      </tr >
    )
  }


  function renderFooter() {
    if (recordCount <= 0) {
      // don't show footer if we don't know how many records there are
      return null
    }

    const from = dataOffset + 1
    const to = dataOffset + data.length
    const totalF = () => {
      if (recordCount < 0) {
        return null
      } else {
        return (<>&nbsp;of <span>{recordCount}</span></>)
      }
    }
    return (
      <div className="card-footer d-flex align-items-center">
        <p className="m-0 text-muted">
          Showing <span>{from}</span> to <span>{to}</span>{totalF()}&nbsp;entries
        </p>
        <ul className="pagination m-0 ms-auto">
          {renderPrevPage()}
          {renderPages()}
          {renderNextPage()}
        </ul>
      </div>
    )
  }

  function renderPages() {
    if (recordCount < 0) return null;

    const pages = recordCount > 0 ? Math.ceil(recordCount / showLimit) : -1
    return (
      <>
        <li key={0} className="page-item"><a className="page-link" href="#">1</a></li>
        <li key={1} className="page-item active"><a className="page-link" href="#">2</a></li>
        <li key={2} className="page-item"><a className="page-link" href="#">3</a></li>
        <li key={3} className="page-item"><a className="page-link" href="#">4</a></li>
        <li key={4} className="page-item"><a className="page-link" href="#">5</a></li>
      </>
    )
  }

  function renderPrevPage() {
    const disabled = dataOffset === 0;

    return (
      <li className={disabled ? "page-item disabled" : "page-item"} key="prev-page">
        <a className="page-link" href="#" aria-disabled={disabled}>
          <svg xmlns="http://www.w3.org/2000/svg"
            className="icon" width="24" height="24" viewBox="0 0 24 24"
            strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <polyline points="15 6 9 12 15 18" />
          </svg>
          prev
        </a>
      </li>
    )
  }

  function renderNextPage() {
    const disabled = !hasMore
    return (
      <li className={disabled ? "page-item disabled" : "page-item"} key="next-page">
        <a className="page-link" href="#" aria-disabled={disabled}>
          next
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24"
            strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </a>
      </li>
    )
  }

  //   function renderShowingRecordCount() {
  //     if true {
  //       return (Showing < span > { from }</span > to < span > { to }</span > { totalF() } & nbsp;entries)
  // ) 
  //     }
  //   }

  return (
    <div className={`pi-tb-datatable pi-tb-datatable-${cardName}`} data-pihanga={cardName}>
      {renderHeader()}
      <div id="table-default" className="table-responsive" >
        {renderTable()}
      </div>
      {renderFooter()}
    </div>
  );
}

