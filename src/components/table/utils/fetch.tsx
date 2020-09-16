import { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { isEmpty, values } from "lodash";
import { useDispatch } from "react-redux";
import { defaultErrorHandler, defaultSuccessHandler } from "../../../utils";
import { setDictionaries, setTableLoading } from "../../../__data__";

export const fetchTotalCount = async (
  url: string,
  setLoadingCallback: Function,
  setResultCallback: Function
) => {
  try {
    setLoadingCallback(true);
    const responce = await axios.get(url, { params: { tableMeta: true } });
    const { totalCount } = responce?.data ?? {};
    setResultCallback(totalCount);
  } catch (error) {
    defaultErrorHandler({ error });
  } finally {
    setLoadingCallback(false);
  }
};

export const fetchData = async (
  url: string,
  params: { [key: string]: string | number | boolean },
  setLoadingCallback: Function,
  setResultCallback: Function
) => {
  try {
    setLoadingCallback(true);
    const response = await axios.get(url, { params });
    setResultCallback(response?.data ?? []);
  } catch (error) {
    defaultErrorHandler({ error });
  } finally {
    setLoadingCallback(false);
  }
};

export const fetchDictionaries = async (
  links: {
    [key: string]: { href: string };
  },
  dispatch: Dispatch
) => {
  if (!isEmpty(links)) {
    const keys = Object.keys(links);

    keys.forEach(async (key) => {
      dispatch(setTableLoading(true));
      try {
        const response = await axios.get(links[key].href);
        const dictionary = { [key]: response?.data ?? [] };
        dispatch(setDictionaries(dictionary));
      } catch (error) {
        defaultErrorHandler({ error });
      }
      dispatch(setTableLoading(true));
    });
  }
};
