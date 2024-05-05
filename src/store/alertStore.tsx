import { makeAutoObservable } from "mobx";
import { IRootStore } from "./rootStore";
import { AlertColor } from "@mui/material";

interface AlertData {
  status: AlertColor;
  message: string;
  data?: any;
}

export default class AlertStore {
  private rootStore: IRootStore;

  isAlertOpen = false;
  alertData: AlertData | null = {
    status: "error",
    message: "This is an error",
    data: [],
  };

  constructor(rootStore: IRootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  open = (data: AlertData) => {
    this.alertData = data;
    this.isAlertOpen = true;
  };

  close = () => {
    this.alertData = null;
    this.isAlertOpen = false;
  };
}
