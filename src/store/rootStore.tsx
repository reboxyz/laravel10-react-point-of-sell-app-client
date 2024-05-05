import { createContext, useContext } from "react";
import AuthStore from "./authStore";
import CustomerStore from "./customerStore";
import DialogStore from "./dialogStore";
import ProductStore from "./productStore";
import AlertStore from "./alertStore";
import OrderStore from "./orderStore";

if (process.env.NODE_ENV === "development") {
  const { enableLogging } = require("mobx-logger");
  enableLogging();
}

export interface IRootStore {
  authStore: AuthStore;
  customerStore: CustomerStore;
  dialogStore: DialogStore;
  productStore: ProductStore;
  alertStore: AlertStore;
  orderStore: OrderStore;
  handleError: Function;
}

export class RootStore implements IRootStore {
  authStore: AuthStore;
  customerStore: CustomerStore;
  dialogStore: DialogStore;
  productStore: ProductStore;
  alertStore: AlertStore;
  orderStore: OrderStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.customerStore = new CustomerStore(this);
    this.dialogStore = new DialogStore(this);
    this.productStore = new ProductStore(this);
    this.alertStore = new AlertStore(this);
    this.orderStore = new OrderStore(this);
  }

  public handleError = (
    errorCode: number | null,
    errorMessage: string,
    errorData: any
  ) => {
    console.error("handleError: ", errorData);

    // Unauthenticated
    if (errorCode === 403) {
      this.authStore.setIsAuthenticated(false);
      return null;
    }
    this.alertStore.open({ status: "error", message: errorMessage });
  };
}

const rootStoreContext = createContext({
  rootStore: new RootStore(),
});

export const useStore = () => useContext(rootStoreContext);
