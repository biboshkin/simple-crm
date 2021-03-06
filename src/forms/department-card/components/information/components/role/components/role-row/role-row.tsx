import React, { CSSProperties, ReactNode } from "react";
import { Col, Row, Space, Spin } from "antd";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Info, Person } from "./component";
import { getConformedValue } from "../../../../../../../../utils";

interface RoleRowProps {
  title: string;
  style?: CSSProperties;
  phone?: string;
  email?: string;
  fullName?: string;
  actions?: ReactNode;
}

export const RoleRow: React.FC<RoleRowProps> = ({
  title,
  fullName = "",
  phone = "",
  email = "",
  style = {},
  actions = null,
}) => {
  const [t] = useTranslation("departmentInformation");
  const conformedPhone = getConformedValue(phone);

  const colSpan = { xxl: 4, xl: 6, lg: 8, md: 24, sm: 24, xs: 24 };

  return (
    <Row
      align="middle"
      wrap={false}
      className="background-lightgray"
      style={{
        padding: "8px 16px",
        ...style,
      }}
    >
      <Col flex="auto">
        <Row align="middle" gutter={[16, 8]}>
          <Col {...colSpan}>
            <Person name={fullName} title={title} />
          </Col>
          {phone && (
            <Col {...colSpan}>
              <Info
                icon={<PhoneOutlined />}
                text={t("role.row.phone", { phone: conformedPhone })}
              />
            </Col>
          )}
          {email && (
            <Col {...colSpan}>
              <Info icon={<MailOutlined />} text={email} />
            </Col>
          )}
        </Row>
      </Col>
      <Col>
        <Space size="middle">{actions}</Space>
      </Col>
    </Row>
  );
};

export default RoleRow;
