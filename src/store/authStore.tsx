import { makeAutoObservable } from "mobx";
import { IRootStore } from "./rootStore";

export default class AuthStore {
  BASE_URL = process.env.REACT_APP_API_URL + "/auth";

  isAuthenticated: boolean = false;
  token: string | null = null;
  rootStore: IRootStore;

  constructor(rootStore: IRootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;

    this.setToken(localStorage.getItem("_token"));
    if (this.token) this.isAuthenticated = true;
  }

  setIsAuthenticated = (value: boolean) => {
    this.isAuthenticated = value;
    if (!value) this.setToken(null);
  };

  setToken = (value: string | null) => {
    if (value) {
      localStorage.setItem("_token", value);
    } else {
      localStorage.removeItem("_token");
    }
    this.token = value;
  };

  login = async (postData: any) => {
    try {
      const response = await fetch(this.BASE_URL + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (data.error) {
        this.rootStore.handleError(response.status, data.message, data);
        //return Promise.reject(new Error(data.error));
        return Promise.reject(data.error);
      } else {
        this.setIsAuthenticated(true);
        this.setToken(data.access_token);
        return Promise.resolve(data);
      }
    } catch (error: any) {
      console.log("error", error);
      this.rootStore.handleError(400, "Something goes wrong", error);
    }
  };

  logout = async () => {
    try {
      const response = await fetch(this.BASE_URL + "/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json", // You can adjust this header as needed
        },
      });

      const data = await response.json();

      if (data.error) {
        this.rootStore.handleError(response.status, data.message, data);
        return Promise.reject(new Error(data.error));
      } else {
        this.setIsAuthenticated(false);
        return Promise.resolve(data);
      }
    } catch (error: any) {
      console.log("error", error);
      this.rootStore.handleError(400, "Something goes wrong", error);
    }
  };
}
