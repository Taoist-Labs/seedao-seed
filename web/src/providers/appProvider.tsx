import React, { useReducer, createContext, useContext } from "react";

interface IState {
  show_login_modal?: boolean;
  loading: boolean;
  themeMode: "light" | "dark";
}

export enum AppActionType {
  SET_LOGIN_MODAL = "set_login_modal",
  SET_LOADING = "SET_LOADING",
  SET_THEME_MODE = "SET_THEME_MODE",
}

interface IAction {
  type: AppActionType;
  payload: any;
}

const INIT_STATE: IState = {
  show_login_modal: false,
  loading: false,
  themeMode: "light",
};

const AuthContext = createContext<{
  state: IState;
  dispatch: React.Dispatch<IAction>;
}>({
  state: INIT_STATE,
  dispatch: () => null,
});

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case AppActionType.SET_LOGIN_MODAL:
      return { ...state, show_login_modal: action.payload };
    case AppActionType.SET_LOADING:
      return { ...state, loading: action.payload };
    case AppActionType.SET_THEME_MODE:
      return { ...state, themeMode: action.payload };
    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
};

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAppContext = () => ({ ...useContext(AuthContext) });

export default AppProvider;
