import { makeAutoObservable } from "mobx";
import { IRootStore } from "./rootStore";

export default class DialogStore {
  private rootStore: IRootStore;
  private confirmFn: any = null;
  isDialogOpen = false;
  dialogText = "Are you sure?";

  constructor(rootStore: IRootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  openDialog = (data: any) => {
    this.confirmFn = data.confirmFn;
    this.dialogText = data.dialogText;
    this.isDialogOpen = true;
  };

  closeDialog = () => {
    this.confirmFn = null;
    this.dialogText = "Are you sure?";
    this.isDialogOpen = false;
  };

  confirmAction = () => {
    if (this.confirmFn) this.confirmFn();
    this.closeDialog();
  };
}
