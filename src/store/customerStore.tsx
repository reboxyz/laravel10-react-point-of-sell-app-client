import { makeAutoObservable } from "mobx";
import { IRootStore } from "./rootStore";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { Box, ListItemButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default class CustomerStore {
  BASE_URL = process.env.REACT_APP_API_URL + "/v1/customers";

  rootStore: IRootStore;
  rowData: GridRowsProp[] = [];
  columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false, // Disable sorting
      filterable: false, // Disable filtering
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ListItemButton component={Link} to={"edit/" + params.row.id}>
            <EditIcon />
          </ListItemButton>
          <ListItemButton>
            <DeleteIcon onClick={() => this.deleteCustomerDialog(params)} />
          </ListItemButton>
        </Box>
      ),
    },
    { field: "id", headerName: "Id", width: 100 },
    { field: "first_name", headerName: "First Name", width: 150 },
    { field: "last_name", headerName: "Last Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone_number", headerName: "Phone Number", width: 200 },
    { field: "zip_code", headerName: "Zip Code", width: 150 },
  ];

  constructor(rootStore: IRootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  setRowData(values: GridRowsProp[]) {
    this.rowData = values;
  }

  // API Calls
  fetchList = async () => {
    try {
      const response = await fetch(this.BASE_URL + "/list", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(
          response.status,
          `HTTP Request failed: ${response.status} ${response.statusText}`,
          data
        );
        //return Promise.reject(new Error(data));
        return Promise.reject(data);
      } else {
        this.setRowData(data.data.customers);
        return Promise.resolve(data);
      }
    } catch (error: any) {
      console.log("error", error);
      this.rootStore.handleError(400, "Something goes wrong", error);
    }
  };

  createCustomer = async (postData: any) => {
    try {
      const response = await fetch(this.BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(
          response.status,
          `HTTP Request failed: ${response.status} ${response.statusText}, ${data.message}`,
          data
        );
        //return Promise.reject(new Error(data));
        return Promise.reject(data);
      } else {
        this.rootStore.alertStore.open({
          status: "success",
          message: data.message,
        });
        return Promise.resolve(data);
      }
    } catch (error: any) {
      console.log("error", error);
      this.rootStore.handleError(400, "Something goes wrong", error);
    }
  };

  getCustomer = async (id: number | string) => {
    try {
      const response = await fetch(this.BASE_URL + `/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(
          response.status,
          `HTTP Request failed: ${response.status} ${response.statusText}, ${data.message}`,
          data
        );
        //return Promise.reject(new Error(data));
        return Promise.reject(data);
      } else {
        return Promise.resolve(data);
      }
    } catch (error: any) {
      console.log("error", error);
      this.rootStore.handleError(400, "Something goes wrong", error);
    }
  };

  updateCustomer = async (id: number | string, postData: any) => {
    try {
      const response = await fetch(this.BASE_URL + `/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(
          response.status,
          `HTTP Request failed: ${response.status} ${response.statusText}, ${data.message}`,
          data
        );
        //return Promise.reject(new Error(data));
        return Promise.reject(data);
      } else {
        this.rootStore.alertStore.open({
          status: "success",
          message: data.message,
        });
        return Promise.resolve(data);
      }
    } catch (error: any) {
      console.log("error", error);
      this.rootStore.handleError(400, "Something goes wrong", error);
    }
  };

  deleteCustomer = async (id: number | string) => {
    try {
      const response = await fetch(this.BASE_URL + `/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(
          response.status,
          `HTTP Request failed: ${response.status} ${response.statusText}, ${data.message}`,
          data
        );
        //return Promise.reject(new Error(data));
        return Promise.reject(data);
      } else {
        this.setRowData(this.rowData.filter((e: any) => e.id !== id));
        this.rootStore.alertStore.open({
          status: "success",
          message: data.message,
        });
        return Promise.resolve(data);
      }
    } catch (error: any) {
      console.log("error", error);
      this.rootStore.handleError(400, "Something goes wrong", error);
    }
  };

  deleteCustomerDialog = async (params: any) => {
    this.rootStore.dialogStore.openDialog({
      confirmFn: () => this.deleteCustomer(params.row.id),
      dialogText: "Are you sure you want to delete this item?",
    });
  };

  getList = async (postData: any) => {
    try {
      const response = await fetch(
        this.BASE_URL + "/getList?search=" + postData.search,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.rootStore.authStore.token}`,
            "Content-Type": "application/json", // You can adjust this header as needed
          },
        }
      );
      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(
          response.status,
          `HTTP Request failed: ${response.status} ${response.statusText}`,
          data
        );
        return Promise.reject(data);
      } else {
        return Promise.resolve(data.data.customers);
      }
    } catch (error: any) {
      this.rootStore.handleError(400, "Something went wrong!", error);
    }
  };
}
