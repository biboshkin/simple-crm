import React, { useCallback, useEffect } from "react";
import { Result, Button } from "antd";
import { useTranslation } from "react-i18next";
import { setError as setErrorAction } from "../../__data__";
import { connect } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { State, ErrorAppState } from "../../__data__/interfaces";
import { ROOT_URL } from "../../constants/http";

interface ServerErrorProps {
  error: ErrorAppState;
  setError: (error: {}) => void;
}

export const ServerError = ({ error, setError }: ServerErrorProps) => {
  useEffect(() => {
    return () => {
      // очистка информации об ошибке
      setError({});
    };
  });

  const handleClick = useCallback(() => {
    setError({});
  }, [error]);

  const [t] = useTranslation("error");
  const { errorDescription } = error;

  return (
    <Result
      status="500"
      title={t("title.server")}
      subTitle={errorDescription || t("subtitle.default")}
      extra={
        <Button type="primary" onClick={handleClick}>
          {t("button")}
        </Button>
      }
    />
  );
};

const mapStateToProps = (state: State) => ({
  error: state?.persist?.error ?? {},
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setError: (error: {}) => dispatch(setErrorAction(error)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ServerError);
