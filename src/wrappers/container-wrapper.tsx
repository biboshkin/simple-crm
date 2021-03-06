import React, { ReactNode, useEffect, useMemo } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { isEmpty } from "lodash";
import { Loader } from "../components";
import {
  State,
  ProfileInfoEntityProps,
  ErrorAppState,
  urls,
} from "../constants";
import { useFetch } from "../utils";
import { setProfileInfo, setPermissions } from "../__data__";

interface ContainerWrapperProps {
  children: ReactNode;
  error: ErrorAppState;
}

interface CredentialsProps {
  permissions: string[];
  roles: string[];
}

export const ContainerWrapper = ({
  children,
  error,
}: ContainerWrapperProps) => {
  const dispatch = useDispatch();

  const { permissions, profileInfo } = useSelector(
    (state: State) => state?.persist
  );

  const [profile] = useFetch<ProfileInfoEntityProps>({
    url: urls.profile.entity,
    initial: {},
  });

  const [credentials] = useFetch<CredentialsProps>({
    url: urls.profile.credentials,
  });

  useEffect(() => {
    dispatch(setProfileInfo(profile));
    dispatch(setPermissions(credentials?.permissions ?? []));
  }, [credentials, profile, dispatch]);

  const loading = useMemo(() => isEmpty(profileInfo) || isEmpty(permissions), [
    profileInfo,
    permissions,
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

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
};

const mapStateToProps = (state: State) => ({
  error: state?.app?.error,
});

export default connect(mapStateToProps)(ContainerWrapper);
