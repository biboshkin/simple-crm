import React, { useState } from "react";
import axios from "axios";
import { Form, Typography, Row } from "antd";
import { FORM_NAME } from "./constansts";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "@reduxjs/toolkit";
import { setProfileInfo } from "../../../../__data__";
import { State, ProfileInfoProps } from "../../../../__data__/interfaces";
import { useTranslation } from "react-i18next";
import {
  createFormField,
  isValuesChanged,
  defaultErrorHandler,
  defaultSuccessHandler,
  FormContext,
} from "../../../../utils";
import {
  GUTTER_FULL_WIDTH,
  formConfig,
  urls,
  PERMISSIONS,
} from "../../../../constants";

import style from "./main.module.scss";
import { Store } from "antd/lib/form/interface";
import { FormFooter } from "../../../../components";
import { ComponentPermissionsChecker } from "../../../../wrappers";
import { useHistory } from "react-router";

const {
  profile: { FIELDS },
} = formConfig;

interface MainProps {
  profileInfo: ProfileInfoProps;
  setProfileInfo: (profileInfo: ProfileInfoProps) => void;
}

const {
  USERPROFILES: { UPDATE, UPDATE_OWNER },
} = PERMISSIONS;

export const Main = ({ profileInfo, setProfileInfo }: MainProps) => {
  const [form] = Form.useForm();
  const [t] = useTranslation(FORM_NAME);
  const history = useHistory();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const handleValuesChange = (changed: Object, allValues: Object) => {
    const isChanged = isValuesChanged(profileInfo, allValues);
    setSubmitDisabled(!isChanged);
  };

  const onFinish = async (values: Store) => {
    try {
      setSubmitLoading(true);
      const responce = await axios.put(urls.profile.entity, {
        ...profileInfo,
        ...values,
      });

      setProfileInfo(responce.data);
      setSubmitDisabled(true);

      defaultSuccessHandler(t("message.success"));
    } catch (error) {
      defaultErrorHandler({ error, defaultErrorMessage: t("message.error") });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!profileInfo.id) {
    return null;
  }

  return (
    <div className={style.container}>
      <Typography.Title level={4} className={style.title}>
        {t("title")}
      </Typography.Title>
      <Form
        onValuesChange={handleValuesChange}
        onFinish={onFinish}
        layout="vertical"
        name={FORM_NAME}
        form={form}
        initialValues={profileInfo}
      >
        <Row
          gutter={[GUTTER_FULL_WIDTH.HORIZONTAL, GUTTER_FULL_WIDTH.VERTICAL]}
        >
          {FIELDS.map((field) => (
            <ComponentPermissionsChecker
              isOwner={profileInfo?.isOwner}
              availablePermissions={field.permissions}
              mode="readonly"
            >
              <FormContext.Provider value={form}>
                {createFormField(field)}
              </FormContext.Provider>
            </ComponentPermissionsChecker>
          ))}
        </Row>
        <FormFooter
          permissions={[UPDATE, UPDATE_OWNER]}
          loading={submitLoading}
          disabled={submitDisabled}
          onCancel={history.goBack}
        />
      </Form>
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  profileInfo: state?.data?.profileInfo,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ setProfileInfo }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
