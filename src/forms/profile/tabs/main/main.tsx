import React, { useState } from "react";
import axios from "axios";
import { Form, Typography, Row, Button, message } from "antd";
import { FORM_NAME } from "./constansts";
import { connect } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setLoading, setProfileInfo } from "../../../../__data__";
import { State, ProfileInfoProps } from "../../../../__data__/interfaces";
import { useTranslation } from "react-i18next";
import {
  createFormField,
  isValuesChanged,
  logger,
  defaultErrorHandler,
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
  setProfile: (profileInfo: ProfileInfoProps) => void;
  setLoading: (loading: boolean) => void;
}

const {
  PROFILE_INFO: { ADMIN, UPDATE, UPDATE_OWNER },
} = PERMISSIONS;

export const Main = ({ profileInfo, setProfile }: MainProps) => {
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

      setProfile(responce.data);
      setSubmitDisabled(true);
      logger.debug(t("message.success"));
      message.success(t("message.success"));
    } catch (error) {
      defaultErrorHandler({ error, defaultErrorMessage: t("message.error") });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className={style.container}>
      <Typography.Title level={4}>{t("title")}</Typography.Title>
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
              availablePermissions={field.permissions}
              mode="disabled"
            >
              {createFormField(field)}
            </ComponentPermissionsChecker>
          ))}
        </Row>
        <FormFooter
          permissions={[ADMIN, UPDATE, UPDATE_OWNER]}
          loading={submitLoading}
          disabled={submitDisabled}
          onCancel={history.goBack}
        />
      </Form>
    </div>
  );
};

const mapStateToProps = (state: State) => ({
  profileInfo: state?.persist?.profileInfo ?? {},
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setProfile: (profileInfo: ProfileInfoProps) => {
    dispatch(setProfileInfo(profileInfo));
  },
  setLoading: (loading: boolean) => dispatch(setLoading(loading)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
