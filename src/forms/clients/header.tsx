import React, { ReactNode, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { Button, Space } from "antd";
import {
  PERMISSIONS,
  urls,
  CLIENT_NEW_ID,
  BREADCRUMB_ROUTES,
} from "../../constants";
import { getFullUrl, getItemRender } from "../../utils";
import { ComponentPermissionsChecker } from "../../wrappers";
import { FormHeader } from "../../components";

interface ClientsHeaderProps {
  title?: string;
  footer?: ReactNode;
}

export const ClientsHeader: React.FC<ClientsHeaderProps> = ({
  title,
  footer,
}) => {
  const [t] = useTranslation("clients");
  const history = useHistory();

  const handleClickAdd = useCallback(() => {
    const url = getFullUrl(urls.clients.path, CLIENT_NEW_ID);
    history.push(url);
  }, [history]);

  const breadcrumb = {
    routes: BREADCRUMB_ROUTES.CLIENTS,
    itemRender: getItemRender,
  };

  const extra = (
    <Space>
      <ComponentPermissionsChecker
        availablePermissions={[PERMISSIONS.CLIENTS["ADD.ALL"]]}
      >
        <>
          <Button type="primary" onClick={handleClickAdd}>
            {title || t("button.add.title")}
          </Button>
        </>
      </ComponentPermissionsChecker>
    </Space>
  );

  return (
    <FormHeader
      title={t("title")}
      breadcrumb={breadcrumb}
      extra={extra}
      footer={footer}
    />
  );
};
