import { makeAutoObservable } from "mobx";
import { IRootStore } from "./rootStore";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { Box, ListItemButton } from "@mui/material";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";

export default class OrderStore {
  BASE_URL = process.env.REACT_APP_API_URL + "/v1/orders";

  rootStore: IRootStore;
  cartItems: any[] = [];

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
          <ListItemButton component={Link} to={"view/" + params.row.id}>
            <LocalPrintshopIcon />
          </ListItemButton>
        </Box>
      ),
    },
    { field: "id", headerName: "Id", width: 100 },
    { field: "order_number", headerName: "Order Name", width: 200 },
    { field: "customer_name", headerName: "Customer Name", width: 200 },
    { field: "quantity", headerName: "Quantity", width: 150 },
    { field: "price", headerName: "Price", width: 150 },
  ];

  constructor(rootStore: IRootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  setRowData(values: GridRowsProp[]) {
    this.rowData = values;
  }

  setCartItems = (items: any[]) => {
    this.cartItems = items;
  };

  addToCart = async (value: any): Promise<boolean> => {
    this.cartItems.push(value);
    return Promise.resolve(true);
  };

  removeFromCart = async (index: any) => {
    this.cartItems.splice(index, 1);
  };

  calculateFinalPrice = (
    original: number,
    discount: number,
    quantity: number
  ): number => {
    const finalPrice = original - (original * discount) / 100;
    return finalPrice * quantity;
  };

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
        this.setRowData(data.data.orders);
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

  createOrder = async (customerData: any) => {
    try {
      const postDataProducts = [...this.cartItems].map((e: any) => {
        return {
          product_id: e.product.id,
          quantity: e.quantity,
          discount: e.discount,
        };
      });

      const formData = new FormData();

      formData.append("customer_id", customerData.customer?.id);

      postDataProducts.forEach((item: any, i: number) => {
        Object.keys(item).map((key: any) => {
          return formData.append(`products[${i}][${key}]`, item[key]);
        });
      });

      const response = await fetch(this.BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
        },
        body: formData,
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

  getOrder = async (id: number | string) => {
    try {
      const response = await fetch(this.BASE_URL + `/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
          "Content-Type": "application/json", // You can adjust this header as needed
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
        const orderItems = data.data.order?.items.map((item: any) => {
          return {
            product: {
              label: item.product_name,
            },
            quantity: item.product_quantity,
            price: item.product_price,
            discount: item.product_discount,
            total: this.calculateFinalPrice(
              item.product_price,
              item.product_discount,
              item.product_quantity
            ),
          };
        });

        this.setCartItems(orderItems);
        return Promise.resolve(data.data.order);
      }
    } catch (error: any) {
      console.log("error", error);
      this.rootStore.handleError(419, "Something goes wrong", error);
    }
  };
}
