import React, { useCallback, useContext } from "react";
import { Select } from "antd";
import { SearchFooter } from ".";
import { WithTranslation, withTranslation } from "react-i18next";
import { ColumnProps, State } from "../../../../constants";
import { flow } from "lodash";
import { connect } from "react-redux";
import { TableActionsContext } from "../../utils";

interface EntitySearchProps extends WithTranslation {
  column: ColumnProps;
  setSelectedKeys: any;
  setRef: any;
  selectedKeys: any;
  confirm: string;
  clearFilters: any;
  dictionaries: any;
}

export const EntitySearch = ({
  t,
  setSelectedKeys,
  column,
  selectedKeys,
  confirm,
  clearFilters,
  dictionaries,
}: EntitySearchProps) => {
  const options = dictionaries?.[column.columnCode] ?? [];
  const { onSearchColumn } = useContext(TableActionsContext);
  const [searched] = selectedKeys;

  const handleChange = useCallback(
    (value: string) => {
      setSelectedKeys([value]);
    },
    [setSelectedKeys]
  );

  const handleSearch = useCallback(() => {
    onSearchColumn(searched, confirm, column);
  }, [selectedKeys, confirm, column]);

  return (
    <div style={{ padding: 8 }}>
      <Select
        showSearch
        style={{ width: 190, display: "block", marginBottom: 8 }}
        placeholder={t("placeholder.entity")}
        optionFilterProp="children"
        value={selectedKeys[0]}
        onChange={handleChange}
        filterOption={(input, option) =>
          option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {options.map((o: any) => {
          const value = o?.[column?.valueField ?? ""];
          const title = o?.[column?.titleField ?? ""];
          return (
            <Select.Option key={value} value={value}>
              {title}
            </Select.Option>
          );
        })}
      </Select>
      <SearchFooter
        onSearch={handleSearch}
        column={column}
        clearFilters={clearFilters}
      />
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  dictionaries: state?.data?.dictionaries,
});

export default flow([
  connect(mapStateToProps),
  withTranslation(["columnSearch"]),
])(EntitySearch);