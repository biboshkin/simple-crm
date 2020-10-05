import React, { ReactNode, useEffect, useState } from "react";
import { bindActionCreators, Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { connect } from "react-redux";
import {
  ClientEntityProps,
  TaskEntityProps,
  TASK_STATUSES,
  urls,
} from "../constants";
import { defaultErrorHandler, useFetch, getRsqlParams } from "../utils";
import { State, ProfileInfoProps, ErrorAppState } from "../__data__/interfaces";
import {
  setLoading,
  setProfileInfo,
  setPermissions,
  setTasks,
} from "../__data__";
import { Redirect } from "react-router";
import { getCompletedTasksRsql } from "../forms/tasks/utils";
import { setClients } from "../__data__";

interface ContainerWrapperProps {
  children: ReactNode;
  profileInfo: ProfileInfoProps;
  permissions: string[];
  error: ErrorAppState;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setTasks: (tasks: TaskEntityProps[]) => void;
  setPermissions: (permissions: string[]) => void;
  setProfileInfo: (profile: ProfileInfoProps) => void;
  setClients: (clients: ClientEntityProps[]) => void;
}

export const ContainerWrapper = ({
  children,
  profileInfo,
  error,
  setLoading,
  setTasks,
  setPermissions,
  setProfileInfo,
  setClients,
}: ContainerWrapperProps) => {
  const [tasksLoading, setTasksLoading] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(false);
  const { response: profileResponse, loading: profileLoading } = useFetch({
    url: urls.profile.entity,
  });

  const {
    response: permissionsResponse,
    loading: permissionsLoading,
  } = useFetch({
    url: urls.profile.permissions,
  });

  const fetchClientsPersonal = async (userProfileId: string) => {
    try {
      setClientsLoading(true);
      const url = urls.clients.entity;
      const query = getRsqlParams([
        { key: "userProfileId", value: userProfileId },
      ]);
      const response = await axios.get(url, { params: { query } });
      setClients(response?.data ?? []);
    } catch (error) {
      defaultErrorHandler({ error });
    } finally {
      setClientsLoading(false);
    }
  };

  const fetchTasks = async (userProfileId: string) => {
    setTasksLoading(true);
    const query = getRsqlParams([
      { key: "userProfileId", value: userProfileId },
      getCompletedTasksRsql(TASK_STATUSES.NOT_COMPLETED),
    ]);
    try {
      const responce = await axios.get(urls.tasks.entity, {
        params: { query },
      });
      setTasks(responce?.data ?? []);
    } catch (error) {
      defaultErrorHandler({
        error,
      });
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    setProfileInfo(profileResponse?.data ?? {});
    setPermissions(permissionsResponse?.data?.permissions ?? []);
  }, [profileResponse, permissionsResponse]);

  useEffect(() => {
    if (profileInfo.id) {
      fetchTasks(profileInfo.id);
      fetchClientsPersonal(profileInfo.id);
    }
  }, [profileInfo.id]);

  useEffect(() => {
    const isLoaded =
      profileLoading || permissionsLoading || tasksLoading || clientsLoading;
    setLoading(isLoaded);
  }, [
    profileLoading,
    permissionsLoading,
    tasksLoading,
    clientsLoading,
    setLoading,
  ]);

  if (error.statusCode) {
    return (
      <Redirect
        to={{
          pathname: urls.error.path,
          state: { error },
        }}
      />
    );
  }

  return <React.Fragment>{children}</React.Fragment>;
};

const mapStateToProps = (state: State) => ({
  profileInfo: state?.data?.profileInfo,
  permissions: state?.persist?.permissions,
  loading: state?.app?.loading,
  error: state?.app?.error,
  auth: state?.persist?.auth,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setTasks,
      setPermissions,
      setProfileInfo,
      setLoading,
      setClients,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(ContainerWrapper);
