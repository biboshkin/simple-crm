import React, { useState, useCallback, useContext, useEffect } from "react";
import axios from "axios";
import { Col, Form, Select, Spin } from "antd";
import { useSelector } from "react-redux";
import { DEFAULT_FIELD_SPAN, FieldProps, State } from "../../../constants";
import {
  defaultErrorHandler,
  FormContext,
  getRsqlParams,
  getEqualRsql,
  getSearchRsql,
} from "../../../utils";
import { Readonly } from "../readonly";

const { Option } = Select;

// TODO костыль до первого запроса (первый запрос)
export const Entity = ({
  fieldCode,
  rules,
  fieldName,
  titleField = "value",
  codeField = "valueCode",
  fieldDescription,
  placeholder = "Выберите значение",
  disabled = false,
  readonly = false,
  _links,
  span = DEFAULT_FIELD_SPAN,
}: FieldProps) => {
  const url = _links?.self.href ?? "";
  const form = useContext(FormContext);
  const [options, setOptions] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const profileInfoId = useSelector(
    (state: State) => state?.persist?.profileInfo?.id
  );

  const fetchEntity = useCallback(
    async (query: string) => {
      try {
        setLoading(true);
        const response = await axios.get(url, {
          params: { query },
        });
        setOptions(response?.data ?? []);
      } catch (error) {
        defaultErrorHandler({ error });
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  useEffect(() => {
    const initialValue = form.getFieldValue(fieldCode);

    if (profileInfoId && initialValue) {
      const initialQuery = getRsqlParams([
        { key: "userProfileId", value: profileInfoId },
        getEqualRsql(codeField, initialValue),
      ]);
      fetchEntity(initialQuery);
    }
  }, [profileInfoId, fetchEntity, fieldCode, codeField, form]);

  const handleSearch = useCallback(
    (value) => {
      if (profileInfoId) {
        const searchedQuery = getRsqlParams([
          { key: "userProfileId", value: profileInfoId },
          getSearchRsql([titleField], value),
        ]);
        fetchEntity(searchedQuery);
      }
    },
    [titleField, profileInfoId, fetchEntity]
  );

  const formatFunc = (value: string) =>
    options.find((o: any) => o[codeField] === value)?.[titleField] ?? "";

  return (
    <Col {...span} key={fieldCode}>
      <Form.Item
        name={fieldCode}
        label={fieldName}
        style={{ width: "100%" }}
        extra={fieldDescription}
        rules={rules}
        validateTrigger="onBlur"
      >
        {readonly ? (
          <Readonly format={formatFunc} />
        ) : (
          <Select
            showSearch
            defaultActiveFirstOption={false}
            filterOption={false}
            onSearch={handleSearch}
            placeholder={placeholder}
            style={{ width: "100%" }}
            disabled={disabled}
            notFoundContent={loading ? <Spin size="small" /> : null}
            showArrow={false}
          >
            {options.map((o: any) => (
              <Option key={o[codeField]} value={o[codeField]}>
                {o[titleField]}
              </Option>
            ))}
          </Select>
        )}
      </Form.Item>
    </Col>
  );
};

export default Entity;
