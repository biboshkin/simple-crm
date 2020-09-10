import React, { useState, useEffect, useCallback } from "react";
import { Table as TableUI } from "antd";

import { ColumnProps, ActionProps } from "../../constants/interfaces";
import { useTranslation } from "react-i18next";
import {
  getActions,
  getDataColumns,
  getFilteredDataSource,
  getEditableTableBody,
  getTableLocale,
  getColumn,
} from "./utils";
import { Header } from "./components";
import noop from "lodash/noop";

import style from "./table.module.scss";
import { getUpdatedEntityArray } from "../../utils";

interface TableProps {
  pageCount?: number;
  dataSource: any[];
  columns?: ColumnProps[];
  actions?: ActionProps[];
  loading: boolean;
  onDeleteRow?: (id: string) => void;
  onViewRow?: (id: string) => void;
  onSaveRow?: (record: any) => void;
  withSearch?: boolean;
  withTitle?: boolean;
  addButton?: JSX.Element;
}

export const Table = ({
  columns,
  pageCount = 10,
  dataSource,
  actions,
  loading,
  onDeleteRow = noop,
  onViewRow = noop,
  onSaveRow = noop,
  withSearch = false,
  withTitle = true,
  addButton,
}: TableProps) => {
  const [t] = useTranslation("table");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [searched, setSearched] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const handleChangePage = useCallback((page) => {
    setPageNumber(page);
  }, []);

  const handleSearch = useCallback(
    (inputSearch) => {
      setSearched(inputSearch);

      if (inputSearch) {
        const filtered = getFilteredDataSource(
          inputSearch,
          dataSource,
          columns
        );
        setFilteredDataSource(filtered as never[]);
        return;
      }

      setPageNumber(1);
      setFilteredDataSource([]);
    },
    [dataSource, filteredDataSource, columns]
  );

  const title = withTitle
    ? () => (
        <Header
          onSearch={handleSearch}
          withSearch={withSearch}
          button={addButton}
        />
      )
    : void 0;
  const source = searched ? filteredDataSource : dataSource;

  return (
    <TableUI
      className={style.table}
      size="middle"
      title={title}
      columns={[
        ...getDataColumns(columns, searched, onSaveRow),
        getActions(actions, t, searched, onDeleteRow, onViewRow),
      ]}
      dataSource={source.map((item) => ({ ...item, key: item.id }))}
      pagination={{
        defaultPageSize: pageCount,
        onChange: handleChangePage,
        current: pageNumber,
      }}
      components={getEditableTableBody()}
      rowClassName={() => style.editableRow}
      loading={loading}
      locale={getTableLocale(t)}
    />
  );
};

export default Table;
