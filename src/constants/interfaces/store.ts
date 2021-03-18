import { ProfileInfoEntityProps, ClientEntityProps } from "./entities";

export interface PersistState {
  permissions: string[];
  auth: boolean;
}

export interface AppState {
  error: ErrorAppState;
  tableLoading: boolean;
  loading: boolean;
  forms: any;
}

export interface DataState {
  dictionaries: object;
  clients: ClientEntityProps[];
  profileInfo: ProfileInfoEntityProps;
}

export interface State {
  persist: PersistState;
  app: AppState;
  data: DataState;
}

export interface ErrorAppState {
  statusCode?: number;
  errorCode?: string;
  errorDescription?: string;
  errorMessage?: string;
}

export interface UpdateFormProps {
  name: string;
  data: any;
}
