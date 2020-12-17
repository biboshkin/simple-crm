import React, { useEffect, useMemo } from "react";
import { Table as TableUI } from "antd";

import { ColumnProps, ActionProps, RecordType, State } from "../../constants";
import { useTranslation } from "react-i18next";
import {
  getActions,
  getDataColumns,
  getEditableTableBody,
  fetchDictionaries,
  SearchedAllContext,
  SearchedColumnsContext,
  TableActionsContext,
} from "./utils";
import { Header, TotalRow } from "./components";
import noop from "lodash/noop";

import style from "./table.module.scss";

import { setTableLoading } from "../../__data__";
import { Dispatch, bindActionCreators } from "@reduxjs/toolkit";
import { connect, useDispatch } from "react-redux";
import { TablePaginationConfig } from "antd/lib/table";

import TableServer from "./server-paging";
import TableClient from "./client-paging";

interface TableProps {
  dataSource: any[];
  columns?: ColumnProps[];
  actions?: ActionProps[];
  loading?: boolean;
  tableLoading: boolean;
  pagination?: TablePaginationConfig;
  _links?: any;
  onDeleteRow?: (id: string) => void;
  onViewRow?: (id: string) => void;
  onSaveRow?: (record: any) => void;
  onDoneRow?: (record: any) => void;
  onSearch?: (inputSearch: string) => void;
  onSearchColumn?: (
    selectedKeys: string[],
    confirm: any,
    column: ColumnProps
  ) => void;
  onResetAllFilters?: () => void;
  onResetFilter?: (column: ColumnProps, clearFilters: Function) => void;
  withSearch?: boolean;
  extraHeader?: JSX.Element;
  className?: string;
  permissions?: string[];
  onChangeTable?: (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any
  ) => void;
  searchAll?: string;
  searchedColumns?: RecordType;
  bordered?: boolean;
  total?: {
    title: string;
    count: number;
  };
}

export const Table = ({
  _links = {},
  columns,
  className,
  dataSource,
  actions,
  loading,
  tableLoading,
  pagination = { pageSize: 10 },
  onDeleteRow = noop,
  onViewRow = noop,
  onSaveRow = noop,
  onDoneRow = noop,
  onSearchColumn = noop,
  onResetFilter = noop,
  onResetAllFilters = noop,
  onSearch,
  withSearch = false,
  extraHeader,
  onChangeTable = noop,
  permissions = [],
  searchAll = "",
  searchedColumns = {},
  bordered = false,
  total,
}: TableProps) => {
  const [t] = useTranslation("table");
  const dispatch = useDispatch();

  useEffect(() => {
    const { self, ...links } = _links;
    fetchDictionaries(links, dispatch);
  }, [_links, dispatch]);

  const title =
    withSearch || extraHeader
      ? () => (
          <Header
            withSearch={withSearch}
            onSearch={onSearch}
            extra={extraHeader}
            onResetAllFilters={onResetAllFilters}
          />
        )
      : void 0;

  const footer = total ? () => <TotalRow {...total} /> : void 0;

  const dataSourceWithKeys = useMemo(
    () =>
      dataSource.map((item) => ({
        ...item,
        key: item.id,
      })),
    [dataSource]
  );

  return (
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
            title={title}
            columns={[
              ...getDataColumns(columns, searchedColumns, permissions),
              ...getActions(actions, t),
            ]}
            dataSource={dataSourceWithKeys}
            pagination={{ ...pagination }}
            components={getEditableTableBody()}
            rowClassName={() => style.editableRow}
            loading={loading || tableLoading}
            scroll={{ x: true }}
            bordered={bordered}
            footer={footer}
          />
        </TableActionsContext.Provider>
      </SearchedColumnsContext.Provider>
    </SearchedAllContext.Provider>
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
