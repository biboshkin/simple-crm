import React, { useEffect, SyntheticEvent, useState } from "react";
import axios from "axios";
import { Form as FormUI, Input, Button, message } from "antd";
import { LockOutlined } from "@ant-design/icons";

import { useTranslation } from "react-i18next";

import { useHistory } from "react-router-dom";
import { Store } from "antd/lib/form/interface";
import { connect } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import style from "./restore-password.module.scss";
import { urls } from "../../constants";
import { FIELDS, FORM_NAME } from "./constants";
import { defaultErrorHandler, defaultSuccessHandler } from "../../utils";

import { getRules, checkEqualPasswords, checkToken, getToken } from "./utils";
import * as actions from "../../__data__";
import { LoginHeader } from "../../components";

const { Item } = FormUI;
const token = getToken();

interface RestorePasswordProps {
  setLoading: (loading: boolean) => void;
}

export const RestorePassword = ({ setLoading }: RestorePasswordProps) => {
  const [form] = FormUI.useForm();
  const [t] = useTranslation(FORM_NAME);
  const history = useHistory();
  const [submitLoading, setSubmitLoading] = useState(false);
  const rules = getRules(t);

  useEffect(() => {
    checkToken(token, t, setLoading);
  }, []);

  const handleClick = (event: SyntheticEvent) => {
    if (!checkEqualPasswords(form)) {
      message.error("Пароли не совпадают", 5);
      event.preventDefault();
    }
  };

  const onFinish = async ({ [FIELDS.PASSWORD]: password }: Store) => {
    try {
      setSubmitLoading(true);
      await axios.post(urls.restorePassword.submit, { password, token });
      defaultSuccessHandler(t("message.success"));
      history.push(urls.main.path);
    } catch (error) {
      defaultErrorHandler({ error, defaultErrorMessage: t("message.error") });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div>
      <LoginHeader title={t("title")} description={t("description")} />
      <FormUI
        form={form}
        name={FORM_NAME}
        className={style.restorePassword}
        onFinish={onFinish}
      >
        <Item name={FIELDS.PASSWORD} rules={rules.password}>
          <Input.Password
            className={style.password}
            prefix={<LockOutlined />}
            type="password"
            placeholder={t("placeholder.password")}
          />
        </Item>
        <Item name={FIELDS.PASSWORD_CONFIRM} rules={rules.password}>
          <Input.Password
            className={style.passwordConfirm}
            prefix={<LockOutlined />}
            type="password"
            placeholder={t("placeholder.password.confirm")}
          />
        </Item>
        <Item>
          <Button
            onClick={handleClick}
            type="primary"
            htmlType="submit"
            className={style.submitButton}
            loading={submitLoading}
          >
            {t("submit.button")}
          </Button>
        </Item>
      </FormUI>
    </div>
  );
};

export default RestorePassword;
