import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  PERMISSIONS,
  urls,
  CLIENT_NEW_ID,
  BREADCRUMB_ROUTES,
} from "../../constants";
import { useHistory } from "react-router";
import { getFullUrl, getItemRender } from "../../utils";
import { Button, PageHeader } from "antd";
import { ComponentPermissionsChecker } from "../../wrappers";

const { CLIENTS } = PERMISSIONS;

export const ClientsHeader = ({ title }: { title?: string }) => {
  const [t] = useTranslation("clients");
  const history = useHistory();

  const handleClickAdd = useCallback(() => {
    const url = getFullUrl(urls.clients.path, CLIENT_NEW_ID);
    history.push(url);
  }, []);

  const breadcrumb = {
    routes: BREADCRUMB_ROUTES.CLIENTS,
    itemRender: getItemRender,
  };

  const extra = (
    <ComponentPermissionsChecker
      availablePermissions={[CLIENTS.ADMIN, CLIENTS.ADD]}
    >
      <Button type="primary" onClick={handleClickAdd}>
        {title || t("button.add.title")}
      </Button>
    </ComponentPermissionsChecker>
  );

  return (
    <PageHeader
      ghost={false}
      title={t("title")}
      breadcrumb={breadcrumb}
      extra={extra}
    />
  );
};

export default ClientsHeader;
