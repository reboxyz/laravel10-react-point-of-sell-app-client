import { makeAutoObservable } from "mobx";
import { IRootStore } from "./rootStore";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { Box, ListItemButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default class ProductStore {
  BASE_URL = process.env.REACT_APP_API_URL + "/v1/products";

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
            <DeleteIcon onClick={() => this.deleteProductDialog(params)} />
          </ListItemButton>
        </Box>
      ),
    },
    { field: "id", headerName: "Id", width: 100 },
    { field: "name", headerName: "Product Name", width: 200 },
    { field: "category", headerName: "Category", width: 200 },
    { field: "price", headerName: "Price", width: 150 },
    { field: "stock", headerName: "Stock", width: 150 },
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
        return Promise.reject(data);
      } else {
        this.setRowData(data.data.products);
        return Promise.resolve(data);
      }
    } catch (error: any) {
      console.log("error", error);
      this.rootStore.handleError(400, "Something goes wrong", error);
    }
  };

  fetchCategories = async () => {
    try {
      const response = await fetch(this.BASE_URL + "/categories", {
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
        return Promise.reject(data);
      } else {
        return Promise.resolve(data);
      }
    } catch (error: any) {
      console.log("error", error);
      this.rootStore.handleError(400, "Something goes wrong", error);
    }
  };

  // Note! postData contains 'image' file!
  createProduct = async (postData: any) => {
    try {
      const response = await fetch(this.BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
        },
        body: postData, // Note! We cannot use JSON as the upload info contains 'image'
      });

      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(
          response.status,
          `HTTP Request failed: ${response.status} ${response.statusText}, ${data.message}`,
          data
        );
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

  getProduct = async (id: number | string) => {
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
        return Promise.reject(data);
      } else {
        return Promise.resolve(data);
      }
    } catch (error: any) {
      console.log("error", error);
      this.rootStore.handleError(400, "Something goes wrong", error);
    }
  };

  // Note! postData may contain an uploaded 'image'
  updateProduct = async (id: number | string, postData: any) => {
    try {
      const response = await fetch(this.BASE_URL + `/${id}`, {
        method: "POST", // Note! Not PUT
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
        },
        body: postData,
      });

      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(
          response.status,
          `HTTP Request failed: ${response.status} ${response.statusText}, ${data.message}`,
          data
        );
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

  deleteProduct = async (id: number | string) => {
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

  deleteProductDialog = async (params: any) => {
    this.rootStore.dialogStore.openDialog({
      confirmFn: () => this.deleteProduct(params.row.id),
      dialogText: "Are you sure you want to delete this item?",
    });
  };

  getList = async (postData: any) => {
    try {
      const response = await fetch(
        this.BASE_URL + "/getList" + postData.search,
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
        return Promise.resolve(data.data.products);
      }
    } catch (error: any) {
      this.rootStore.handleError(400, "Something went wrong!", error);
    }
  };
}
