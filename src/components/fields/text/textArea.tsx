import React from "react";
import { Form, Input, Col } from "antd";
import { FormFieldProps, DEFAULT_SPAN } from "../../../constants";

export const TextArea = ({
  id,
  rules,
  title,
  description,
  placeholder,
  disabled = false,
  readonly = false,
  rows = 4,
  span = DEFAULT_SPAN,
}: FormFieldProps) => {
  return (
    <Col span={span} key={id}>
      <Form.Item
        name={id}
        label={title}
        extra={description}
        rules={rules}
        style={{ width: "100%" }}
      >
        <Input.TextArea
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readonly}
          rows={rows}
        />
      </Form.Item>
    </Col>
  );
};

export default TextArea;