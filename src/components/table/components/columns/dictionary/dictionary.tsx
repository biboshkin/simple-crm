import React, { useContext } from "react";
import { connect } from "react-redux";
import { State, ColumnProps, RecordType } from "../../../../../constants";
import { HighlightTextWrapper } from "../../../../../wrappers";
import { SearchedAllContext, SearchedColumnsContext } from "../../../utils";

interface DictionaryProps {
  value: string;
  column: ColumnProps;
  dictionaries: any;
  tableLoading: boolean;
}

export const Dictionary = ({
  value,
  column,
  dictionaries,
  tableLoading,
}: DictionaryProps) => {
  const searched = useContext(SearchedAllContext);
  const searchedColumns = useContext<RecordType>(SearchedColumnsContext);

  const { columnCode } = column;
  const dictionary = dictionaries?.[columnCode];

  if (!dictionary) {
    return null;
  }

  const {
    dictionaryValueEntities,
    dictionaryName,
    dictionaryDescription,
  } = dictionary;

  const text =
    dictionaryValueEntities?.find((o: any) => o.valueCode === value)?.value ??
    "";

  return (
    <HighlightTextWrapper
      loading={tableLoading}
      text={text}
      searched={[searched, searchedColumns[column.columnCode]]}
    />
  );
};

const mapStateToProps = (state: State) => ({
  dictionaries: state?.data?.dictionaries,
  tableLoading: state?.app?.tableLoading,
});

export default connect(mapStateToProps)(Dictionary);
