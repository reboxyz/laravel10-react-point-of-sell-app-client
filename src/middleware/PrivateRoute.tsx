import React from "react";
import { useStore } from "../store/rootStore";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

const PrivateRoute: React.FC<{
  element: JSX.Element;
}> = ({ element }) => {
  const { rootStore } = useStore();
  const { authStore } = rootStore;

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return element;
};

export default observer(PrivateRoute);
