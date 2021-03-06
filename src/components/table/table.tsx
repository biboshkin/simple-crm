import React, { ReactNode, useMemo } from "react";
import { BackTop, Table as TableUI } from "antd";

import { useTranslation } from "react-i18next";
import noop from "lodash/noop";
import { Dispatch, bindActionCreators } from "@reduxjs/toolkit";
import { connect } from "react-redux";
import { TablePaginationConfig } from "antd/lib/table";
import { TableRowSelection } from "antd/es/table/interface";
import {
  ColumnProps,
  ActionProps,
  RecordType,
  State,
  LinksType,
} from "../../constants";
import {
  getActions,
  getDataColumns,
  getEditableTableBody,
  SearchedAllContext,
  SearchedColumnsContext,
  TableActionsContext,
} from "./utils";

import style from "./table.module.scss";

import { setTableLoading } from "../../__data__";

import TableServer, { TableWithServerPagingProps } from "./server-paging";
import TableClient, { TableWithClientPagingProps } from "./client-paging";
import { SortColumnOrderProps } from "./constants";

interface TableExtendsProps {
  Server: React.FC<TableWithServerPagingProps>;
  Client: React.FC<TableWithClientPagingProps>;
}

interface TableProps {
  dataSource: any[];
  columns: ColumnProps[];
  actions?: ActionProps[];
  tableLoading: boolean;
  pagination?: TablePaginationConfig;
  links: LinksType;
  onDeleteRow?: (id: string) => void;
  onViewRow?: (id: string) => void;
  onSaveRow?: (record: any) => void;
  onDoneRow?: (record: any) => void;
  onSearch?: (inputSearch: string) => void;
  onSearchColumn?: (
    searched: string,
    confirm: any,
    column: ColumnProps
  ) => void;
  onResetAllFilters?: () => void;
  onResetFilter?: (column: ColumnProps, clearFilters: Function) => void;
  tableHeader?: () => JSX.Element;
  sortOrder?: SortColumnOrderProps;
  className?: string;
  permissions?: string[];
  onChangeTable?: (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => void;
  searchAll?: string;
  rowSelection?: TableRowSelection<any>;
  searchedColumns?: RecordType;
  footer?: ReactNode;
  withLocalSort?: boolean;
  bordered?: boolean;
}

export const Table: React.FC<TableProps> & TableExtendsProps = ({
  links,
  columns,
  className,
  dataSource,
  actions,
  tableLoading,
  pagination = { pageSize: 10 },
  onDeleteRow = noop,
  onViewRow = noop,
  onSaveRow = noop,
  onDoneRow = noop,
  onSearchColumn = noop,
  onResetFilter = noop,
  tableHeader,
  sortOrder,
  onChangeTable = noop,
  permissions = [],
  searchAll = "",
  searchedColumns = {},
  rowSelection,
  bordered = false,
  withLocalSort = true,
  footer,
}) => {
  const [t] = useTranslation("table");

  const dataSourceWithKeys = useMemo(
    () =>
      dataSource.map((item) => ({
        ...item,
        key: item.id,
      })),
    [dataSource]
  );

  return (
    <>
      <SearchedAllContext.Provider value={searchAll}>
        <SearchedColumnsContext.Provider value={searchedColumns}>
          <TableActionsContext.Provider
            value={{
              onSaveRow,
              onDeleteRow,
              onViewRow,
              onDoneRow,
              onSearchColumn,
              onResetFilter,
            }}
          >
            <TableUI
              className={className}
              onChange={onChangeTable}
              size="middle"
              title={tableHeader}
              columns={[
                ...getDataColumns(
                  columns,
                  searchedColumns,
                  withLocalSort,
                  sortOrder,
                  permissions
                ),
                ...getActions(actions, t),
              ]}
              dataSource={dataSourceWithKeys}
              pagination={pagination}
              components={getEditableTableBody()}
              rowClassName={() => style.editableRow}
              loading={tableLoading}
              scroll={{ x: true }}
              bordered={bordered}
              rowSelection={rowSelection}
              footer={footer ? () => footer : undefined}
            />
          </TableActionsContext.Provider>
        </SearchedColumnsContext.Provider>
      </SearchedAllContext.Provider>
      <BackTop style={{ marginBottom: "50px" }} />
    </>
  );
};

const mapStateToProps = (state: State) => ({
  tableLoading: state?.app?.tableLoading,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ setTableLoading }, dispatch);

Table.Server = TableServer;
Table.Client = TableClient;

export default connect(mapStateToProps, mapDispatchToProps)(Table);
